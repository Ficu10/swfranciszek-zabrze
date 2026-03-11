'use server';

import { db } from '@/lib/db';

export default async function findPostBySlug(slug: string) {
	try {
		const post = await db.post.findUnique({
			where: {
				slug,
			},
		});

		return post;
	} catch (error) {
		throw new Error('Błąd przy pobieraniu danych z bazy danych');
	}
}
