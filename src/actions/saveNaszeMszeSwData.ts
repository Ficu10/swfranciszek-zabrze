'use server';

import { db } from '@/lib/db';
import {
	requireAdmin,
	createErrorResponse,
	createSuccessResponse,
} from '@/lib/auth-utils';
import { sanitizeHtml } from '@/lib/sanitize-server';

interface NaszeMszeSwProps {
	content: string;
}

const saveNaszeMszeSwData = async (data: NaszeMszeSwProps) => {
	try {
		await requireAdmin();

		const sanitizedContent = await sanitizeHtml(data.content);
		const existing = await db.naszeMszeSw.findFirst({
			orderBy: { createdAt: 'asc' },
		});

		if (existing) {
			await db.naszeMszeSw.update({
				where: { id: existing.id },
				data: { content: sanitizedContent },
			});
		} else {
			await db.naszeMszeSw.create({
				data: { content: sanitizedContent },
			});
		}

		return createSuccessResponse('Nasze Msze święte updated successfully');
	} catch (error) {
		console.error('Error saving nasze msze data:', error);
		return createErrorResponse(error);
	}
};

export default saveNaszeMszeSwData;
