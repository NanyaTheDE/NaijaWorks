'use client';
import { useRouter } from 'next/navigation';
import { useRepo } from '@/lib/store';
import { PTop } from '@/components/shells';
import { INSPECTORS } from '@/components/gov/queues';
import { INSPECTION_OUTCOMES } from '@/lib/domain/statuses';
import { fmtDate } from '@/lib/format';

const pill = (c: string, l: string) => <span className="status" style={{ '--c': c } as React.CSSProperties}>{l}</span>;

export default function InspectionsPage() {
  const repo = useRepo(); const router = useRouter();
  return <>
    <PTop title="Inspections" sub="Scheduled and completed field inspections." />
    <div className="table-wrap"><table className="table">
      <thead><tr><th>Report</th><th>Inspector</th><th>Date</th><th>Window</th><th>Outcome</th><th>Status</th></tr></thead>
      <tbody>{repo.inspections().map((i) => (
        <tr key={i.id} className="click" onClick={() => router.push(`/gov/reports/${i.report.ref}`)}>
          <td><b className="small">{i.report.title}</b><div className="xs faint">{i.report.ref}</div></td>
          <td className="small">{INSPECTORS.find((p) => p.id === i.inspector)?.name ?? '—'}</td><td className="small">{fmtDate(i.date)}</td><td className="small">{i.window ?? '—'}</td>
          <td className="small">{i.outcome ? INSPECTION_OUTCOMES[i.outcome].label : '—'}</td>
          <td>{i.completedAt ? pill('var(--st-done)', 'Completed') : i.startedAt ? pill('var(--st-active)', 'On site') : pill('var(--st-inspection)', 'Scheduled')}</td>
        </tr>))}</tbody></table></div>
  </>;
}
