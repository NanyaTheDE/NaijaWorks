'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRepo } from '@/lib/store';
import { PTop } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { BeforeAfter, EmptyState, InlineIcon, communityName, photoFor } from '@/components/civic';
import { fmtDate, ngn } from '@/lib/format';

export default function WorkOrderPage() {
  const { id } = useParams<{ id: string }>(); const repo = useRepo();
  const w = repo.getWorkOrder(id); const r = w && repo.getReport(w.reportRef);
  if (!w || !r) return <div className="card"><EmptyState title="Work order not found" body="Check the reference and try again." /></div>;
  const c = repo.getContractor(w.contractor);
  const KV = ({ k, children }: { k: string; children: React.ReactNode }) => <><dt>{k}</dt><dd style={{ textAlign: 'left' }}>{children}</dd></>;
  return <>
    <div className="row xs muted" style={{ marginBottom: 10 }}><Link href="/gov/work-orders" className="link" style={{ fontSize: 13 }}>Work Orders</Link><Icon name="chevronR" size={14} /><span>{w.id}</span></div>
    <PTop title={w.id} sub={r.title}><Link className="btn btn-secondary" href={`/gov/reports/${r.ref}`}>Open report</Link><Link className="btn btn-ghost" href={`/team/${w.id}`}><Icon name="eye" size={16} />Field team view</Link></PTop>
    <div className="pgrid" style={{ marginTop: 0 }}>
      <div className="span-8 stack">
        <div className="card"><dl className="kv" style={{ gridTemplateColumns: 'auto 1fr auto 1fr' }}>
          <KV k="Issue">{r.title}</KV><KV k="Location">{r.street}, {communityName(r.community)}</KV>
          <KV k="Department">{w.department}</KV><KV k="Contractor / team">{c.name} <span className="xs faint">({c.kind})</span></KV>
          <KV k="Priority"><span className={`priority ${w.priority}`}>{w.priority}</span></KV><KV k="Status">{w.status.replace('_', ' ')}</KV>
          <KV k="Start">{fmtDate(w.start)}</KV><KV k="Target completion">{fmtDate(w.target)} {w.originalTarget && <s className="faint">{fmtDate(w.originalTarget)}</s>}</KV>
          <KV k="Actual completion">{w.actual ? fmtDate(w.actual) : '—'}</KV><KV k="Progress">{w.progress}%</KV></dl>
          <h3 style={{ marginTop: 16 }}>Scope</h3><p className="small">{w.scope}</p></div>
        <div className="card"><h3>Progress updates</h3><div className="stack-sm" style={{ marginTop: 12 }}>{w.updates.length ? w.updates.map((u) => (
          <div key={u.at} className="row gap-12"><span className="status" style={{ '--c': 'var(--st-active)' } as React.CSSProperties}>{u.stage}</span><span className="small grow">{u.note}</span><span className="xs faint">{fmtDate(u.at)}</span></div>)) : <p className="small muted">No updates yet.</p>}</div></div>
        {r.completion && <div className="card stack-sm"><h3>Completion evidence</h3><BeforeAfter before={photoFor(r, 'before').scene} after={photoFor(r, 'after').scene} /><p className="small">{r.completion.note}</p></div>}
      </div>
      <div className="span-4 stack">
        <div className="card stack-sm"><h3>Internal only</h3><dl className="kv"><dt>Estimated budget</dt><dd>{ngn(w.estimate)}</dd><dt>Funding source</dt><dd>{w.funding}</dd></dl><p className="xs faint"><InlineIcon name="lock" size={12} />Not shown to the public.</p></div>
        <div className="card stack-sm"><h3>Inspection evidence</h3><p className="small">{r.inspection?.completedAt ? r.inspection.findings : '—'}</p></div>
      </div>
    </div>
  </>;
}
