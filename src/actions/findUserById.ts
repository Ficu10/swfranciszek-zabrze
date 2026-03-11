'use server';

import { requireUserEditPermission } from '@/lib/auth-utils';
import { db } from '@/lib/db';

export default async function findUserById(id: string) {
	try {
		await requireUserEditPermission(id);

		const user = await db.user.findUnique({
			where: {
				id: id,
			},
			select: {
				id: true,
				username: true,
				firstname: true,
				lastname: true,
				role: true,
			},
		});

		if (!user) {
			throw new Error('Nie znaleziono użytkownika');
		}

		return user;
	} catch (error) {
		throw new Error('Błąd przy pobieraniu danych z bazy danych');
	}
}
