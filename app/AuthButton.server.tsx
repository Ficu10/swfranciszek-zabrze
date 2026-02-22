// Funtions

import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth/auth';

// Components

import AuthButtonClient from './AuthButton.client';

export default async function AuthButton() {
	let session = null;
	
	try {
		console.log('[AuthButton] Calling auth()...');
		session = await auth();
		console.log('[AuthButton] Auth success, session:', !!session);
		
		if (session && session.user) {
			console.log('[AuthButton] Processing user:', session.user.username);
			session.user = {
				id: session.user.id,
				username: session.user.username,
				role: session.user.role,
				firstname: session.user.firstname,
				lastname: session.user.lastname,
			};
		}
	} catch (error) {
		console.error('[AuthButton] Error fetching auth session:', error);
		// Continue without session if auth fails
		session = null;
	}

	console.log('[AuthButton] Rendering with session:', !!session);
	return (
		<SessionProvider session={session}>
			<AuthButtonClient />
		</SessionProvider>
	);
}
