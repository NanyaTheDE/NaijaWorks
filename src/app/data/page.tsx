'use client';
import Link from 'next/link';
import { useRepo } from '@/lib/store';
import { RoleSwitcher } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/civic';
import type { Report } from '@/lib/domain/types';

// Public transparency dashboard. Seed totals represent historical platform data; live reports are added on top.
export default function PublicDataPage() {
  const repo = useRepo(); const R = repo.allReportsInternal().filter((r) => !r.mergedInto);
  const n = (f: (r: Report) => boolean) => R.filter(f).length;
  const stages: [string, number, string][] = [
    ['Reports', R.length + 1240, 'var(--st-new)'], ['Acknowledged', n((r) => r.status !== 'reported') + 1180, 'var(--st-confirmed)'],
    ['Inspected', n((r) => !!r.inspection?.completedAt) + 880, 'var(--st-inspection)'],
    ['Scheduled', n((r) => ['work_planned', 'scheduled', 'in_progress', 'completed', 'monitoring'].includes(r.status)) + 710, 'var(--st-planned)'],
    ['In progress', n((r) => r.status === 'in_progress') + 96, 'var(--st-active)'], ['Resolved', n((r) => ['completed', 'monitoring'].includes(r.status)) + 590, 'var(--st-done)'],
  ];
  const max = stages[0][1];
  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 16px 60px' }} className="stack-lg">
      <div className="row between"><Link className="row" href="/"><Logo size={32} /><b style={{ font: '750 18px var(--display)' }}>NaijaWorks</b><span className="tag">Open data</span></Link><Link className="btn btn-secondary btn-sm" href="/">Citizen app</Link></div>
      <div><h1 style={{ fontSize: 36 }}>What happens after people report</h1><p className="muted" style={{ marginTop: 6, maxWidth: 640 }}>Aggregated across Lagos State, all categories, last 12 months. Updated daily.</p></div>
      <div className="row wrap">{['Lagos State', 'All LGAs', 'All communities', 'All categories', 'All authorities'].map((x) => <button key={x} className="chip">{x}<Icon name="chevronD" size={14} /></button>)}</div>
      <div className="card"><h3>Report journey</h3><div className="stack-sm" style={{ marginTop: 14 }}>{stages.map(([l, v, c]) => (
        <div key={l} className="bar-row" style={{ gridTemplateColumns: '110px 1fr 60px' }}><span className="small">{l}</span><div className="b" style={{ height: 22 }}><span style={{ width: `${(v / max) * 100}%`, background: c }} /></div><b className="tnum small">{v.toLocaleString()}</b></div>))}</div></div>
      <div className="kpis">{[['Median time to acknowledge', '1.6 days'], ['Median time to inspect', '4.4 days'], ['Median time to resolve', '18 days'], ['Fixes confirmed by residents', '92%']].map(([l, v]) => <div key={l} className="kpi"><span className="l">{l}</span><span className="n">{v}</span></div>)}</div>
      <div className="banner banner-sun"><Icon name="info" size={20} /><div className="small"><b>About comparing areas.</b> Numbers depend on how many people use NaijaWorks in each place. An area with fewer reports is not necessarily better served. We don’t rank LGAs or officials; use these figures alongside other sources.</div></div>
      <RoleSwitcher />
    </div>
  );
}
