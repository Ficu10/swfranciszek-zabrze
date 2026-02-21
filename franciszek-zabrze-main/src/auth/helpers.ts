'use server';
import { signIn as naSignIn, signOut as naSignOut } from '@/auth/auth';

export async function signIn() {
	console.log('[AUTH_HELPERS] signIn called');
	try {
		await naSignIn();
		console.log('[AUTH_HELPERS] signIn successful');
	} catch (error) {
		console.error('[AUTH_HELPERS] signIn error:', error);
		throw error;
	}
}

export async function signOut() {
	console.log('[AUTH_HELPERS] signOut called');
	try {
		await naSignOut();
		console.log('[AUTH_HELPERS] signOut successful');
	} catch (error) {
		console.error('[AUTH_HELPERS] signOut error:', error);
		throw error;
	}
}
