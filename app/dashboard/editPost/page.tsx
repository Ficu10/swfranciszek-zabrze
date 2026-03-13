'use client';

// Functions

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { editPost } from '@/actions/editPost';
import findPostById from '@/actions/findPostById';

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
					setError('B\u0142\u0105d przy pobieraniu danych z bazy danych');
					throw error;
				});
		}
	}, [form, postId]);

	const joditConfig = useMemo(
		() => ({
			uploader: {
				url: '/api/upload-image',
				fieldName: 'image',
				format: 'json',
				process(resp: Record<string, unknown>) {
					return {
						files: resp.url ? [resp.url as string] : [],
						path: '',
						baseurl: '',
						error: resp.error ? 1 : 0,
						message: (resp.error as string) ?? '',
					};
				},
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				defaultHandlerSuccess(this: any, data: { files: string[] }) {
					(data.files || []).forEach((url: string) =>
						this.s.insertImage(url)
					);
				},
			},
		}),
		[]
	);

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
						'Co\u015b posz\u0142o nie tak podczas edytowania posta. Spr\u00f3buj ponownie'
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
													<FormLabel>Nag\u0142\u00f3wek posta</FormLabel>
													<FormControl>
														<Input
															placeholder="Np. Og\u0142oszenia na najbli\u017csz\u0105 niedziel\u0119"
															{...field}
															disabled={isPending}
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
																	Og\u0142oszenie parafialne
																</SelectItem>
																<SelectItem value="intension">
																	Intencja mszalna
																</SelectItem>
																<SelectItem value="devotion">
																	Nabo\u017ce\u0144stwo
																</SelectItem>
															</SelectContent>
														</Select>
													</FormItem>
												)}
											/>
										</div>
										<div className="dangerouslySetInnerHTML">
											<FormField
												control={form.control}
												name="content"
												render={({ field }) => (
													<FormItem className="mb-12">
														<FormControl>
															<JoditEditor {...field} config={joditConfig} />
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
										disabled={isPending}
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
