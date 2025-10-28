/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    allowedDevOrigins: [
        "https://*.cloudworkstations.dev",
    ]
  },
};

export default nextConfig;
