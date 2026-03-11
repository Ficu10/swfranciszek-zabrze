// Functions

import { auth } from '@/auth/auth';
import { redirect } from 'next/navigation';
import { canManagePosts, canManageUsers } from '@/lib/permissions';

// Components

import Link from 'next/link';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Provider from '@/components/Provider';

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();
	if (!session?.user) {
		redirect('/signIn?callbackUrl=/dashboard/profile');
	}

	const userRoles = session.user.role;
	const showPostsSection = canManagePosts(userRoles);
	const showUsersSection = canManageUsers(userRoles);

	return (
		<Provider>
			<div className="bg-white pb-8">
				<MaxWidthWrapper className="flex flex-col md:flex-row justify-center item-center">
					<aside className="flex min-h-screen flex-col gap-y-4 items-center bg-white relative overflow-hidden mt-9">
						{showPostsSection && (
							<>
								<Link href="/dashboard/addPost" className="hover:text-blue-600">
									Dodaj post
								</Link>
								<hr className="w-[300px] mb-4" />
							</>
						)}

						{showUsersSection && (
							<>
								<Link href="/dashboard/addUser" className="hover:text-blue-600">
									Utwórz nowego użytkownika
								</Link>
								<hr className="w-[300px] mb-4" />
								<Link href="/dashboard/usersList" className="hover:text-blue-600">
									Lista użytkowników
								</Link>
								<hr className="w-[300px] mb-4" />
							</>
						)}

						<Link href="/dashboard/profile" className="hover:text-blue-600">
							Profil
						</Link>
						<hr className="w-[300px] mb-4" />
					</aside>
					<div>{children}</div>
				</MaxWidthWrapper>
			</div>
		</Provider>
	);
}
