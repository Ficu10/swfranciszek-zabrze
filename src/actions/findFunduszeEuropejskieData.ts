'use server';

import { db } from '@/lib/db';

const defaultContent = `<h1>Fundusze Europejskie</h1>
<p>Treść dotycząca Funduszy Europejskich zostanie wkrótce uzupełniona.</p>`;

async function findFunduszeEuropejskieData() {
	const existing = await db.funduszeEuropejskie.findFirst({
		orderBy: { createdAt: 'asc' },
	});

	if (existing) {
		return existing;
	}

	return await db.funduszeEuropejskie.create({
		data: { content: defaultContent },
	});
}

export default findFunduszeEuropejskieData;
