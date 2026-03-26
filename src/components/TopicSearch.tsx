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
		title: 'Intencje mszalne',
		href: '/aktualnosci/intencje-mszalne',
		keywords: ['intencje', 'mszalne', 'msza', 'aktualnosci'],
	},
	{
		title: 'Nabożeństwa',
		href: '/aktualnosci/nabozenstwa',
		keywords: ['nabozenstwa', 'nabożeństwa', 'modlitwa'],
	},
	{
		title: 'Ogłoszenia parafialne',
		href: '/aktualnosci/ogloszenia-parafialne',
		keywords: ['ogloszenia', 'ogłoszenia', 'aktualnosci'],
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
