import type { Metadata, Viewport } from 'next';
import { Header, LangProvider, RevealObserver, Translator } from '@/components/client';
import { Footer } from '@/components/sections';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'NaijaWorks · See it. Report it. Watch it get fixed.', template: '%s · NaijaWorks' },
  description: 'Report potholes, broken streetlights, blocked drains and other public infrastructure problems in Nigeria, and follow every step until they are fixed.',
  icons: { icon: "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2040%2040'%3E%3Crect%20width='40'%20height='40'%20rx='12'%20fill='%23F5B301'/%3E%3Cpath%20d='M20%2033.5c-1.1%200-6.2-5.4-8.3-8.6A10.6%2010.6%200%201%201%2030.6%2018c0%202.6-.9%204.8-2.3%206.9-2.1%203.2-7.2%208.6-8.3%208.6Z'%20fill='%230F3B2A'/%3E%3Cpath%20d='M15.4%2018.3l3.2%203.2%206.2-6.6'%20fill='none'%20stroke='%23F5B301'%20stroke-width='3.2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3E%3C/svg%3E" },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#FBF8F1' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <head>
        {/* Loaded at runtime; the system font stack takes over when offline. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..600,50;1,9..144,300..600,50&family=Inter:wght@400..700&display=swap" />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
        <LangProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <RevealObserver />
          <Translator />
        </LangProvider>
      </body>
    </html>
  );
}
