'use server';

import { db } from '@/lib/db';
import {
	requireAdminOrModerator,
	createErrorResponse,
	createSuccessResponse,
} from '@/lib/auth-utils';
import { sanitizeHtml } from '@/lib/sanitize-server';

interface FunduszeEuropejskieProps {
	content: string;
}

const saveFunduszeEuropejskieData = async (data: FunduszeEuropejskieProps) => {
	try {
		await requireAdminOrModerator();

		const sanitizedContent = await sanitizeHtml(data.content);
		const existing = await db.funduszeEuropejskie.findFirst({
			orderBy: { createdAt: 'asc' },
		});

		if (existing) {
			await db.funduszeEuropejskie.update({
				where: { id: existing.id },
				data: { content: sanitizedContent },
			});
		} else {
			await db.funduszeEuropejskie.create({
				data: { content: sanitizedContent },
			});
		}

		return createSuccessResponse('Fundusze Europejskie updated successfully');
	} catch (error) {
		console.error('Error saving Fundusze Europejskie data:', error);
		return createErrorResponse(error);
	}
};

export default saveFunduszeEuropejskieData;
