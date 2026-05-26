import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request: Request) {
	try {
		const { path } = await request.json().catch(() => ({ path: '/' }));

		await db.pageVisit.create({
			data: {
				path: path || '/',
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		// Silently fail - tracking should never break the site
		return NextResponse.json({ success: false }, { status: 200 });
	}
}
