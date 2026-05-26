'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitTracker() {
	const pathname = usePathname();
	const tracked = useRef<Set<string>>(new Set());

	useEffect(() => {
		if (tracked.current.has(pathname)) return;
		tracked.current.add(pathname);

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
