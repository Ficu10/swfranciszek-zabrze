'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

import deleteUser from '@/actions/deleteUser';
import findUsers from '@/actions/findUsers';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';

interface User {
	id: string;
	username: string;
	role: string[];
	firstname: string;
	lastname: string;
}

interface PaginationData {
	data: User[];
	total: number;
	currentPage: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

export default function UsersListPage() {
	const [paginationData, setPaginationData] = useState<PaginationData | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const { data } = useSession();

	const currentPage = Number(searchParams.get('page')) || 1;
	const itemsPerPage = 5;

	useEffect(() => {
		setLoading(true);
		findUsers({ page: currentPage, limit: itemsPerPage })
			.then((result) => {
				setPaginationData(result);
				setLoading(false);
			})
			.catch(() => {
				setPaginationData(null);
				setLoading(false);
			});
	}, [currentPage]);

	const handleDeleteUser = async (userId: string) => {
		await deleteUser(userId);
		const refreshedData = await findUsers({ page: currentPage, limit: itemsPerPage });
		setPaginationData(refreshedData);
	};

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', page.toString());
		router.push(`/dashboard/usersList?${params.toString()}`);
	};

	if (!data) {
		return null;
	}

	const handleEditUser = (userId: string) => {
		router.push(`/dashboard/editUser?userId=${userId}`);
	};

	const users = paginationData?.data || [];

	return (
		<div className="flex min-h-screen flex-col items-center bg-white relative overflow-hidden">
			<MaxWidthWrapper className="flex flex-col items-center justify-center mt-7 gap-y-4">
				<h1 className="text-3xl font-bold">Lista użytkowników</h1>
				{paginationData && (
					<p className="text-sm text-gray-600">
						Strona {paginationData.currentPage} z {paginationData.totalPages} (
						{paginationData.total} użytkowników)
					</p>
				)}
				<div>
					{loading && <p>Ładowanie...</p>}
					{users.map((user) => (
						<div key={user.id} className="flex flex-col gap-y-2 items-center">
							<pre>{`Nazwa użytkownika: ${user.username}`}</pre>
							<pre>{`Rola: ${user.role}`}</pre>
							<pre>{`Imię: ${user.firstname}`}</pre>
							<pre>{`Nazwisko: ${user.lastname}`}</pre>

							<div className="flex gap-x-2 w-full py-5">
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button variant="destructive" size="sm">
											Usuń użytkownika
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Czy jesteś pewny?</AlertDialogTitle>
											<AlertDialogDescription>
												Usunięcie użytkownika jest nieodwracalne. Jeżeli go usuniesz
												nie będzie możliwości przywrócenia go!
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Anuluj</AlertDialogCancel>
											<AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
												Usuń użytkownika
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>

								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleEditUser(user.id)}
								>
									Edytuj dane użytkownika
								</Button>
							</div>
							<hr className="w-full my-7" />
						</div>
					))}
				</div>

				{paginationData && paginationData.totalPages > 1 && (
					<div className="mt-8">
						<Pagination>
							<PaginationContent>
								{paginationData.hasPrevPage && (
									<PaginationItem>
										<PaginationPrevious
											href="#"
											onClick={(event) => {
												event.preventDefault();
												handlePageChange(currentPage - 1);
											}}
										/>
									</PaginationItem>
								)}

								{Array.from(
									{ length: paginationData.totalPages },
									(_, index) => index + 1
								).map((page) => {
									const isVisible =
										page === 1 ||
										page === paginationData.totalPages ||
										(page >= currentPage - 1 && page <= currentPage + 1);

									if (!isVisible) {
										if (page === 2 && currentPage > 4) {
											return (
												<PaginationItem key="ellipsis-start">
													<PaginationEllipsis />
												</PaginationItem>
											);
										}

										if (
											page === paginationData.totalPages - 1 &&
											currentPage < paginationData.totalPages - 3
										) {
											return (
												<PaginationItem key="ellipsis-end">
													<PaginationEllipsis />
												</PaginationItem>
											);
										}

										return null;
									}

									return (
										<PaginationItem key={page}>
											<PaginationLink
												href="#"
												isActive={page === currentPage}
												onClick={(event) => {
													event.preventDefault();
													handlePageChange(page);
												}}
											>
												{page}
											</PaginationLink>
										</PaginationItem>
									);
								})}

								{paginationData.hasNextPage && (
									<PaginationItem>
										<PaginationNext
											href="#"
											onClick={(event) => {
												event.preventDefault();
												handlePageChange(currentPage + 1);
											}}
										/>
									</PaginationItem>
								)}
							</PaginationContent>
						</Pagination>
					</div>
				)}
			</MaxWidthWrapper>
		</div>
	);
}
