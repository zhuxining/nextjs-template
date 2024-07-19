/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: {
			allowedOrigins: ["localhost", "*.my-proxy.com"],
		},
	},
};

export default nextConfig;
