'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from './ui/input';

interface SearchTopic {
	title: string;
	href: string;
	keywords: string[];
}

const TOPICS: SearchTopic[] = [
	{
		title: 'Ogłoszenia parafialne',
		href: '/aktualnosci/ogloszenia-parafialne',
		keywords: ['ogloszenia', 'ogłoszenia', 'aktualnosci'],
	},
	{
		title: 'Intencje mszalne',
		href: '/aktualnosci/intencje-mszalne',
		keywords: ['intencje', 'mszalne', 'msza', 'aktualnosci'],
	},
	{
		title: 'Nasze Msze św.',
		href: '/nasze-msze-sw',
		keywords: ['msze', 'msza', 'sw', 'święte', 'godziny mszy'],
	},
	{
		title: 'Msze św. w Zabrzu',
		href: '/msze-sw-w-zabrzu',
		keywords: ['msze', 'zabrze', 'święte'],
	},
	{
		title: 'Pogrzeb',
		href: '/posluga-duszpasterska/pogrzeb',
		keywords: ['pogrzeb', 'pochowek', 'posluga'],
	},
	{
		title: 'Chrzest',
		href: '/posluga-duszpasterska/chrzest',
		keywords: ['chrzest', 'dziecko', 'sakrament'],
	},
	{
		title: 'Bierzmowanie',
		href: '/posluga-duszpasterska/bierzmowanie',
		keywords: ['bierzmowanie', 'sakrament'],
	},
	{
		title: 'Sakrament małżeństwa',
		href: '/posluga-duszpasterska/sakrament-malzenstwa',
		keywords: ['slub', 'ślub', 'malzenstwo', 'małżeństwo', 'sakrament'],
	},
	{
		title: 'Sakramenty chorych',
		href: '/posluga-duszpasterska/sakramenty-chorych',
		keywords: ['chorzy', 'namaszczenie', 'sakrament'],
	},
	{
		title: 'Spowiedź',
		href: '/posluga-duszpasterska/spowiedz',
		keywords: ['spowiedz', 'spowiedź', 'konfesjonal'],
	},
	{
		title: 'Podstawowe informacje',
		href: '/nasza-parafia/podstawowe-informacje',
		keywords: ['parafia', 'informacje'],
	},
	{
		title: 'Kancelaria',
		href: '/nasza-parafia/kancelarie',
		keywords: ['kancelaria', 'biuro'],
	},
	{
		title: 'Duszpasterze',
		href: '/nasza-parafia/duszpasterze',
		keywords: ['duszpasterze', 'ksieza', 'księża'],
	},
	{
		title: 'Dzieci Maryi',
		href: '/nasza-parafia/dzieci-maryi',
		keywords: ['dzieci maryi', 'wspolnota'],
	},
	{
		title: 'Ministranci',
		href: '/nasza-parafia/ministranci',
		keywords: ['ministranci', 'liturgia'],
	},
	{
		title: 'Nasz patron',
		href: '/nasza-parafia/nasz-patron',
		keywords: ['patron', 'franciszek'],
	},
	{
		title: 'Chór parafialny',
		href: '/nasza-parafia/chor-parafialny',
		keywords: ['chor', 'chór', 'spiew'],
	},
	{
		title: 'Franciszkański zakon świeckich',
		href: '/nasza-parafia/franciszkanski-zakon-swieckich',
		keywords: ['zakon', 'franciszkanski', 'świeckich'],
	},
	{
		title: 'Karmelitański zakon świeckich',
		href: '/nasza-parafia/karmelitanski-zakon-swieckich',
		keywords: ['zakon', 'karmelitanski', 'świeckich'],
	},
	{
		title: 'Caritas',
		href: '/nasza-parafia/caritas',
		keywords: ['caritas', 'pomoc'],
	},
	{
		title: 'Oaza - ruch, światło, życie',
		href: '/nasza-parafia/oaza-ruch-swiatlo-zycie',
		keywords: ['oaza', 'ruch swiatlo zycie', 'wspolnota'],
	},
	{
		title: 'Różańcowe dzieło wspierania powołań',
		href: '/nasza-parafia/rozancowe-dzielo-wspierania-powolan-decezji-gliwickiej',
		keywords: ['rozancowe', 'powolania', 'różaniec'],
	},
	{
		title: 'Róże różańcowe',
		href: '/nasza-parafia/roze-rozancowe',
		keywords: ['roze', 'róże', 'różaniec'],
	},
	{
		title: 'Wspólnota zmartwychwstania',
		href: '/nasza-parafia/wspolnota-zmartwychwstania',
		keywords: ['wspolnota', 'zmartwychwstania'],
	},
	{
		title: 'Spacer po kościele',
		href: '/nasza-parafia/spacer-po-kosciele',
		keywords: ['spacer', 'kosciol', 'kościół'],
	},
	{
		title: 'Skrócone standardy ochrony dzieci',
		href: '/Skrocone_standardy_ochrony_dzieci_w_parafiii_SW_Franciszka_w_Zabrzu.pdf',
		keywords: ['ochrona dzieci', 'standardy', 'pdf'],
	},
	{
		title: 'Standardy ochrony dzieci',
		href: '/Standardy_ochrony_dzieci_w_parafiii_SW_Franciszka_w_Zabrzu.pdf',
		keywords: ['ochrona dzieci', 'standardy', 'pdf'],
	},
	{
		title: 'Zespół ds. prewencji',
		href: '/Zespol_DS_prewencji_w_parafii_SW_Franciszka_w_Zabrzu.pdf',
		keywords: ['ochrona dzieci', 'prewencja', 'pdf'],
	},
	{
		title: 'Ochrona dzieci i młodzieży - diecezja gliwicka',
		href: '/Ochrona_dzieci_i_mlodziezy_diecezja_gliwicka.pdf',
		keywords: ['ochrona dzieci', 'mlodziez', 'pdf'],
	},
	{
		title: 'Czytania na dziś',
		href: 'https://opoka.org.pl/liturgia/',
		keywords: ['czytania', 'liturgia', 'opoka'],
	},
	{
		title: 'Cmentarz',
		href: '/cmentarz',
		keywords: ['cmentarz', 'grob', 'grób'],
	},
];

