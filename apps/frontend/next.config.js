/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    esmExternals: false,
  },
  output: 'export',
  distDir: 'out',
  
  // Environment variables configuration
  env: {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://saba-app-production.up.railway.app/api',
  },
  
  // Public runtime config for client-side access
  publicRuntimeConfig: {
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://saba-app-production.up.railway.app/api',
  },
  
  // Ensure environment variables are available at build time
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  
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

module.exports = nextConfig;
