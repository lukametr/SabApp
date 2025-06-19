import { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  images: {
    domains: ['saba-api.onrender.com', 'localhost'],
    unoptimized: true,
  },
  distDir: 'out',
  trailingSlash: true,
  generateStaticParams: async () => {
    return [];
  },
  // Disable server-side features since we're using static export
  experimental: {
    appDir: false,
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
};

export default config; 