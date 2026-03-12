'use server';

import { db } from '@/lib/db';
import {
	requireAdmin,
	createErrorResponse,
	createSuccessResponse,
} from '@/lib/auth-utils';
import { sanitizeHtml } from '@/lib/sanitize-server';

interface KancelariaProps {
	content: string;
}

const saveKancelariaData = async (data: KancelariaProps) => {
	try {
		await requireAdmin();

		const sanitizedContent = await sanitizeHtml(data.content);
		const existing = await db.kancelaria.findFirst({
			orderBy: { createdAt: 'asc' },
		});

		if (existing) {
			await db.kancelaria.update({
				where: { id: existing.id },
				data: { content: sanitizedContent },
			});
		} else {
			await db.kancelaria.create({
				data: { content: sanitizedContent },
			});
		}

		return createSuccessResponse('Kancelaria updated successfully');
	} catch (error) {
		console.error('Error saving kancelaria data:', error);
		return createErrorResponse(error);
	}
};

export default saveKancelariaData;
