import { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  images: {
    domains: ['saba-api.onrender.com', 'localhost'],
    unoptimized: true,
  },
  experimental: {
    optimizeCss: true,
  },
  distDir: 'out',
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  trailingSlash: true,
  generateStaticParams: async () => {
    return [];
  },
};

export default config; 