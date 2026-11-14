'use client';
import { useRepo } from '@/lib/store';
import { PTop } from '@/components/shells';
import { EmptyState } from '@/components/civic';

export default function AuditPage() {
  const repo = useRepo(); const list = repo.state.audit;
  return <>
    <PTop title="Audit log" sub="Every government action is recorded and cannot be edited." />
    {list.length ? (
      <div className="table-wrap"><table className="table"><thead><tr><th>When</th><th>Who</th><th>Action</th><th>Subject</th><th>Detail</th></tr></thead>
        <tbody>{list.map((a, i) => <tr key={a.at + i}><td className="xs">{new Date(a.at).toLocaleString('en-NG')}</td><td className="small">{a.actor}</td><td><span className="tag">{a.action}</span></td><td className="small tnum">{a.subject}</td><td className="xs muted" style={{ fontFamily: 'ui-monospace,monospace', maxWidth: 380 }}>{JSON.stringify(a.detail)}</td></tr>)}</tbody></table></div>
    ) : <div className="card"><EmptyState title="No actions yet this session" body="Verify, assign or schedule a report and it will appear here." /></div>}
  </>;
}
