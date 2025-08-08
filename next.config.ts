import type { NextConfig } from 'next';

const remoteHost =
  process.env.NODE_ENV === 'development'
    ? 'localhost'
    : 'datatram-backend.onrender.com';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: remoteHost,
      },
      {
        hostname: 'img.clerk.com',
      },
    ],
  },
};

export default nextConfig;
