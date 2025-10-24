/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // The Cross-Origin Resource Sharing (CORS) policy for the Next.js development server
    // is configured to allow requests from the Firebase Studio preview URL.
    allowedDevOrigins: ["https://6000-firebase-studio-1758829412721.cluster-thle3dudhffpwss7zs5hxaeu2o.cloudworkstations.dev"],
  },
};

export default nextConfig;
