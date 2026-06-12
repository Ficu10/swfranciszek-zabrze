'use server';

import { db } from '@/lib/db';
import { ensureFunduszeEuropejskieTable } from '@/lib/fundusze-europejskie-table';

const defaultContent = `<h1>Fundusze Europejskie</h1>

<p>Nasza Parafia pozyskała dotację z Unii Europejskiej na projekt „Zwiększenie efektywności energetycznej poprzez budowę instalacji OZE dla obiektów użyteczności publicznej prowadzonych przez jednostki kościelne”.</p>

<p>Przedsięwzięcie realizowane jest wspólnie przez Diecezję Gliwicką oraz 17 Parafii:</p>

<ul>
	<li>Parafię Rzymskokatolicką pw. Najświętszej Maryi Panny Matki Kościoła w Gliwicach,</li>
	<li>Parafię Rzymskokatolicką pw. Świętej Anny w Zabrzu,</li>
	<li>Parafię Rzymskokatolicką pw. Najświętszego Serca Pana Jezusa w Wojsce,</li>
	<li>Rzymskokatolicką Parafię pw. Znalezienia Krzyża Świętego w Rusinowicach,</li>
	<li>Parafię Rzymskokatolicką pw. Najświętszego Serca Pana Jezusa w Koszęcinie,</li>
	<li>Parafię Rzymskokatolicką pw. Świętego Gerarda w Gliwicach,</li>
	<li>Parafię Matki Bożej Królowej Pokoju w Tarnowskich Górach,</li>
	<li>Parafię Rzymskokatolicką pw. Świętych Apostołów Piotra i Pawła w Gliwicach,</li>
	<li>Rzymskokatolicką Parafię Najświętszego Serca Pana Jezusa w Kochcicach,</li>
	<li>Parafię Rzymskokatolicką pw. Świętego Mikołaja w Lublińcu,</li>
	<li>Rzymskokatolicką Parafię pw. Świętej Anny w Gliwicach,</li>
	<li>Rzymskokatolicką Parafię Chrystusa Króla w Gliwicach,</li>
	<li>Parafię Rzymskokatolicką Świętego Franciszka z Asyżu w Zabrzu,</li>
	<li>Parafię Rzymskokatolicką Bożego Ciała w Bytomiu,</li>
	<li>Parafię Rzymskokatolicką pw. Świętego Macieja Apostoła w Zabrzu,</li>
	<li>Parafię Rzymskokatolicką pw. Świętego Józefa w Zabrzu,</li>
	<li>Parafię Rzymskokatolicką pw. Wniebowzięcia Najświętszej Maryi Panny w Rudach.</li>
</ul>

<p>W ramach projektu zamontujemy łącznie 35 instalacji fotowoltaicznych z magazynami energii oraz 11 pomp ciepła. Dzięki temu przyczynimy się do zwiększenia udziału energii odnawialnej w ogólnym bilansie energetycznym oraz stworzenia rozproszonego systemu produkcji energii.</p>

<p>Celem projektu jest zmniejszenie zapotrzebowania na energię tradycyjną, a dzięki temu poprawa jakości powietrza oraz redukcja emisji gazów cieplarnianych do atmosfery.</p>

<p>Z osiągniętych rezultatów skorzystają użytkownicy budynków oraz mieszkańcy regionu.</p>

<p><strong>Wartość projektu:</strong> 11 088 235,94 zł</p>

<p><strong>Wysokość wkładu z Funduszy Europejskich:</strong> 8 316 176,89 zł</p>

<p><strong>Wysokość wkładu z Budżetu Państwa:</strong> 1 108 823,59 zł</p>

<p>Planowany termin zakończenia projektu to grudzień 2025 roku.</p>

<p>#FunduszeUE #FunduszeEuropejskie</p>`;

async function findFunduszeEuropejskieData() {
	await ensureFunduszeEuropejskieTable();

	const existing = await db.funduszeEuropejskie.findFirst({
		orderBy: { createdAt: 'asc' },
	});

	if (existing) {
		if (
			existing.content.includes('Treść dotycząca Funduszy Europejskich zostanie wkrótce uzupełniona') ||
			existing.content.trim() === ''
		) {
			return await db.funduszeEuropejskie.update({
				where: { id: existing.id },
				data: { content: defaultContent },
			});
		}

		return existing;
	}

	return await db.funduszeEuropejskie.create({
		data: { content: defaultContent },
	});
}

export default findFunduszeEuropejskieData;
