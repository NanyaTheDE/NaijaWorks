import type { Metadata, Viewport } from 'next';
import { StoreProvider } from '@/lib/store';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'NaijaWorks', template: '%s · NaijaWorks' },
  description: 'Report infrastructure problems in your community and watch them get fixed.',
  icons: { icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='12' fill='%23F5B301'/%3E%3Cpath d='M11 29V12l18 17V12' stroke='%23063D27' stroke-width='4.2' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E" },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#0B7A4B' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" suppressHydrationWarning>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
