'use server';

import { auth } from '@/auth/auth';
import { isAdmin } from '@/lib/permissions';
// Database

import { db } from '@/lib/db';

export default async function deleteUser(id: string) {
	const session = await auth();

	if (!session?.user) {
		return { error: 'Twoja sesja nie istnieje!' };
	}

	const canDeleteUser = isAdmin(session.user.role) || session.user.id === id;

	if (!canDeleteUser) {
		return {
			error: 'Nie masz uprawnień do usunięcia tego konta',
		};
	}
	try {
		const deletedUser = await db.user.delete({
			where: {
				id: id,
			},
		});
		return deletedUser;
	} catch (error) {
		throw new Error('Błąd przy pobieraniu danych z bazy danych');
	}
}
