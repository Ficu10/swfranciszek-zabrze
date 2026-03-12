'use server';

import { db } from '@/lib/db';

const defaultContent = `<h2>Kancelaria parafialna</h2>
<p>Godziny otwarcia kancelarii:</p>
<ul>
  <li>Poniedziałek: 8:00 - 9:00</li>
  <li>Wtorek: 16:00 - 17:00</li>
  <li>Środa: 8:00 - 9:00</li>
  <li>Czwartek: 16:00 - 17:00</li>
  <li>Piątek: 8:00 - 9:00</li>
</ul>`;

async function findKancelariaData() {
	const existing = await db.kancelaria.findFirst({
		orderBy: { createdAt: 'asc' },
	});

	if (existing) {
		return existing;
	}

	return await db.kancelaria.create({
		data: { content: defaultContent },
	});
}

export default findKancelariaData;
