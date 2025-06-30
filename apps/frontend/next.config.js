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
  
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Ensure environment variables are available in client-side code
    if (!isServer) {
      config.plugins.push(
        new (require('webpack')).DefinePlugin({
          'process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID': JSON.stringify(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''),
          'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(process.env.NEXT_PUBLIC_API_URL || 'https://saba-app-production.up.railway.app/api'),
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
        })
      );
    }
    
    return config;
  },
};

module.exports = nextConfig;
