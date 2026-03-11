import { auth } from '@/auth/auth';
import EditUserForm from '@/components/dashboard/EditUserForm';
import PermissionDenied from '@/components/dashboard/PermissionDenied';
import { canManageUsers } from '@/lib/permissions';

interface EditUserPageProps {
	searchParams: Promise<{
		userId?: string;
	}>;
}

export default async function EditUserPage({ searchParams }: EditUserPageProps) {
	const session = await auth();
	const resolvedSearchParams = await searchParams;
	const targetUserId = resolvedSearchParams.userId;

	if (!session?.user || !targetUserId) {
		return (
			<PermissionDenied message="Nie udało się ustalić, którego użytkownika chcesz edytować." />
		);
	}

	const isOwnProfile = session.user.id === targetUserId;
	const canEditUser = canManageUsers(session.user.role) || isOwnProfile;

	if (!canEditUser) {
		return (
			<PermissionDenied message="Możesz edytować tylko własne konto, chyba że masz rolę administratora." />
		);
	}

	return <EditUserForm />;
}
