'use client';
import Link from 'next/link';
import { CitizenShell } from '@/components/shells';
import { EmptyState } from '@/components/civic';

export function NotFound() {
  return (
    <CitizenShell nav="home">
      <div className="screen"><h1 className="sr-only">Not found</h1><EmptyState title="We couldn’t find that" body="The report may have been merged or the link is wrong."><Link className="btn btn-primary" href="/">Go home</Link></EmptyState></div>
    </CitizenShell>
  );
}
