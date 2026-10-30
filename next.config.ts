import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['three'],
  serverExternalPackages: ['@libsql/client'],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
