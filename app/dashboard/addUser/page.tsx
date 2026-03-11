// Functions
import { auth } from '@/auth/auth';
import { canManageUsers } from '@/lib/permissions';

// Components
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import AddUserForm from '@/components/auth/AddUserForm';
import PermissionDenied from '@/components/dashboard/PermissionDenied';

export default async function addUser() {
	const session = await auth();
	if (!session?.user) return null;

	if (!canManageUsers(session.user.role)) {
		return (
			<PermissionDenied message="Tylko administrator może tworzyć nowe konta i nadawać uprawnienia." />
		);
	}

	return (
		<div className="flex min-h-screen flex-col items-center bg-white relative overflow-hidden">
			<MaxWidthWrapper className="flex flex-col items-center justify-center mt-7">
				<h1 className="text-3xl font-bold mb-5">Dodaj użytkownika</h1>
				<AddUserForm />
			</MaxWidthWrapper>
		</div>
	);
}
