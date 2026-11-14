import type { Metadata } from 'next';
import { PortalShell } from '@/components/shells';

export const metadata: Metadata = { title: 'Operations' };

export default function GovLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
