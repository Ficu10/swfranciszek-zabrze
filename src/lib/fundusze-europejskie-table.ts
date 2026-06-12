import { db } from '@/lib/db';

export const ensureFunduszeEuropejskieTable = async () => {
	await db.$executeRawUnsafe(`
		CREATE TABLE IF NOT EXISTS "FunduszeEuropejskie" (
			"id" TEXT NOT NULL,
			"content" TEXT NOT NULL DEFAULT '',
			"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
			"updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
			CONSTRAINT "FunduszeEuropejskie_pkey" PRIMARY KEY ("id")
		);
	`);
};
