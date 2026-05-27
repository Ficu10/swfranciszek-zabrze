import { NextResponse } from 'next/server';
import { auth } from '@/auth/auth';
import { db } from '@/lib/db';
import { isAdmin } from '@/lib/permissions';
import {
	ensurePageVisitTable,
	isMissingPageVisitTableError,
} from '@/lib/page-visit-table';

export const runtime = 'nodejs';

export async function GET(request: Request) {
	try {
		const session = await auth();

		if (!session?.user || !isAdmin(session.user.role)) {
			return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
		}

		const { searchParams } = new URL(request.url);
		const range = searchParams.get('range') || '7d';

		let startDate: Date;
		const now = new Date();

		switch (range) {
			case '1d':
				startDate = new Date(now);
				startDate.setHours(0, 0, 0, 0);
				break;
			case '7d':
				startDate = new Date(now);
				startDate.setDate(startDate.getDate() - 6);
				startDate.setHours(0, 0, 0, 0);
				break;
			case '30d':
				startDate = new Date(now);
				startDate.setDate(startDate.getDate() - 29);
				startDate.setHours(0, 0, 0, 0);
				break;
			case '12m':
				startDate = new Date(now);
				startDate.setMonth(startDate.getMonth() - 11);
				startDate.setDate(1);
				startDate.setHours(0, 0, 0, 0);
				break;
			default:
				startDate = new Date(now);
				startDate.setDate(startDate.getDate() - 6);
				startDate.setHours(0, 0, 0, 0);
		}

		let visits: { visitedAt: Date }[] = [];
		try {
			visits = await db.pageVisit.findMany({
				where: {
					visitedAt: { gte: startDate },
				},
				select: { visitedAt: true },
				orderBy: { visitedAt: 'asc' },
			});
		} catch (error) {
			if (!isMissingPageVisitTableError(error)) {
				throw error;
			}

			await ensurePageVisitTable();
			visits = [];
		}

		// Today's count
		const todayStart = new Date();
		todayStart.setHours(0, 0, 0, 0);
		const todayCount = visits.filter(
			(v) => v.visitedAt >= todayStart
		).length;

		// Group by appropriate time bucket
		const buckets: Record<string, number> = {};

		if (range === '1d') {
			// Group by hour
			for (let h = 0; h < 24; h++) {
				const label = `${String(h).padStart(2, '0')}:00`;
				buckets[label] = 0;
			}
			for (const v of visits) {
				const hour = v.visitedAt.getHours();
				const label = `${String(hour).padStart(2, '0')}:00`;
				buckets[label] = (buckets[label] || 0) + 1;
			}
		} else if (range === '12m') {
			// Group by month
			const cursor = new Date(startDate);
			while (cursor <= now) {
				const label = cursor.toLocaleDateString('pl-PL', {
					month: 'short',
					year: 'numeric',
				});
				buckets[label] = 0;
				cursor.setMonth(cursor.getMonth() + 1);
			}
			for (const v of visits) {
				const label = v.visitedAt.toLocaleDateString('pl-PL', {
					month: 'short',
					year: 'numeric',
				});
				if (label in buckets) buckets[label] = (buckets[label] || 0) + 1;
			}
		} else {
			// Group by day
			const cursor = new Date(startDate);
			while (cursor <= now) {
				const label = cursor.toLocaleDateString('pl-PL', {
					day: '2-digit',
					month: '2-digit',
				});
				buckets[label] = 0;
				cursor.setDate(cursor.getDate() + 1);
			}
			for (const v of visits) {
				const label = v.visitedAt.toLocaleDateString('pl-PL', {
					day: '2-digit',
					month: '2-digit',
				});
				if (label in buckets) buckets[label] = (buckets[label] || 0) + 1;
			}
		}

		const chartData = Object.entries(buckets).map(([label, count]) => ({
			label,
			count,
		}));

		return NextResponse.json({ todayCount, chartData });
	} catch (error) {
		if (isMissingPageVisitTableError(error)) {
			return NextResponse.json(
				{
					todayCount: 0,
					chartData: [],
					degraded: true,
					message: 'Tabela statystyk odwiedzin nie jest jeszcze gotowa',
				},
				{ status: 200 }
			);
		}

		console.error('Visit stats error:', error);
		return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
	}
}
