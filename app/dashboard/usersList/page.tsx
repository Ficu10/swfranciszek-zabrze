import { auth } from '@/auth/auth';
import PermissionDenied from '@/components/dashboard/PermissionDenied';
import UsersListPage from '@/components/dashboard/UsersListPage';
import { canManageUsers } from '@/lib/permissions';

export default async function UsersListRoute() {
	const session = await auth();

	if (!session?.user) {
		return null;
	}

	if (!canManageUsers(session.user.role)) {
		return (
			<PermissionDenied message="Lista użytkowników jest dostępna tylko dla administratora." />
		);
	}

	return <UsersListPage />;
}
