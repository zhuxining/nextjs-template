/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: {
			allowedOrigins: ["localhost", "*.my-proxy.com"],
		},
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
};

export default nextConfig;
