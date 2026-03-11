'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import * as z from 'zod';

import findUserById from '@/actions/findUserById';
import { editUser } from '@/actions/editUser';
import { EditUserSchema } from '@/schemas';
import { isAdmin } from '@/lib/permissions';
import { CardWrapper } from '@/components/auth/CardWrapper';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Form,
	FormControl,
	FormField,
	FormMessage,
	FormItem,
	FormLabel,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import FormError from '@/components/FormError';
import FormSuccess from '@/components/FormSuccess';
import { ROLES } from '@/constants/roles';

const roles = Object.values(ROLES);

export default function EditUserForm() {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string | undefined>('');
	const { data: session } = useSession();
	const searchParams = useSearchParams();
	const userId = searchParams.get('userId');
	const userIsAdmin = isAdmin(session?.user?.role);

	const form = useForm<z.infer<typeof EditUserSchema>>({
		resolver: zodResolver(EditUserSchema),
		defaultValues: {
			username: '',
			firstname: '',
			lastname: '',
			role: [],
			newPassword: '',
			confirmPassword: '',
		},
	});

	useEffect(() => {
		if (!userId) {
			return;
		}

		findUserById(userId)
			.then((userData) => {
				form.reset({
					username: userData.username,
					firstname: userData.firstname,
					lastname: userData.lastname,
					role: userData.role,
					newPassword: '',
					confirmPassword: '',
				});
			})
			.catch(() => {
				setError('Nie udało się pobrać danych użytkownika.');
			});
	}, [form, userId]);

	const onSubmit = async (values: z.infer<typeof EditUserSchema>) => {
		setError('');
		setSuccess('');

		startTransition(() => {
			if (!userId) {
				setError('Brakuje identyfikatora użytkownika.');
				return;
			}

			editUser(userId, values)
				.then((response) => {
					if (response.success) {
						setSuccess(
							'message' in response
								? response.message
								: 'Dane użytkownika zostały zapisane.'
						);
						return;
					}

					setError(
						'error' in response
							? response.error
							: 'Nie udało się zapisać zmian.'
					);
				})
				.catch(() => {
					setError('Coś poszło nie tak podczas edytowania użytkownika.');
				});
		});
	};

	return (
		<div className="ml-5 mt-5">
			<CardWrapper
				headerLabel="Edytuj użytkownika"
				backButtonHref="/dashboard/profile"
				backButtonLabel="Powrót"
			>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<div className="flex flex-col gap-y-6">
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nazwa użytkownika</FormLabel>
										<FormControl>
											<Input
												placeholder="Tomasz"
												{...field}
												disabled={isPending}
												type="text"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="firstname"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Imię</FormLabel>
										<FormControl>
											<Input
												placeholder="Tomasz"
												{...field}
												disabled={isPending}
												type="text"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastname"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nazwisko</FormLabel>
										<FormControl>
											<Input
												placeholder="Brzeziński"
												{...field}
												disabled={isPending}
												type="text"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{userIsAdmin && (
								<FormField
									control={form.control}
									name="role"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Wybierz role</FormLabel>
											<div className="space-y-2">
												{roles.map((role) => (
													<div
														key={role}
														className="flex items-center space-x-2"
													>
														<Checkbox
															checked={field.value.includes(role)}
															onCheckedChange={(checked) => {
																const updatedRoles = checked
																	? [...field.value, role]
																	: field.value.filter((currentRole) => currentRole !== role);

																field.onChange(updatedRoles);
															}}
															disabled={isPending}
														/>
														<span>
															{role.charAt(0).toUpperCase() + role.slice(1)}
														</span>
													</div>
												))}
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}

							<FormField
								control={form.control}
								name="newPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nowe hasło</FormLabel>
										<FormControl>
											<Input
												placeholder="Wprowadź nowe hasło"
												{...field}
												disabled={isPending}
												type="password"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Potwierdź nowe hasło</FormLabel>
										<FormControl>
											<Input
												placeholder="Potwierdź nowe hasło"
												{...field}
												disabled={isPending}
												type="password"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{error !== undefined && <FormError message={error} />}
						{success !== undefined && <FormSuccess message={success} />}

						<Button type="submit" className="w-full" disabled={isPending}>
							Zapisz zmiany
						</Button>
					</form>
				</Form>
			</CardWrapper>
		</div>
	);
}
