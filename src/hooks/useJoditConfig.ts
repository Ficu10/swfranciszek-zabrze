import { useMemo } from 'react';

export const useJoditConfig = () => {
	return useMemo(
		() => ({
			uploader: {
				url: '/api/upload-image',
				method: 'POST',
				fieldName: 'image',
				filesVariableName: () => 'image',
				format: 'json',
				isSuccess(resp: Record<string, unknown>) {
					return Boolean(resp.url) && !resp.error;
				},
				getMessage(resp: Record<string, unknown>) {
					return (resp.error as string) ?? '';
				},
				process(resp: Record<string, unknown>) {
					return {
						files: resp.url ? [resp.url as string] : [],
						path: '',
						baseurl: '',
						error: resp.error ? 1 : 0,
						message: (resp.error as string) ?? '',
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
					const message =
						typeof error === 'string'
							? error
							: error?.message || 'Nie udało się przesłać zdjęcia';

					if (typeof window !== 'undefined') {
						window.alert(message);
					}
				},
			},
		}),
		[]
	);
};
