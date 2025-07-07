import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Navigation from '../components/Navigation';
import Script from 'next/script';

// Font optimization with proper configuration
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'arial'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Document Management System',
  description: 'A modern document management system',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka" className={inter.variable}>
      <head>
        {/* Font preconnect for better performance */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        
        {/* Google Sign-In Script */}
        <Script 
          src="https://accounts.google.com/gsi/client?hl=ka" 
          async 
          defer
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.className} font-sans`}>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
} 