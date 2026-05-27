import { db } from '@/lib/db';

export const isMissingPageVisitTableError = (error: unknown) => {
	if (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		(error as { code?: string }).code === 'P2021'
	) {
		return true;
	}

	if (
		error instanceof Error &&
		error.message.includes('PageVisit') &&
		error.message.includes('does not exist')
	) {
		return true;
	}

	return false;
};

export const ensurePageVisitTable = async () => {
	await db.$executeRawUnsafe(`
		CREATE TABLE IF NOT EXISTS "PageVisit" (
			"id" TEXT NOT NULL,
			"visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
			"path" TEXT NOT NULL DEFAULT '/',
			CONSTRAINT "PageVisit_pkey" PRIMARY KEY ("id")
		);
	`);

	await db.$executeRawUnsafe(`
		CREATE INDEX IF NOT EXISTS "PageVisit_visitedAt_idx"
		ON "PageVisit" ("visitedAt");
	`);
};
