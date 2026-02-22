/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
				port: '',
				pathname: '**',
			},
		],
	},
	// Use serverless functions instead of edge runtime
	// This allows Node.js modules like jsdom to work properly
	experimental: {
		serverActions: {
			bodySizeLimit: '2mb',
		},
	},
	webpack: (config, { isServer }) => {
		if (isServer) {
			// Ensure jsdom and its dependencies are not bundled in client code
			config.externals = [...(config.externals || []), 'jsdom'];
		}
		return config;
	},
	async headers() {
		return [
			{
				// Apply security headers to all routes
				source: '/(.*)',
				headers: [
					{
						key: 'Strict-Transport-Security',
						value: 'max-age=31536000; includeSubDomains; preload'
					},
					{
						key: 'X-DNS-Prefetch-Control',
						value: 'on'
					},
					{
						key: 'X-Download-Options',
						value: 'noopen'
					},
				],
			},
		];
	},
};

export default nextConfig;
