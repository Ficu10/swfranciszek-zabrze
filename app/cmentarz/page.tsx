'use client';

import { FormEvent, useMemo, useState } from 'react';
import Image from 'next/image';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CemeteryPerson {
	name: string;
	birthDate: string | null;
	deathDate: string | null;
}

interface CemeteryResult {
	id: string;
	sector: string;
	row: string;
	grave: string;
	locationLabel: string;
	oldNumbering: string | null;
	people: CemeteryPerson[];
	mapUrl: string | null;
	mapPreviewUrl: string | null;
}

export default function Cmentarz() {
	const [formValues, setFormValues] = useState({
		firstName: '',
		lastName: '',
		birthDate: '',
		deathDate: '',
	});
	const [results, setResults] = useState<CemeteryResult[]>([]);
	const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const selectedResult = useMemo(
		() => results.find((result) => result.id === selectedResultId) ?? results[0] ?? null,
		[results, selectedResultId]
	);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError('');
		setMessage('');

		if (
			!formValues.firstName.trim() &&
			!formValues.lastName.trim() &&
			!formValues.birthDate &&
			!formValues.deathDate
		) {
			setError('Podaj co najmniej jedno pole wyszukiwania.');
			return;
		}

		setLoading(true);

		try {
			const response = await fetch('/api/cemetery-search', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formValues),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Search failed');
			}

			setResults(data.results || []);
			setSelectedResultId(data.results?.[0]?.id || null);
			setMessage(data.message || '');
		} catch (err) {
			setResults([]);
			setSelectedResultId(null);
			setError(
				err instanceof Error
					? err.message
					: 'Nie udało się wyszukać grobu.'
			);
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (field: keyof typeof formValues, value: string) => {
		setFormValues((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<main className="flex min-h-screen flex-col items-center bg-white">
			<MaxWidthWrapper className="flex flex-col items-center justify-center mt-7">
				<hr className="w-full mb-7" />
				<div className="flex flex-col items-center max-w-6xl w-full mb-14">
					<h2 className="text-3xl pb-5 font-bold">Cmentarz</h2>
					<a href="/Regulamin_Cmentarza.pdf">
						<h3 className="text-xl text-blue-600 py-6 font-bold hover:underline">
							Regulamin cmentarza
						</h3>
					</a>

					<div className="w-full space-y-8">
						<div className="w-full rounded-lg border border-slate-200 shadow-sm p-6 bg-slate-50">
							<h3 className="text-2xl font-bold mb-2">Wyszukiwarka miejsca pochówku</h3>
							<p className="text-slate-600 mb-6">
								Wpisz imię, nazwisko, datę urodzenia lub datę zgonu. Po wyszukaniu
								zobaczysz lokalizację grobu i podgląd planu cmentarza.
							</p>

							<form className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4" onSubmit={handleSubmit}>
								<div className="space-y-2">
									<label className="text-sm font-medium">Nazwisko</label>
									<Input
										value={formValues.lastName}
										onChange={(event) => handleChange('lastName', event.target.value)}
										placeholder="Np. Kowalski"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Imię</label>
									<Input
										value={formValues.firstName}
										onChange={(event) => handleChange('firstName', event.target.value)}
										placeholder="Np. Jan"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Data urodzenia</label>
									<Input
										type="date"
										value={formValues.birthDate}
										onChange={(event) => handleChange('birthDate', event.target.value)}
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Data zgonu</label>
									<Input
										type="date"
										value={formValues.deathDate}
										onChange={(event) => handleChange('deathDate', event.target.value)}
									/>
								</div>

								<div className="md:col-span-2 xl:col-span-4 flex flex-col sm:flex-row gap-3 pt-2">
									<Button type="submit" disabled={loading}>
										{loading ? 'Wyszukiwanie...' : 'Szukaj grobu'}
									</Button>
									<Button
										type="button"
										variant="outline"
										onClick={() => {
											setFormValues({ firstName: '', lastName: '', birthDate: '', deathDate: '' });
											setResults([]);
											setSelectedResultId(null);
											setMessage('');
											setError('');
										}}
									>
										Wyczyść
									</Button>
									<a
										href="https://polskie-cmentarze.info/wyszukiwarka.php?clientId=676"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
									>
										Otwórz pełną wyszukiwarkę
									</a>
								</div>
							</form>

							{error && (
								<div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
									{error}
								</div>
							)}

							{message && !error && (
								<div className="mt-4 rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-700">
									{message}
								</div>
							)}
						</div>

						<Image
							src="/cmenatarz_zabrze_mapa.jpeg"
							alt="Plan cmentarza"
							width={1200}
							height={800}
							className="w-full h-auto rounded-lg shadow-lg"
							priority
						/>

						{results.length > 0 && (
							<div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(360px,480px)] gap-6 items-start">
								<div className="space-y-4">
									<h3 className="text-2xl font-bold">Wyniki wyszukiwania</h3>
									<div className="space-y-3">
										{results.map((result) => {
											const isActive = selectedResult?.id === result.id;
											return (
												<button
													key={result.id}
													type="button"
													onClick={() => setSelectedResultId(result.id)}
													className={`w-full text-left rounded-lg border p-4 transition ${
														isActive
															? 'border-slate-900 bg-slate-50 shadow-sm'
															: 'border-slate-200 bg-white hover:border-slate-300'
													}`}
												>
													<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
														<div>
															<p className="text-lg font-semibold">
																{result.people[0]?.name || 'Nieznana osoba'}
															</p>
															<p className="text-slate-600">
																Lokalizacja: <strong>{result.locationLabel}</strong>
															</p>
															{result.oldNumbering && (
																<p className="text-sm text-slate-500">
																	Stara numeracja: {result.oldNumbering}
																</p>
															)}
														</div>
														<div className="text-sm text-slate-600">
															{result.people[0]?.birthDate && <p>* {result.people[0].birthDate}</p>}
															{result.people[0]?.deathDate && <p>† {result.people[0].deathDate}</p>}
														</div>
													</div>

													{result.people.length > 1 && (
														<div className="mt-3 text-sm text-slate-700">
															<p className="font-medium mb-1">Osoby w grobie:</p>
															<ul className="list-disc ml-5 space-y-1">
																{result.people.map((person) => (
																	<li key={`${result.id}-${person.name}`}>
																		{person.name}
																		{person.birthDate || person.deathDate
																			? ` (${[person.birthDate ? `* ${person.birthDate}` : '', person.deathDate ? `† ${person.deathDate}` : '']
																				.filter(Boolean)
																				.join(', ')})`
																			: ''}
																	</li>
																))}
															</ul>
														</div>
													)}
												</button>
											);
										})}
									</div>
								</div>

								{selectedResult && (
									<div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-4 xl:sticky xl:top-4">
										<div>
											<h3 className="text-2xl font-bold">Położenie grobu</h3>
											<p className="text-slate-600 mt-1">
												Sektor <strong>{selectedResult.sector}</strong>, rząd <strong>{selectedResult.row}</strong>, grób <strong>{selectedResult.grave}</strong>
											</p>
										</div>

										{selectedResult.mapPreviewUrl ? (
											<img
												src={selectedResult.mapPreviewUrl}
												alt={`Plan dla grobu ${selectedResult.locationLabel}`}
												className="w-full rounded-lg border border-slate-200"
											/>
										) : (
											<div className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-500">
												Brak podglądu mapy dla tego grobu.
											</div>
										)}

										{selectedResult.mapUrl && (
											<a
												href={selectedResult.mapUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
											>
												Otwórz interaktywny plan
											</a>
										)}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
				<hr className="w-full mt-7" />
			</MaxWidthWrapper>
		</main>
	);
}
