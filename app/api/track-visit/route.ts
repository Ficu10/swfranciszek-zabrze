import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
	ensurePageVisitTable,
	isMissingPageVisitTableError,
} from '@/lib/page-visit-table';

export const runtime = 'nodejs';

export async function POST(request: Request) {
	try {
		const { path } = await request.json().catch(() => ({ path: '/' }));

		try {
			await db.pageVisit.create({
				data: {
					path: path || '/',
				},
			});
		} catch (error) {
			if (!isMissingPageVisitTableError(error)) {
				throw error;
			}

			await ensurePageVisitTable();

			await db.pageVisit.create({
				data: {
					path: path || '/',
				},
			});
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		// Silently fail - tracking should never break the site
		return NextResponse.json({ success: false }, { status: 200 });
	}
}
