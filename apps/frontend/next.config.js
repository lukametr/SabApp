/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ESLint configuration - disable for production builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration - disable type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    domains: ['sabapp.com', 'localhost'],
    unoptimized: true,
  },

  // Note: Headers temporarily disabled to resolve build mode conflict
  // TODO: Re-enable headers after confirming standalone mode works
  // async headers() {
  //   return [
  //     {
  //       source: '/:path*',
  //       headers: [
  //         {
  //           key: 'Content-Security-Policy',
  //           value: [
  //             "default-src 'self'",
  //             "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  //             "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  //             "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
  //             "font-src 'self' https://fonts.gstatic.com data:",
  //             "img-src 'self' data: blob: https:",
  //             "connect-src 'self' https://sabapp.com data: blob:",
  //             "frame-src 'self'",
  //             "frame-ancestors 'none'",
  //             "object-src 'none'",
  //             "base-uri 'self'",
  //             "form-action 'self'",
  //             'upgrade-insecure-requests',
  //           ].join('; '),
  //         },
  //         {
  //           key: 'X-Frame-Options',
  //           value: 'SAMEORIGIN',
  //         },
  //         {
  //           key: 'X-Content-Type-Options',
  //           value: 'nosniff',
  //         },
  //         {
  //           key: 'Referrer-Policy',
  //           value: 'strict-origin-when-cross-origin',
  //         },
  //         {
  //           key: 'Permissions-Policy',
  //           value: 'camera=(self), microphone=(self), geolocation=(self)',
  //         },
  //       ],
  //     },
  //   ];
  // },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://sabapp.com/api',
  },
  // Proxy browser calls to /api/* to the backend service at runtime
  async rewrites() {
    // Always proxy to the internal backend in the same container by default.
    // Allow override via BACKEND_INTERNAL_ORIGIN at build/start time.
    const origin = process.env.BACKEND_INTERNAL_ORIGIN || 'http://127.0.0.1:10000';

    return [
      // Special-case backend health (backend exposes /health without /api prefix)
      {
        source: '/api/health',
        destination: `${origin}/health`,
      },
      // General proxy for all backend API endpoints
      {
        source: '/api/:path*',
        destination: `${origin}/api/:path*`,
      },
    ];
  },
  // Use standalone output for deployment - supports API routes unlike static export
  output: 'standalone',
};

module.exports = nextConfig;
