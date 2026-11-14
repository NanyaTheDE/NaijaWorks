'use client';
import { useRouter } from 'next/navigation';
import { useRepo } from '@/lib/store';
import { PTop } from '@/components/shells';
import { ProgressBar } from '@/components/civic';
import { fmtDate } from '@/lib/format';

const WO_COLOR: Record<string, string> = { in_progress: 'var(--st-active)', scheduled: 'var(--st-planned)', completed: 'var(--st-done)', paused: 'var(--st-blocked)' };

export default function WorkOrdersPage() {
  const repo = useRepo(); const router = useRouter();
  return <>
    <PTop title="Work Orders" sub="Approved work assigned to contractors and maintenance teams." />
    <div className="table-wrap"><table className="table">
      <thead><tr><th>Work order</th><th>Scope</th><th>Contractor / team</th><th>Start</th><th>Target</th><th>Progress</th><th>Status</th></tr></thead>
      <tbody>{repo.listWorkOrders().map((w) => (
        <tr key={w.id} className="click" onClick={() => router.push(`/gov/work-orders/${w.id}`)}>
          <td><b className="tnum">{w.id}</b><div className="xs faint">{w.reportRef}</div></td>
          <td className="small" style={{ maxWidth: 300 }}>{w.scope}</td><td className="small">{repo.getContractor(w.contractor).name}</td>
          <td className="small">{fmtDate(w.start)}</td>
          <td className="small">{fmtDate(w.target)}{w.originalTarget && <div className="xs" style={{ color: 'var(--st-planned)' }}>was {fmtDate(w.originalTarget)}</div>}</td>
          <td style={{ width: 120 }}><ProgressBar pct={w.progress} /><span className="xs faint">{w.progress}%</span></td>
          <td><span className="status" style={{ '--c': WO_COLOR[w.status] ?? 'var(--st-new)' } as React.CSSProperties}>{w.status.replace('_', ' ')}</span></td>
        </tr>))}</tbody></table></div>
  </>;
}
