'use client';

import { useForm } from 'react-hook-form';
import { useTransition, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { addPost } from '@/actions/addPost';
import { PostSchema } from '@/schemas';
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
import FormError from '@/components/FormError';
import FormSuccess from '@/components/FormSuccess';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

export default function AddPostForm() {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string | undefined>('');
	const { data } = useSession();

	const form = useForm<z.infer<typeof PostSchema>>({
		resolver: zodResolver(PostSchema),
		defaultValues: {
			title: '',
			content: '',
			author: `${data?.user.firstname ?? ''} ${data?.user.lastname ?? ''}`.trim(),
		},
	});

	const joditConfig = useMemo(
		() => ({
			uploader: {
				url: '/api/upload-image',
				method: 'POST',
				fieldName: 'image',
				filesVariableName: () => 'image',
				format: 'json',
				isSuccess(resp: Record<string, unknown>) {
					return Boolean(resp.url) && !resp.error;
				},
				getMessage(resp: Record<string, unknown>) {
					return (resp.error as string) ?? '';
				},
				process(resp: Record<string, unknown>) {
					return {
						files: resp.url ? [resp.url as string] : [],
						path: '',
						baseurl: '',
						error: resp.error ? 1 : 0,
						message: (resp.error as string) ?? '',
					};
				},
				defaultHandlerSuccess(
					this: { s: { insertImage: (url: string) => void } },
					data: { files: string[] }
				) {
					(data.files || []).forEach((url: string) => this.s.insertImage(url));
				},
			},
		}),
		[]
	);

	const onSubmit = async (values: z.infer<typeof PostSchema>) => {
		setError('');
		setSuccess('');

		startTransition(() => {
			addPost(values).then((response) => {
				if (response.success) {
					form.reset();
					setSuccess(response.success);
					return;
				}

				setError(response.error);
			});
		});
	};

	return (
		<div className="flex min-h-screen flex-col items-center bg-white relative overflow-hidden w-full">
			<MaxWidthWrapper className="flex flex-col items-center justify-center mt-7">
				<h1 className="text-3xl font-bold mb-5">Dodaj post</h1>
				<div className="w-full">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
												<Select onValueChange={field.onChange} value={field.value}>
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
								Dodaj post
							</Button>
						</form>
					</Form>
				</div>
			</MaxWidthWrapper>
		</div>
	);
}
