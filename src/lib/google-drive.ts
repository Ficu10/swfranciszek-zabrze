import { google } from 'googleapis';
import { Readable } from 'node:stream';

type UploadImageInput = {
	buffer: Buffer;
	filename: string;
	mimeType: string;
};

const getDriveClient = () => {
	const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
	const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
		/\\n/g,
		'\n'
	);

	if (!clientEmail || !privateKey) {
		throw new Error('Brakuje konfiguracji Google Service Account');
	}

	const auth = new google.auth.JWT({
		email: clientEmail,
		key: privateKey,
		scopes: ['https://www.googleapis.com/auth/drive.file'],
	});

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
		url: `https://drive.google.com/uc?id=${fileId}`,
	};
};
