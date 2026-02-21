// Next-Auth

import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// Database

import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';

// Cryptography

import bcrypt from 'bcryptjs';

import { DefaultSession } from 'next-auth';
import { ROLES } from '../constants/roles';

declare module 'next-auth' {
	interface User {
		username: string;
		role: Array<(typeof ROLES)[keyof typeof ROLES]>;
		firstname: string | null;
		lastname: string | null;
	}

	interface Session {
		user: {
			id: string;
			username: string;
			role: Array<(typeof ROLES)[keyof typeof ROLES]>;
			firstname: string | null;
			lastname: string | null;
		} & DefaultSession['user'];
	}
}

export const { handlers, auth, signIn, signOut } = NextAuth({
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/signIn',
	},
	callbacks: {
		async jwt({ token, user, account }) {
			console.log('[JWT_CALLBACK] Called', { userId: user?.id, hasAccount: !!account });
			if (user) {
				token.id = user.id;
				token.username = user.username;
				token.role = user.role;
				token.firstname = user.firstname;
				token.lastname = user.lastname;
				console.log('[JWT_CALLBACK] Token updated for user:', user.username);
			}
			return token;
		},
		async session({ session, token }) {
			console.log('[SESSION_CALLBACK] Called', { userId: token.id });
			if (token) {
				session.user.id = token.id as string;
				session.user.username = token.username as string;
				session.user.role = token.role as Array<
					(typeof ROLES)[keyof typeof ROLES]
				>;
				session.user.firstname = token.firstname as string | null;
				session.user.lastname = token.lastname as string | null;
				console.log('[SESSION_CALLBACK] Session updated for user:', token.username);
			}
			return session;
		},
	},
	providers: [
		Credentials({
			credentials: {
				username: { label: 'Username', type: 'text' },
				password: { label: 'Password', type: 'text' },
			},
			async authorize(
				credentials: Partial<Record<'username' | 'password', unknown>>,
				req: Request
			): Promise<User | null> {
				try {
					console.log('[AUTHORIZE] Starting authorization for:', credentials?.username);
					if (!credentials?.username || !credentials.password) {
						console.log('[AUTHORIZE] Missing credentials');
						return null;
					}

					const user = await db.user.findUnique({
						where: {
							username: credentials.username as string,
						},
					});

					if (!user) {
						console.log('[AUTHORIZE] User not found:', credentials.username);
						return null;
					}

					if (!user.password) {
						console.log('[AUTHORIZE] User has no password:', credentials.username);
						return null;
					}

					const passwordsMatch = await bcrypt.compare(
						credentials.password as string,
						user.password
					);

					if (!passwordsMatch) {
						console.log('[AUTHORIZE] Password mismatch for user:', credentials.username);
						return null;
					}

					console.log('[AUTHORIZE] Authorization successful for:', user.username);
					return {
						id: user.id,
						username: user.username,
						role: user.role as Array<(typeof ROLES)[keyof typeof ROLES]>,
						firstname: user.firstname,
						lastname: user.lastname,
						email: user.email || undefined,
					};
				} catch (error) {
					console.error('[AUTHORIZE] Authentication error:', error);
					return null;
				}
			},
		}),
	],
});
