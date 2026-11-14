'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRepo } from '@/lib/store';
import { FieldFrame } from '@/components/shells';
import { CatIcon, EmptyState, ProgressBar, InlineIcon, communityName } from '@/components/civic';
import { fmtDate } from '@/lib/format';

type Tab = 'assigned' | 'progress' | 'done';

export default function TeamHome() {
  const repo = useRepo(); const [tab, setTab] = useState<Tab>('assigned');
  const all = repo.listWorkOrders();
  const tabs: Record<Tab, typeof all> = {
    assigned: all.filter((w) => ['scheduled', 'approved'].includes(w.status)),
    progress: all.filter((w) => ['in_progress', 'paused'].includes(w.status)),
    done: all.filter((w) => w.status === 'completed'),
  };
  return (
    <FieldFrame aside="Contractor / maintenance team app">
      <div className="field-head stack" style={{ background: '#1D1A10' }}>
        <div><div className="small muted">Field team</div><h1 style={{ color: '#fff', fontSize: 24 }}>Ọ̀nà Roads &amp; Civil · Crew A</h1></div>
        <div className="row" style={{ gap: 10 }}>{([['Assigned', tabs.assigned.length], ['In progress', tabs.progress.length], ['Completed', tabs.done.length]] as const).map(([l, n]) => (
          <div key={l} style={{ flex: 1, background: 'rgb(255 255 255 / .07)', borderRadius: 14, padding: '10px 12px' }}><div style={{ font: '750 22px var(--display)', color: '#fff' }}>{n}</div><div className="xs muted">{l}</div></div>))}</div>
      </div>
      <div className="screen stack" style={{ marginTop: 14 }}>
        <div className="seg" role="tablist">{([['assigned', 'Assigned'], ['progress', 'In progress'], ['done', 'Done']] as [Tab, string][]).map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{l}</button>)}</div>
        {tabs[tab].length ? tabs[tab].map((w) => { const r = repo.getReport(w.reportRef)!; return (
          <Link key={w.id} className="card card-hover stack-sm" href={`/team/${w.id}`}>
            <div className="row between"><b className="tnum">{w.id}</b><span className={`priority ${w.priority}`}>{w.priority}</span></div>
            <div className="row gap-12"><CatIcon category={r.category} size={40} /><div className="grow"><b className="small">{r.title}</b><div className="xs muted">{r.street}, {communityName(r.community)}</div></div></div>
            <div className="row between xs muted"><span><InlineIcon name="calendar" />{fmtDate(w.start)} → {fmtDate(w.target)}</span><span>{w.progress}%</span></div>
            <ProgressBar pct={w.progress} />
          </Link>); }) : <EmptyState title="No jobs here" body="New jobs appear when an officer approves work." />}
      </div>
    </FieldFrame>
  );
}
