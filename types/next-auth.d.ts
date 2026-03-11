// Functions

import { DefaultSession } from 'next-auth';
import type { Role } from '@/constants/roles';

declare module 'next-auth' {
	interface Session {
		user: User & DefaultSession['user'];
	}

	interface User {
		id: string;
		username: string;
		role: Role[];
		firstname: string | null;
		lastname: string | null;
	}
}
