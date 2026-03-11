import { createHash } from 'node:crypto';

type UploadImageInput = {
	buffer: Buffer;
	filename: string;
	mimeType: string;
};

const sanitizeFilename = (filename: string) =>
	filename
		.toLowerCase()
		.replace(/\.[^/.]+$/, '')
		.replace(/[^a-z0-9_-]+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');

const getCloudinaryConfig = () => {
	const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
	const apiKey = process.env.CLOUDINARY_API_KEY;
	const apiSecret = process.env.CLOUDINARY_API_SECRET;

	if (!cloudName || !apiKey || !apiSecret) {
		throw new Error('Brakuje konfiguracji Cloudinary');
	}

	return { cloudName, apiKey, apiSecret };
};

const signParams = (params: Record<string, string | number>, apiSecret: string) => {
	const toSign = Object.keys(params)
		.sort()
		.map((key) => `${key}=${params[key]}`)
		.join('&');

	return createHash('sha1')
		.update(`${toSign}${apiSecret}`)
		.digest('hex');
};

export const uploadImageToCloudinary = async ({
	buffer,
	filename,
	mimeType,
}: UploadImageInput) => {
	const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
	const timestamp = Math.floor(Date.now() / 1000);
	const folder = process.env.CLOUDINARY_UPLOAD_FOLDER;
	const publicId = `${Date.now()}-${sanitizeFilename(filename) || 'obraz'}`;

	const paramsToSign: Record<string, string | number> = {
		public_id: publicId,
		timestamp,
	};

	if (folder) {
		paramsToSign.folder = folder;
	}

	const signature = signParams(paramsToSign, apiSecret);

	const formData = new FormData();
	formData.append('file', new Blob([buffer], { type: mimeType }), filename);
	formData.append('api_key', apiKey);
	formData.append('timestamp', String(timestamp));
	formData.append('signature', signature);
	formData.append('public_id', publicId);

	if (folder) {
		formData.append('folder', folder);
	}

	const response = await fetch(
		`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
		{
			method: 'POST',
			body: formData,
		}
	);

	const payload = await response.json();

	if (!response.ok || !payload?.secure_url) {
		throw new Error(
			payload?.error?.message || 'Cloudinary: nie udało się przesłać zdjęcia'
		);
	}

	return {
		url: payload.secure_url as string,
		publicId: payload.public_id as string,
	};
};
