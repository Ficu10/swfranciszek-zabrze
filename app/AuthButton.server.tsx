// Funtions

import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth/auth';

// Components

import AuthButtonClient from './AuthButton.client';

export default async function AuthButton() {
	let session = null;
	
	try {
		session = await auth();
		
		if (session && session.user) {
			session.user = {
				id: session.user.id,
				username: session.user.username,
				role: session.user.role,
				firstname: session.user.firstname,
				lastname: session.user.lastname,
			};
		}
	} catch (error) {
		console.error('Error fetching auth session:', error);
		// Continue without session if auth fails
		session = null;
	}

	return (
		<SessionProvider session={session}>
			<AuthButtonClient />
		</SessionProvider>
	);
}
