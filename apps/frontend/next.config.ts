import { NextConfig } from 'next';

const config: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['saba-api.onrender.com', 'localhost'],
  },
  // ... existing code ...
}; 