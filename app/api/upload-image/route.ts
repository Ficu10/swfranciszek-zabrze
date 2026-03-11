import { auth } from '@/auth/auth';
import { canManagePosts } from '@/lib/permissions';
import { uploadImageToDrive } from '@/lib/google-drive';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
	try {
		const session = await auth();

		if (!session?.user || !canManagePosts(session.user.role)) {
			return NextResponse.json(
				{ error: 'Brak uprawnień do uploadu zdjęć' },
				{ status: 403 }
			);
		}

		const formData = await request.formData();
		const image = formData.get('image');

		if (!(image instanceof File)) {
			return NextResponse.json(
				{ error: 'Nie przesłano pliku' },
				{ status: 400 }
			);
		}

		if (!image.type.startsWith('image/')) {
			return NextResponse.json(
				{ error: 'Dozwolone są tylko pliki graficzne' },
				{ status: 400 }
			);
		}

		const maxFileSize = 4 * 1024 * 1024;
		if (image.size > maxFileSize) {
			return NextResponse.json(
				{ error: 'Plik jest za duży (max 4MB)' },
				{ status: 400 }
			);
		}

		const arrayBuffer = await image.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const { url } = await uploadImageToDrive({
			buffer,
			filename: image.name,
			mimeType: image.type || 'application/octet-stream',
		});

		return NextResponse.json({ url });
	} catch (error) {
		console.error('Upload image error:', error);
		return NextResponse.json(
			{ error: 'Nie udało się przesłać zdjęcia' },
			{ status: 500 }
		);
	}
}
