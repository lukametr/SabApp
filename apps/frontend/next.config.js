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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' https://accounts.google.com https://www.gstatic.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com;
              style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com;
              frame-src https://accounts.google.com;
              connect-src 'self' https://accounts.google.com https://www.googleapis.com;
              img-src 'self' https://*.gstatic.com https://lh3.googleusercontent.com;
              font-src 'self' https://fonts.gstatic.com;
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ]
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
