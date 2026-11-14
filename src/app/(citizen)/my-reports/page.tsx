'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRepo } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { CitizenShell } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { ReportRow, EmptyState, communityName } from '@/components/civic';
import { fmtN } from '@/lib/format';

type Tab = 'active' | 'resolved' | 'following';

export default function MyReportsPage() {
  const repo = useRepo(); const t = useT(); const [tab, setTab] = useState<Tab>('active');
  const mine = repo.myReports();
  const lists: Record<Tab, typeof mine> = {
    active: mine.filter((r) => !['completed', 'monitoring', 'unable'].includes(r.status)),
    resolved: mine.filter((r) => ['completed', 'monitoring'].includes(r.status)),
    following: repo.following(),
  };
  const verified = mine.filter((r) => !['reported', 'under_review', 'unable'].includes(r.status)).length;
  const empty: Record<Tab, React.ReactNode> = {
    active: <EmptyState title="You haven’t reported anything yet" body="Spot something your community needs help with? Let us know."><Link className="btn btn-primary" href="/report">{t('home.cta')}</Link></EmptyState>,
    resolved: <EmptyState title="Nothing resolved yet" body="When work on your reports is completed, you’ll see before-and-after photos here." />,
    following: <EmptyState title="Not following anything" body="Follow issues near you to get updates when inspections and repairs happen."><Link className="btn btn-secondary" href="/explore">Explore nearby</Link></EmptyState>,
  };
  // Demo baseline: the seeded user has history before this session's reports.
  const stats: [string | number, string][] = [[verified + 6, 'verified'], [lists.resolved.length + 4, 'resolved'], [3, 'communities'], [fmtN(mine.reduce((a, r) => a + (r.peopleImpacted || 0), 0)), 'people impacted']];
  return (
    <CitizenShell nav="mine">
      <header className="topbar"><h1 className="grow">{t('nav.mine')}</h1><Link className="icon-btn" href="/notifications" aria-label="Notifications"><Icon name="bell" size={20} />{repo.unreadCount() > 0 && <span className="badge-dot" />}</Link></header>
      <div className="screen stack">
        <div className="hero" style={{ padding: 18 }}>
          <div className="xs" style={{ opacity: 0.8, fontWeight: 700, letterSpacing: '.05em' }}>YOUR IMPACT</div>
          <b style={{ font: '750 20px var(--display)', color: '#fff' }}>Your reports helped improve {communityName(repo.state.prefs.community)}.</b>
          <div className="row" style={{ marginTop: 14, gap: 18 }}>{stats.map(([n, l]) => <div key={l}><div className="tnum" style={{ font: '750 22px var(--display)', color: '#fff' }}>{n}</div><div className="xs" style={{ opacity: 0.8 }}>{l}</div></div>)}</div>
        </div>
        <div className="seg" role="tablist">{([['active', 'Active'], ['resolved', 'Resolved'], ['following', 'Following']] as [Tab, string][]).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{l} <span className="faint">{lists[k].length}</span></button>))}</div>
        <div className="stack-sm">{lists[tab].length ? lists[tab].map((r) => <ReportRow key={r.ref} report={r} />) : empty[tab]}</div>
      </div>
    </CitizenShell>
  );
}
