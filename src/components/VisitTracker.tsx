'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const VISIT_SESSION_KEY = 'sfz-visit-tracked';

export default function VisitTracker() {
	const pathname = usePathname();

	useEffect(() => {
		const alreadyTracked = sessionStorage.getItem(VISIT_SESSION_KEY) === '1';
		if (alreadyTracked) return;

		sessionStorage.setItem(VISIT_SESSION_KEY, '1');

		fetch('/api/track-visit', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ path: pathname }),
		}).catch(() => {
			// Silently fail
		});
	}, [pathname]);

	return null;
}
