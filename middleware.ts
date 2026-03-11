export { auth as middleware } from '@/auth/auth';

export const config = {
	matcher: ['/dashboard/:path*', '/signIn'],
};
