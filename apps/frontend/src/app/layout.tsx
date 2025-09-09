import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Navigation from '../components/Navigation';
import ConnectionStatus from '../components/ConnectionStatus';
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000'),
  title: 'უსაფრთხოების შეფასების აპლიკაცია',
  description: 'უსაფრთხოების შეფასების ფორმების შევსება და მართვა',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/logo-3.jpg', type: 'image/jpeg' }
    ],
    apple: '/logo-3.jpg',
    shortcut: '/logo-3.jpg'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
  title: 'უსაფრთხოების შეფასების აპლიკაცია',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
  siteName: 'უსაფრთხოების შეფასების აპლიკაცია',
  title: 'უსაფრთხოების შეფასების აპლიკაცია',
    description: 'უსაფრთხოების შეფასების ფორმების შევსება და მართვა',
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
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="უსაფრთხოების შეფასება" />
        <meta name="theme-color" content="#1976d2" />
        
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
          <ConnectionStatus />
        </Providers>
      </body>
    </html>
  );
} 