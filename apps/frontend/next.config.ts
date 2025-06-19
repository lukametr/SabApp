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
};

export default config; 