'use server';

import bcrypt from 'bcryptjs';

import * as z from 'zod';
import { EditUserSchema } from '../schemas';
import { db } from '@/lib/db';
import {
	createErrorResponse,
	createSuccessResponse,
	requireUserEditPermission,
} from '@/lib/auth-utils';
import { isAdmin } from '@/lib/permissions';

export const editUser = async (
	id: string,
	values: z.infer<typeof EditUserSchema>
) => {
	try {
		const currentUser = await requireUserEditPermission(id);

		if (!id || typeof id !== 'string' || id.length < 10) {
			return createErrorResponse(new Error('Nieprawidłowy identyfikator użytkownika'));
		}

		const existingUser = await db.user.findUnique({
			where: { id },
			select: {
				id: true,
				username: true,
				role: true,
			}
		});

		if (!existingUser) {
			return createErrorResponse(new Error('Nie znaleziono użytkownika'));
		}

		const validatedFields = EditUserSchema.safeParse(values);

		if (!validatedFields.success) {
			const issues = validatedFields.error.issues.map((issue) => issue.message).join(', ');
			return createErrorResponse(new Error(issues));
		}

		const { username, role, firstname, lastname, newPassword } =
			validatedFields.data;
		const canManageRoles = isAdmin(currentUser.role);

		if (username !== existingUser.username) {
			const usernameExists = await db.user.findFirst({
				where: {
					username,
					NOT: { id }
				}
			});

			if (usernameExists) {
				return createErrorResponse(new Error('Użytkownik o takiej nazwie już istnieje'));
			}
		}

		const hashedPassword = newPassword ? await bcrypt.hash(newPassword, 12) : undefined;

		await db.user.update({
			where: { id },
			data: {
				username,
				role: canManageRoles ? role : existingUser.role,
				firstname,
				lastname,
				...(hashedPassword && { password: hashedPassword }),
				updatedAt: new Date(),
			},
		});

		return createSuccessResponse('Dane użytkownika zostały zapisane');
	} catch (error) {
		console.error('Error updating user:', error);
		return createErrorResponse(error);
	}
};
