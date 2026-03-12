'use server';

import { db } from '@/lib/db';

const defaultContent = `
<h2>Msze święte</h2>
<p>W tym miejscu możesz dodać aktualne godziny Mszy świętych, informacje o zmianach oraz ważne ogłoszenia związane z liturgią.</p>
`;

async function findMszeSwWZabrzuData() {
	try {
		const existing = await db.mszeSwWZabrzu.findFirst({
			orderBy: { createdAt: 'asc' },
		});

		if (existing) {
			return existing;
		}

		return await db.mszeSwWZabrzu.create({
			data: {
				content: defaultContent,
			},
		});
	} catch (error) {
		throw new Error(`Failed to fetch MszeSwWZabrzu data: ${error}`);
	}
}

export default findMszeSwWZabrzuData;
