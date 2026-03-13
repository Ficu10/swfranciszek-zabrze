export const stripHtml = (html: string): string => {
	return html
		.replace(/&(nbsp|#160|#xa0);/gi, ' ')
		.replace(/<[^>]*>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
};
