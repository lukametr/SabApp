import { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  images: {
    domains: ['saba-backend.onrender.com', 'localhost'],
    unoptimized: true,
  },
  distDir: 'out',
  trailingSlash: true,
  // Disable server-side features since we're using static export
  experimental: {
    appDir: true,
  },
  // Ensure all pages are static
  staticPageGenerationTimeout: 120,
  // Disable server-side features
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://saba-backend.onrender.com/api',
  },
  // TypeScript and ESLint settings
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
};

export default config; 