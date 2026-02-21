import { handlers } from '@/auth/auth';

console.log('[NEXTAUTH_ROUTE] NextAuth route handler loaded');

export const { GET, POST } = handlers;
