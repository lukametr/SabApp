/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    esmExternals: false,
  },

  // Proxy API requests to backend during development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },

  // Environment variables configuration
  env: {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID:
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      '675742559993-5quocp5mgvmog0fd2g8ue03vpleb23t5.apps.googleusercontent.com',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  },

  // Public runtime config for client-side access
  publicRuntimeConfig: {
    googleClientId:
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      '675742559993-5quocp5mgvmog0fd2g8ue03vpleb23t5.apps.googleusercontent.com',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
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
        new (require('webpack').DefinePlugin)({
          'process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID': JSON.stringify(
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
              '675742559993-5quocp5mgvmog0fd2g8ue03vpleb23t5.apps.googleusercontent.com'
          ),
          'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
          ),
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
        })
      );
    }

    return config;
  },
};

module.exports = nextConfig;
