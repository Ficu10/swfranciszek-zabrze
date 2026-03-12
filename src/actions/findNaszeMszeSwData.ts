'use server';

import { db } from '@/lib/db';

const defaultContent = `<h2>Msze święte w naszej parafii</h2>
<h3>Niedziela</h3>
<ul>
  <li>7:00</li>
  <li>8:30</li>
  <li>10:00</li>
  <li>11:30</li>
  <li>13:00</li>
  <li>18:00</li>
</ul>
<h3>Dni powszednie</h3>
<ul>
  <li>6:30</li>
  <li>8:00</li>
  <li>18:00</li>
</ul>`;

async function findNaszeMszeSwData() {
	const existing = await db.naszeMszeSw.findFirst({
		orderBy: { createdAt: 'asc' },
	});

	if (existing) {
		return existing;
	}

	return await db.naszeMszeSw.create({
		data: { content: defaultContent },
	});
}

export default findNaszeMszeSwData;