const normalize = (value: string) =>
	value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.trim();

const TopicSearch = () => {
	const [query, setQuery] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);

	const results = useMemo(() => {
		const normalizedQuery = normalize(query);

		if (!normalizedQuery) {
			return TOPICS;
		}

		return TOPICS.filter((topic) => {
			const normalizedTitle = normalize(topic.title);
			const normalizedKeywords = topic.keywords.map((keyword) => normalize(keyword));

			return (
				normalizedTitle.includes(normalizedQuery) ||
				normalizedKeywords.some((keyword) => keyword.includes(normalizedQuery))
			);
		});
	}, [query]);

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (!wrapperRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleOutsideClick);
		return () => document.removeEventListener('mousedown', handleOutsideClick);
	}, []);

	return (
		<div className="relative w-full max-w-xl" ref={wrapperRef}>
			<Input
				value={query}
				onChange={(event) => {
					setQuery(event.target.value);
					setIsOpen(true);
				}}
				onFocus={() => setIsOpen(true)}
				placeholder="Szukaj tematów: intencje, msze św., pogrzeb..."
				className="bg-white"
			/>

			{isOpen && (
				<div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-md">
					{results.length > 0 ? (
						results.map((topic) => (
							<Link
								key={topic.href}
								href={topic.href}
								onClick={() => {
									setIsOpen(false);
									setQuery('');
								}}
								className="block border-b border-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
							>
								{topic.title}
							</Link>
						))
					) : (
						<p className="px-3 py-2 text-sm text-slate-500">Brak wyników</p>
					)}
				</div>
			)}
		</div>
	);
};

export default TopicSearch;
