'use client';

// Functions

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { editPost } from '@/actions/editPost';
import findPostById from '@/actions/findPostById';
import { type ChangeEvent } from 'react';

// Schemas

import { zodResolver } from '@hookform/resolvers/zod';
import type * as z from 'zod';
import { PostSchema } from '@/schemas';

// Components

import MaxWidthWrapper from '@/components/MaxWidthWrapper';

import {
	Form,
	FormControl,
	FormField,
	FormMessage,
	FormItem,
	FormLabel,
} from '@/components/ui/form';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

import FormError from '@/components/FormError';
import FormSuccess from '@/components/FormSuccess';

import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';

export default function EditPostForm() {
	const [isPending, startTransition] = useTransition();
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string | undefined>('');
	const { data: session } = useSession();

	const form = useForm<z.infer<typeof PostSchema>>({
		resolver: zodResolver(PostSchema),

		defaultValues: {
			title: '',
			content: '',
			author: `${session?.user.firstname} ${session?.user.lastname}`,
		},
	});

	const searchParams = useSearchParams();

	const postId = searchParams.get('postId');

	useEffect(() => {
		if (postId) {
			const postIdString = Array.isArray(postId) ? postId[0] : postId;
			findPostById(postIdString)
				.then((postData) => {
					if (postData) {
						// Ignore ts because we now that value will be correct
						// @ts-ignore
						form.reset(postData);
					} else {
						setError('Nie znaleziono danych dla takiego posta');
					}
				})
				.catch((error) => {
					setError('Błąd przy pobieraniu danych z bazy danych');
					throw error;
				});
		}
	}, [form, postId]);

	const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}

		setIsUploading(true);
		setError('');

		try {
			const formData = new FormData();
			formData.append('image', file);

			const response = await fetch('/api/upload-image', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				if (response.status === 413) {
					setError('Plik jest za duży dla serwera (max 4MB)');
					return;
				}

				let message = 'Nie udało się przesłać zdjęcia';
				const isJson = response.headers
					.get('content-type')
					?.includes('application/json');

				if (isJson) {
					const payload = await response.json();
					message = payload.error ?? message;
				}

				setError(message);
				return;
			}

			const payload = await response.json();

			if (!payload.url) {
				setError('Nie udało się przesłać zdjęcia');
				return;
			}

			const currentContent = form.getValues('content') || '';
			form.setValue(
				'content',
				`${currentContent}<p><img src="${payload.url}" alt="Obraz" /></p>`
			);
		} catch (uploadError) {
			setError('Nie udało się przesłać zdjęcia');
		} finally {
			setIsUploading(false);
			event.target.value = '';
		}
	};

	const onSubmit = async (values: z.infer<typeof PostSchema>) => {
		setError('');
		setSuccess('');

		startTransition(() => {
			if (!postId) return;
			editPost(postId, values)
				.then((data) => {
					if (data.success) {
						form.reset();
						setSuccess(data.success);
						window.location.reload();
					} else {
						setError(data.error);
					}
				})
				.catch(() => {
					setError(
						'Coś poszło nie tak podczas edytowania posta. Spróbuj ponownie'
					);
				});
		});
	};

	const roles = Array.isArray(session?.user?.role)
		? session.user.role
		: [(session?.user?.role as string | undefined)?.toString()];

	const hasRole = roles.some(
		(role) => typeof role === 'string' && ['admin', 'moderator'].includes(role)
	);
	return (
		<>
			{hasRole && (
				<div className="flex min-h-screen flex-col items-center bg-white relative overflow-hidden w-full">
					<MaxWidthWrapper className="flex flex-col items-center justify-center mt-7">
						<h1 className="text-3xl font-bold mb-5">Edytuj post</h1>
						<div className="w-full">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-6"
								>
									<div className="flex flex-col gap-y-6">
										<FormField
											control={form.control}
											name="title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Nagłówek posta</FormLabel>
													<FormControl>
														<Input
															placeholder="Np. Ogłoszenia na najbliższą niedzielę"
															{...field}
															disabled={isPending || isUploading}
															type="text"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<div className="flex flex-row gap-x-1 justify-center items-center">
											<FormField
												control={form.control}
												name="category"
												render={({ field }) => (
													<FormItem className="w-1/3">
														<FormLabel>Kategoria posta</FormLabel>
														<Select
															onValueChange={field.onChange}
															value={field.value}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Wybierz kategorie posta" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="notice">
																	Ogłoszenie parafialne
																</SelectItem>
																<SelectItem value="intension">
																	Intencja mszalna
																</SelectItem>
																<SelectItem value="devotion">
																	Nabożeństwo
																</SelectItem>
															</SelectContent>
														</Select>
													</FormItem>
												)}
											/>
										</div>
										<div className="flex flex-col gap-y-4">
											<p className="text-sm">
												Wgraj zdjęcie bezpośrednio do chmury, a system
												automatycznie doda je do treści posta.
											</p>
											<div>
												<label className="text-sm font-medium">Dodaj zdjęcie</label>
												<Input
													type="file"
													accept="image/png,image/jpeg,image/webp,image/gif"
													onChange={handleImageUpload}
													disabled={isUploading || isPending}
												/>
												{isUploading && (
													<p className="text-sm text-muted-foreground mt-1">
														Wgrywam zdjęcie...
													</p>
												)}
											</div>
										</div>
										<div className="dangerouslySetInnerHTML">
											<FormField
												control={form.control}
												name="content"
												render={({ field }) => (
													<FormItem className="mb-12">
														<FormControl>
															<JoditEditor {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
									{error !== undefined && <FormError message={error} />}
									{success !== undefined && <FormSuccess message={success} />}

									<Button
										type="submit"
										className="w-full mt-12"
										disabled={isPending || isUploading}
									>
										Zapisz zmiany
									</Button>
								</form>
							</Form>
						</div>
					</MaxWidthWrapper>
				</div>
			)}
		</>
	);
}
