'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRepo } from '@/lib/store';
import { PTop } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { CatIcon, StatusBadge, SeverityBadge, EmptyState, communityName } from '@/components/civic';
import { QUEUES } from '@/components/gov/queues';
import { AGENCIES } from '@/lib/domain/routing';
import { timeAgo } from '@/lib/format';

const ORDER = { urgent: 0, high: 1, medium: 2, low: 3 } as const;

export default function ReportsQueuePage() { return <Suspense><Queue /></Suspense>; }

function Queue() {
  const repo = useRepo(); const router = useRouter(); const params = useSearchParams();
  const [tab, setTab] = useState(params.get('q') && QUEUES[params.get('q')!] ? params.get('q')! : 'new');
  const [q, setQ] = useState('');
  useEffect(() => { if (params.get('q')) router.replace('/gov/reports'); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const base = repo.allReportsInternal().filter((r) => !r.mergedInto);
  const rows = base.filter(QUEUES[tab].f).filter((r) => !q || `${r.ref} ${r.title} ${r.street}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => ORDER[a.priority] - ORDER[b.priority] || b.createdAt.localeCompare(a.createdAt));
  return <>
    <PTop title="Reports" sub="Triage, verify, route and track every report. Serious problems are sorted first, whatever their confirmation count." />
    <div className="tabs" role="tablist">{Object.entries(QUEUES).map(([k, qq]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{qq.label}<span className="n">{base.filter(qq.f).length}</span></button>)}</div>
    <div className="row" style={{ marginBottom: 12 }}>
      <form className="search grow" style={{ maxWidth: 380 }} onSubmit={(e) => { e.preventDefault(); setQ(String(new FormData(e.currentTarget).get('q') ?? '')); }}><Icon name="search" size={18} /><input className="input" name="q" defaultValue={q} placeholder="Search reference, street, title" aria-label="Search reports" /></form>
    </div>
    {rows.length ? (
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Report</th><th>Location</th><th>Status</th><th>Priority</th><th>Severity</th><th>Affected</th><th>Authority</th><th>Updated</th></tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={r.ref} className="click" onClick={() => router.push(`/gov/reports/${r.ref}`)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && router.push(`/gov/reports/${r.ref}`)}>
            <td><div className="row gap-12"><CatIcon category={r.category} size={30} /><div style={{ minWidth: 0, maxWidth: 280 }}><div className="ellipsis" style={{ fontWeight: 650 }}>{r.title}</div><div className="xs faint tnum">{r.ref}</div></div></div></td>
            <td className="small">{r.street}<div className="xs faint">{communityName(r.community)}</div></td>
            <td><StatusBadge status={r.status} /></td><td><span className={`priority ${r.priority}`}>{r.priority}</span></td>
            <td><SeverityBadge severity={r.validatedSeverity ?? r.severity} /></td><td className="tnum">{r.affected}</td>
            <td className="small">{AGENCIES[r.agency].short}{r.routingState === 'Needs routing review' && <div className="xs" style={{ color: 'var(--st-planned)' }}>Needs routing review</div>}</td>
            <td className="xs faint">{timeAgo(r.timeline.at(-1)!.at)}</td>
          </tr>))}</tbody></table>
        <div className="pager"><span>Showing {rows.length} of {rows.length}</span><div className="row"><button className="btn btn-ghost btn-sm" disabled>Previous</button><button className="btn btn-ghost btn-sm" disabled>Next</button></div></div>
      </div>
    ) : <div className="card"><EmptyState title="Queue is clear" body="Nothing here right now. Nice work." /></div>}
  </>;
}
