'use server';

import { db } from '@/lib/db';

const defaultContent = `
<h1>Msze Święte w Zabrzu</h1>

<h2>Niedziela</h2>
<table>
  <thead>
    <tr>
      <th>Godzina</th>
      <th>Kościół / Parafia</th>
      <th>Adres</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>7:00</td><td>Parafia Wniebowzięcia NMP</td><td>ul. Kościelna 3</td></tr>
    <tr><td>7:30</td><td>Katedra Parafia Trójcy Świętej</td><td>ul. 3 Maja 20</td></tr>
    <tr><td>8:00</td><td>Parafia św. Franciszka z Asyżu</td><td>ul. Wolności 446</td></tr>
    <tr><td>8:00</td><td>Parafia Wniebowzięcia NMP</td><td>ul. Kościelna 3</td></tr>
    <tr><td>8:30</td><td>Parafia Matki Bożej Różańcowej</td><td>ul. Cmentarna 8</td></tr>
    <tr><td>9:00</td><td>Katedra Parafia Trójcy Świętej</td><td>ul. 3 Maja 20</td></tr>
    <tr><td>9:30</td><td>Parafia Wniebowzięcia NMP</td><td>ul. Kościelna 3</td></tr>
    <tr><td>10:00</td><td>Parafia św. Franciszka z Asyżu</td><td>ul. Wolności 446</td></tr>
    <tr><td>10:00</td><td>Parafia Matki Bożej Różańcowej</td><td>ul. Cmentarna 8</td></tr>
    <tr><td>10:30</td><td>Katedra Parafia Trójcy Świętej</td><td>ul. 3 Maja 20</td></tr>
    <tr><td>11:30</td><td>Parafia św. Franciszka z Asyżu</td><td>ul. Wolności 446</td></tr>
    <tr><td>11:30</td><td>Parafia Wniebowzięcia NMP</td><td>ul. Kościelna 3</td></tr>
    <tr><td>12:00</td><td>Katedra Parafia Trójcy Świętej</td><td>ul. 3 Maja 20</td></tr>
    <tr><td>12:00</td><td>Parafia Matki Bożej Różańcowej</td><td>ul. Cmentarna 8</td></tr>
    <tr><td>13:00</td><td>Parafia św. Franciszka z Asyżu</td><td>ul. Wolności 446</td></tr>
    <tr><td>18:00</td><td>Parafia św. Franciszka z Asyżu</td><td>ul. Wolności 446</td></tr>
    <tr><td>18:00</td><td>Katedra Parafia Trójcy Świętej</td><td>ul. 3 Maja 20</td></tr>
    <tr><td>18:00</td><td>Parafia Matki Bożej Różańcowej</td><td>ul. Cmentarna 8</td></tr>
    <tr><td>19:00</td><td>Parafia Wniebowzięcia NMP</td><td>ul. Kościelna 3</td></tr>
  </tbody>
</table>

<h2>Dni powszednie (poniedziałek – sobota)</h2>
<table>
  <thead>
    <tr>
      <th>Godzina</th>
      <th>Kościół / Parafia</th>
      <th>Adres</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>6:30</td><td>Parafia św. Franciszka z Asyżu</td><td>ul. Wolności 446</td></tr>
    <tr><td>7:00</td><td>Katedra Parafia Trójcy Świętej</td><td>ul. 3 Maja 20</td></tr>
    <tr><td>7:00</td><td>Parafia Matki Bożej Różańcowej</td><td>ul. Cmentarna 8</td></tr>
    <tr><td>8:00</td><td>Parafia św. Franciszka z Asyżu</td><td>ul. Wolności 446</td></tr>
    <tr><td>8:00</td><td>Parafia Wniebowzięcia NMP</td><td>ul. Kościelna 3</td></tr>
    <tr><td>17:00</td><td>Parafia Matki Bożej Różańcowej</td><td>ul. Cmentarna 8</td></tr>
    <tr><td>18:00</td><td>Parafia św. Franciszka z Asyżu</td><td>ul. Wolności 446</td></tr>
    <tr><td>18:00</td><td>Katedra Parafia Trójcy Świętej</td><td>ul. 3 Maja 20</td></tr>
    <tr><td>18:00</td><td>Parafia Wniebowzięcia NMP</td><td>ul. Kościelna 3</td></tr>
  </tbody>
</table>

<p><em>Godziny mogą ulec zmianie. W razie wątpliwości prosimy o kontakt z parafią.</em></p>
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
