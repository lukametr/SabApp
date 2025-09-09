import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // დაამატე CSP header რომელიც უშვებს sabapp.com API-ს
  response.headers.set(
    'Content-Security-Policy',
    `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://*.google.com https://accounts.google.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com;
      style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com;
      font-src 'self' data: https://fonts.gstatic.com;
      img-src 'self' data: blob: https:;
      connect-src 'self' https://sabapp.com http://localhost:10000 https://*.googleapis.com https://*.google.com https://*.gstatic.com data: blob:;
      media-src 'self' blob:;
      object-src 'none';
      frame-src 'self' https://accounts.google.com;
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim()
  )
  
  return response
}

export const config = {
  matcher: '/:path*',
}
