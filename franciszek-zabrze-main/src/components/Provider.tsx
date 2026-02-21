'use client';

// Providers

import { SessionProvider } from 'next-auth/react';

// Types

import { FC, useEffect } from 'react';

// Interfaces

interface ProviderProps {
	children: React.ReactNode;
}

const Provider: FC<ProviderProps> = ({ children }) => {
	useEffect(() => {
		console.log('[PROVIDER] Client-side provider mounted');
		
		// Log all failed resources
		const observer = new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				if (entry.transferSize === 0 && entry.name.indexOf('http') === 0) {
					console.error('[PROVIDER] Failed to load resource:', entry.name);
				}
			}
		});
		
		observer.observe({ entryTypes: ['resource'] });
		
		return () => observer.disconnect();
	}, []);

	console.log('[PROVIDER] Rendering SessionProvider');
	return <SessionProvider>{children}</SessionProvider>;
};

export default Provider;
