'use server';

import { db } from '@/lib/db';
import {
	requireAdmin,
	createErrorResponse,
	createSuccessResponse,
} from '@/lib/auth-utils';
import { sanitizeHtml } from '@/lib/sanitize-server';

interface MszeSwWZabrzuProps {
	content: string;
}

const saveMszeSwWZabrzuData = async (data: MszeSwWZabrzuProps) => {
	try {
		await requireAdmin();

		const sanitizedContent = await sanitizeHtml(data.content);
		const existing = await db.mszeSwWZabrzu.findFirst({
			orderBy: { createdAt: 'asc' },
		});

		if (existing) {
			await db.mszeSwWZabrzu.update({
				where: { id: existing.id },
				data: { content: sanitizedContent },
			});
		} else {
			await db.mszeSwWZabrzu.create({
				data: { content: sanitizedContent },
			});
		}

		return createSuccessResponse('Msze święte updated successfully');
	} catch (error) {
		console.error('Error saving msze święte data:', error);
		return createErrorResponse(error);
	}
};

export default saveMszeSwWZabrzuData;
