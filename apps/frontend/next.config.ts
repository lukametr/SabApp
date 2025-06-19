import { NextConfig } from 'next';

const config: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['saba-api.onrender.com', 'localhost'],
  },
  experimental: {
    optimizeCss: true,
  },
  distDir: '.next',
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  trailingSlash: true,
  generateStaticParams: async () => {
    return [];
  },
};

export default config; 