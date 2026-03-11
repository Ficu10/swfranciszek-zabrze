import { auth } from '@/auth/auth';
import AddPostForm from '@/components/dashboard/AddPostForm';
import PermissionDenied from '@/components/dashboard/PermissionDenied';
import { canManagePosts } from '@/lib/permissions';

export default async function AddPostPage() {
	const session = await auth();

	if (!session?.user) {
		return null;
	}

	if (!canManagePosts(session.user.role)) {
		return (
			<PermissionDenied message="Dodawanie ogłoszeń, intencji i nabożeństw wymaga roli moderatora albo administratora." />
		);
	}

	return <AddPostForm />;
}
