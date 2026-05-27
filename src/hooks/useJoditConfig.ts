import { useMemo } from 'react';

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

const normalizeUploadErrorMessage = (rawMessage?: string) => {
	const sizeMessage = 'Zdjęcie jest za duże. Maksymalny rozmiar to 4 MB.';
	const fallback = sizeMessage;
	if (!rawMessage) return fallback;

	const lower = rawMessage.toLowerCase();
	if (
		lower.includes('413') ||
		lower.includes('payload') ||
		lower.includes('too large') ||
		lower.includes('za duży') ||
		lower.includes('za duze') ||
		lower.includes('nie udało się przesłać zdjęcia') ||
		lower.includes('nie udalo sie przeslac zdjecia')
	) {
		return sizeMessage;
	}

	return rawMessage;
};

export const useJoditConfig = () => {
	return useMemo(
		() => ({
			uploader: {
				url: '/api/upload-image',
				method: 'POST',
				beforeUpload: (files: File[] | FileList) => {
					const normalizedFiles = Array.isArray(files)
						? files
						: Array.from(files || []);

					const tooLargeFile = normalizedFiles.find(
						(file) => typeof file?.size === 'number' && file.size > MAX_IMAGE_SIZE
					);

					if (!tooLargeFile) {
						return true;
					}

					if (typeof window !== 'undefined') {
						window.alert(
							`Zdjęcie "${tooLargeFile.name}" jest za duże. Maksymalny rozmiar to 4 MB.`
						);
					}

					return false;
				},
				fieldName: 'image',
				filesVariableName: () => 'image',
				format: 'json',
				isSuccess(resp: Record<string, unknown> | string) {
					if (typeof resp === 'string') {
						return false;
					}

					return Boolean(resp?.url) && !resp?.error;
				},
				getMessage(resp: Record<string, unknown> | string) {
					if (typeof resp === 'string') {
						return normalizeUploadErrorMessage(resp);
					}

					return normalizeUploadErrorMessage((resp?.error as string) ?? '');
				},
				process(resp: Record<string, unknown> | string) {
					if (typeof resp === 'string') {
						const message = normalizeUploadErrorMessage(resp);

						return {
							files: [],
							path: '',
							baseurl: '',
							error: 1,
							message,
						};
					}

					const message = normalizeUploadErrorMessage(
						(resp?.error as string) ?? ''
					);

					return {
						files: resp?.url ? [resp.url as string] : [],
						path: '',
						baseurl: '',
						error: resp?.error ? 1 : 0,
						message,
					};
				},
				defaultHandlerSuccess(
					this: { s: { insertImage: (url: string) => void } },
					data: { files: string[] }
				) {
					(data.files || []).forEach((url: string) => this.s.insertImage(url));
				},
				defaultHandlerError(
					this: unknown,
					error: { message?: string } | string
				) {
					const rawMessage =
						typeof error === 'string'
							? error
							: error?.message || 'Nie udało się przesłać zdjęcia';
					const message = normalizeUploadErrorMessage(rawMessage);

					if (typeof window !== 'undefined') {
						window.alert(message);
					}
				},
			},
		}),
		[]
	);
};
