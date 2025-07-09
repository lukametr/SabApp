/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production configuration for Railway
  trailingSlash: true,
  skipTrailingSlashRedirect: true,

  // ESLint configuration - disable for production builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration - disable type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable environment validation during builds
  swcMinify: false,

  images: {
    unoptimized: true,
  },
  experimental: {
    esmExternals: false,
  },

  // Only use export mode in production
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    distDir: 'out',
  }),

  // Environment variables configuration
  env: {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000/api',
  },

  // Public runtime config for client-side access
  publicRuntimeConfig: {
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000/api',
  },

  webpack: (config, { isServer }) => {
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
