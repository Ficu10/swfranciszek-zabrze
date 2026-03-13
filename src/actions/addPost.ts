'use server';

// Functions

import { auth } from '@/auth/auth';

// Schemas

import * as z from 'zod';
import { PostSchema } from '../schemas';

// Database

import { db } from '@/lib/db';
import { slugify } from '@/lib/slug';

const generateUniqueSlug = async (title: string): Promise<string> => {
	const baseSlug = slugify(title);
	const safeBaseSlug = baseSlug || `post-${Date.now()}`;
	let candidate = safeBaseSlug;
	let counter = 1;

	while (await db.post.findUnique({ where: { slug: candidate } })) {
		candidate = `${safeBaseSlug}-${counter}`;
		counter += 1;
	}

	return candidate;
};

const normalizePostContent = (rawContent: string) => {
	return rawContent
		.replace(/(?:&nbsp;|\u00A0|\s)+$/g, '')
		.replace(/(<\/(?:p|div|li|h[1-6]|span)>)(?:&nbsp;|\u00A0|\s)+/gi, '$1');
};

export const addPost = async (values: z.infer<typeof PostSchema>) => {
	// Validating values with zod and PostSchema in schemas folder
	const validatedFields = PostSchema.safeParse(values);

	const session = await auth();

	// If user doesn't have session he can't add post
	if (!session) {
		return { error: 'Twoja sesja nie istnieje!' };
	}

	if (
		!session?.user?.role?.includes('moderator') &&
		!session?.user?.role?.includes('admin')
	) {
		return {
			error: 'Nie masz permisji do dodawania postów',
		};
	}

	const firstname = session?.user?.firstname;
	const lastname = session?.user?.lastname;

	// Safe checking if all fields are valid
	if (!validatedFields.success) {
		return {
			error:
				'Nieprawidłowe dane (tytuł musi mieć minimum 2 litery, a treść minimum 10 liter)',
		};
	}

	const { title, content, category } = validatedFields.data;
	const slug = await generateUniqueSlug(title);
	const normalizedContent = normalizePostContent(content);


	try {
		await db.post.create({
			data: {
				title,
				slug,
				content: normalizedContent,
				category: category,
				author: `${firstname} ${lastname}`,
			},
		});
		return { success: 'Poprawnie dodano post!' };
	} catch (err) {
		return { error: 'Coś poszło nie tak' };
	}
};
