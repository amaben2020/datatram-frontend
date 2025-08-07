import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        // hostname: 'localhost',
        hostname: 'datatram-backend.onrender.com',
      },
    ],
  },
};

export default nextConfig;
