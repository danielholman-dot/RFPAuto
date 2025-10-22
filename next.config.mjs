/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This is required to allow the Next.js dev server to accept requests from the
    // Firebase Studio environment.
    allowedDevOrigins: [
      'https://*.cluster-thle3dudhffpwss7zs5hxaeu2o.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;
