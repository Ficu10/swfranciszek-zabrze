import { getDriveClient } from '@/lib/google-drive';

export const runtime = 'nodejs';

interface DriveImageRouteProps {
	params: Promise<{ fileId: string }>;
}

export async function GET(_request: Request, { params }: DriveImageRouteProps) {
	try {
		const { fileId } = await params;

		if (!fileId) {
			return new Response('Brak fileId', { status: 400 });
		}

		const drive = getDriveClient();
		const fileResponse = await drive.files.get(
			{
				fileId,
				alt: 'media',
				supportsAllDrives: true,
			},
			{ responseType: 'arraybuffer' }
		);

		const contentType =
			(fileResponse.headers['content-type'] as string | undefined) ||
			'image/jpeg';

		return new Response(Buffer.from(fileResponse.data as ArrayBuffer), {
			status: 200,
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=31536000, immutable',
			},
		});
	} catch (error) {
		console.error('Drive image proxy error:', error);
		return new Response('Nie udało się pobrać obrazka', { status: 404 });
	}
}
