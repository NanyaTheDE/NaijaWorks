import type { Metadata, Viewport } from 'next';
import { Header, LangProvider, RevealObserver } from '@/components/client';
import { Footer } from '@/components/sections';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'NaijaWorks · See it. Report it. Watch it get fixed.', template: '%s · NaijaWorks' },
  description: 'Report potholes, broken streetlights, blocked drains and other public infrastructure problems in Nigeria, and follow every step until they are fixed.',
  icons: { icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='12' fill='%23F5B301'/%3E%3Cpath d='M11 29V12l18 17V12' stroke='%23063D27' stroke-width='4.2' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E" },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#F6F4EE' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <head>
        {/* Loaded at runtime; the system font stack takes over when offline. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Inter:wght@400..700&display=swap" />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
        <LangProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <RevealObserver />
        </LangProvider>
      </body>
    </html>
  );
}
