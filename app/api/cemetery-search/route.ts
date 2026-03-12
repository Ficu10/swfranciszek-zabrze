import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

export const runtime = 'nodejs';

type SearchPayload = {
	firstName?: string;
	lastName?: string;
	birthDate?: string;
	deathDate?: string;
};

type CemeteryPerson = {
	name: string;
	birthDate: string | null;
	deathDate: string | null;
};

type CemeteryResult = {
	id: string;
	sector: string;
	row: string;
	grave: string;
	locationLabel: string;
	oldNumbering: string | null;
	people: CemeteryPerson[];
	mapUrl: string | null;
	mapPreviewUrl: string | null;
};

const CEMETERY_SEARCH_URL = 'https://polskie-cmentarze.info/wyszukiwarka.php?clientId=676';
const CEMETERY_BASE_URL = 'https://polskie-cmentarze.info';

function normalizeWhitespace(value: string | null | undefined) {
	return (value || '').replace(/\s+/g, ' ').trim();
}

function toAbsoluteUrl(url: string | null | undefined) {
	if (!url) return null;
	if (url.startsWith('http://') || url.startsWith('https://')) return url;
	if (url.startsWith('//')) return `https:${url}`;
	if (url.startsWith('/')) return `${CEMETERY_BASE_URL}${url}`;
	return `${CEMETERY_BASE_URL}/${url}`;
}

function splitDate(value?: string) {
	if (!value) {
		return { day: '', month: '', year: '' };
	}

	const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	if (!match) {
		return { day: '', month: '', year: '' };
	}

	const [, year, month, day] = match;
	return {
		day: String(Number(day)),
		month: String(Number(month)),
		year,
	};
}

function parsePerson(listItem: Element): CemeteryPerson {
	const strong = listItem.querySelector('strong');
	const name = normalizeWhitespace(strong?.textContent);
	const rawText = normalizeWhitespace(listItem.textContent).replace(name, '').trim();
	const sanitized = rawText.replace(/^\*/, '').trim();
	const [birthPart, deathPart] = sanitized.split('†');

	return {
		name,
		birthDate: normalizeWhitespace(birthPart) || null,
		deathDate: normalizeWhitespace(deathPart) || null,
	};
}

function parseResults(html: string): CemeteryResult[] {
	const dom = new JSDOM(html);
	const { document } = dom.window;
	const containers = Array.from(document.querySelectorAll('div.container.py-1'));

	return containers
		.map((container, index) => {
			const cards = Array.from(container.querySelectorAll('.card-params .card'));
			const values = new Map<string, string>();

			cards.forEach((card) => {
				const header = normalizeWhitespace(
					card.querySelector('.card-header')?.textContent
				);
				const value = normalizeWhitespace(
					card.querySelector('.card-body p')?.textContent
				);
				if (header && value) {
					values.set(header, value);
				}
			});

			const sector = values.get('Sektor') || '';
			const row = values.get('Rząd') || '';
			const grave = values.get('Grób') || '';
			const oldNumbering =
				normalizeWhitespace(
					container.querySelector('.p-3 strong')?.textContent
				) || null;

			const people = Array.from(
				container.querySelectorAll('.list-group .list-group-item')
			)
				.filter((item) => !item.className.includes('list-group-item-dark'))
				.map(parsePerson)
				.filter((person) => person.name);

			const mapAnchor = container.querySelector(
				'a[href*="maps-controllers/leaflet/ver-2/?graveId="]'
			) as HTMLAnchorElement | null;
			const previewImage = container.querySelector('img') as HTMLImageElement | null;
			const locationParts = [sector, row, grave].filter(Boolean);

			if (!locationParts.length && !people.length) {
				return null;
			}

			return {
				id: `${locationParts.join('-') || 'grave'}-${index}`,
				sector,
				row,
				grave,
				locationLabel: locationParts.join('-'),
				oldNumbering,
				people,
				mapUrl: toAbsoluteUrl(mapAnchor?.getAttribute('href')),
				mapPreviewUrl: toAbsoluteUrl(previewImage?.getAttribute('src')),
			};
		})
		.filter((result): result is CemeteryResult => result !== null);
}

export async function POST(request: Request) {
	try {
		const payload = (await request.json()) as SearchPayload;
		const firstName = normalizeWhitespace(payload.firstName);
		const lastName = normalizeWhitespace(payload.lastName);
		const birthDate = splitDate(payload.birthDate);
		const deathDate = splitDate(payload.deathDate);

		if (!firstName && !lastName && !payload.birthDate && !payload.deathDate) {
			return NextResponse.json(
				{ error: 'Podaj co najmniej jedno pole wyszukiwania.' },
				{ status: 400 }
			);
		}

		const body = new URLSearchParams({
			'search-mode': '1',
			avNazwisko: lastName,
			avImie: firstName,
			boDay: birthDate.day,
			boMonth: birthDate.month,
			boYear: birthDate.year,
			deDay: deathDate.day,
			deMonth: deathDate.month,
			deYear: deathDate.year,
			boYear1: '',
			boYear2: '',
			deYear1: '',
			deYear2: '',
			p1: '',
			p2: '',
			p3: '',
		});

		const response = await fetch(CEMETERY_SEARCH_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: body.toString(),
			cache: 'no-store',
		});

		if (!response.ok) {
			throw new Error(`External cemetery search failed with status ${response.status}`);
		}

		const html = await response.text();
		const results = parseResults(html);
		const noResults = html.includes('Nie znaleziono takiego grobu/osoby');

		return NextResponse.json({
			results,
			message: noResults
				? 'Nie znaleziono osoby spełniającej podane kryteria.'
				: results.length
					? `Znaleziono ${results.length} ${results.length === 1 ? 'grób' : results.length < 5 ? 'groby' : 'grobów'}.`
					: 'Nie udało się odczytać wyników wyszukiwania.',
		});
	} catch (error) {
		console.error('[CEMETERY_SEARCH] Search failed:', error);
		return NextResponse.json(
			{ error: 'Nie udało się pobrać wyników wyszukiwania cmentarza.' },
			{ status: 500 }
		);
	}
}
