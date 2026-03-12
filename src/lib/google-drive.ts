import { google } from 'googleapis';
import { Readable } from 'node:stream';

type UploadImageInput = {
	buffer: Buffer;
	filename: string;
	mimeType: string;
};

const getDriveClient = () => {
	const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
	const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
	const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

	if (!clientId || !clientSecret || !refreshToken) {
		throw new Error('Brakuje konfiguracji Google OAuth');
	}

	const auth = new google.auth.OAuth2(clientId, clientSecret);
	auth.setCredentials({ refresh_token: refreshToken });

	return google.drive({ version: 'v3', auth });
};

export const uploadImageToDrive = async ({
	buffer,
	filename,
	mimeType,
}: UploadImageInput) => {
	const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

	if (!folderId) {
		throw new Error('Brakuje GOOGLE_DRIVE_FOLDER_ID');
	}

	const drive = getDriveClient();
	const stream = Readable.from(buffer);

	const createdFile = await drive.files.create({
		requestBody: {
			name: filename,
			parents: [folderId],
		},
		media: {
			mimeType,
			body: stream,
		},
		supportsAllDrives: true,
		fields: 'id, webContentLink',
	});

	const fileId = createdFile.data.id;

	if (!fileId) {
		throw new Error('Nie udało się uzyskać ID pliku z Google Drive');
	}

	await drive.permissions.create({
		fileId,
		requestBody: {
			role: 'reader',
			type: 'anyone',
		},
	});

	return {
		fileId,
		url: `https://drive.google.com/uc?export=view&id=${fileId}`,
	};
};
