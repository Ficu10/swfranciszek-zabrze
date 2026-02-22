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
		
		// Log all failed resources
		const observer = new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				const resourceTiming = entry as PerformanceResourceTiming;
				if (resourceTiming.transferSize === 0 && entry.name.indexOf('http') === 0) {
					console.error('[PROVIDER] Failed to load resource:', entry.name);
				}
			}
		});
		
		observer.observe({ entryTypes: ['resource'] });
		
		return () => observer.disconnect();
	}, []);

	return <SessionProvider>{children}</SessionProvider>;
};

export default Provider;
