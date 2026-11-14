'use client';
import Link from 'next/link';
import { useRepo } from '@/lib/store';
import { PTop } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { MapBase, MapPin, CatIcon, StatusBadge, statusColor } from '@/components/civic';
import { QUEUES, INSPECTORS, isOverdue } from '@/components/gov/queues';
import { COMMUNITIES } from '@/lib/api/repo';
import { CATEGORIES } from '@/lib/domain/categories';
import { GROUPS } from '@/lib/domain/statuses';
import { timeAgo } from '@/lib/format';
import type { Report, StatusGroup } from '@/lib/domain/types';

const MONTHS: [string, number, number, number][] = [['Jun', 4.1, 9.2, 31], ['Jul', 3.6, 8.1, 28], ['Aug', 3.2, 7.4, 26], ['Sep', 2.8, 6.0, 23], ['Oct', 2.1, 5.2, 21], ['Nov', 1.6, 4.4, 18]];

export default function DashboardPage() {
  const repo = useRepo();
  const R = repo.allReportsInternal().filter((r) => !r.mergedInto);
  const n = (f: (r: Report) => boolean) => R.filter(f).length;
  const inWork = (r: Report) => ['work_planned', 'scheduled', 'in_progress'].includes(r.status);
  // Workflow pipeline (Jobber pattern): count + two "needs action" sub-counts per stage, linked to its queue.
  const pipeline: [string, StatusGroup, string, string, number, [string, number, boolean?][]][] = [
    ['New', 'new', 'inbox', 'new', n(QUEUES.new.f), [['Urgent', n((r) => QUEUES.new.f(r) && !!r.urgent), true], ['Needs routing review', n((r) => QUEUES.new.f(r) && r.routingState === 'Needs routing review')]]],
    ['Verified', 'confirmed', 'building', 'assign', n((r) => ['verified', 'assigned'].includes(r.status)), [['Awaiting assignment', n((r) => r.status === 'verified')], ['Awaiting inspection', n((r) => r.status === 'assigned')]]],
    ['Inspection', 'inspection', 'clipboard', 'inspection', n((r) => ['inspection_scheduled', 'inspected'].includes(r.status)), [['Scheduled', n((r) => r.status === 'inspection_scheduled')], ['Awaiting decision', n((r) => r.status === 'inspected'), true]]],
    ['Work', 'active', 'hammer', 'work', n(inWork), [['In progress', n((r) => r.status === 'in_progress')], ['Delayed', n((r) => inWork(r) && isOverdue(r)), true]]],
    ['Done', 'done', 'check', 'review', n((r) => ['completed', 'monitoring'].includes(r.status)) + 31, [['Awaiting citizen check', n((r) => r.status === 'completed')], ['Reopened', n((r) => r.status === 'reopened'), true]]],
  ];
  const byCat = CATEGORIES.slice(0, 8).map((c) => ({ c, v: R.filter((r) => r.category === c.key).length * 7 + (c.key === 'road' ? 22 : c.key === 'drainage' ? 14 : 4) }));
  const maxC = Math.max(...byCat.map((x) => x.v));
  const attention = R.filter((r) => (r.urgent || ['reported', 'under_review', 'inspected', 'reopened'].includes(r.status)) && !['completed', 'monitoring', 'unable'].includes(r.status)).slice(0, 6);
  const activity = R.flatMap((r) => r.timeline.map((t) => ({ ...t, r }))).sort((x, y) => y.at.localeCompare(x.at)).slice(0, 8);
  const h = new Date().getHours();

  return <>
    <PTop title={`Good ${h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'}, Funmilayo`} sub={`Lagos State · ${new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}`}>
      <Link className="btn btn-secondary" href="/data"><Icon name="globe" size={17} />Public dashboard</Link>
      <Link className="btn btn-primary" href="/gov/reports"><Icon name="inbox" size={17} />Open queue</Link>
    </PTop>
    <h2 className="sr-only">Workflow</h2>
    <div className="pipeline">{pipeline.map(([label, g, ic, q, count, subs]) => (
      <Link key={label} className="pipe card-hover" href={`/gov/reports?q=${q}`} style={{ '--c': GROUPS[g].color } as React.CSSProperties}>
        <div className="row between"><span className="row small" style={{ fontWeight: 650, color: 'var(--ink-2)' }}><Icon name={ic} size={16} />{label}</span><Icon name="chevronR" size={16} className="faint" /></div>
        <span className="n tnum">{count}</span>{label === 'Done' && <span className="xs faint" style={{ marginTop: -6 }}>this month</span>}
        <div className="subs">{subs.map(([sl, sv, alert]) => <div key={sl} className="row between xs"><span className="muted">{sl}</span><b className="tnum" style={alert && sv ? { color: 'var(--clay)' } : undefined}>{sv}</b></div>)}</div>
      </Link>))}</div>

    <div className="pgrid">
      <div className="card span-7"><div className="row between"><h3>Live map</h3><Link className="link" href="/gov/map">Open map</Link></div>
        <div className="map" style={{ height: 300, marginTop: 12 }}><MapBase />{R.filter((r) => r.status !== 'unable').map((r) => <MapPin key={r.ref} report={r} />)}</div></div>
      <div className="card span-5"><div className="row between"><h3>Needs your attention</h3><Link className="link" href="/gov/reports?q=urgent">All</Link></div>
        <div className="stack-sm" style={{ marginTop: 12 }}>{attention.map((r) => (
          <Link key={r.ref} className="row gap-12 card-hover" href={`/gov/reports/${r.ref}`} style={{ padding: 10, borderRadius: 12, border: '1px solid var(--line)' }}>
            <CatIcon category={r.category} size={32} /><div className="grow" style={{ minWidth: 0 }}><div className="small ellipsis" style={{ fontWeight: 650 }}>{r.title}</div><div className="xs muted">{r.ref} · {timeAgo(r.timeline.at(-1)!.at)}</div></div>
            {r.urgent ? <span className="priority urgent">Urgent</span> : <StatusBadge status={r.status} />}</Link>))}</div></div>
      <div className="card span-6"><h3>Issues by category · last 90 days</h3>
        <div className="chart-bars" style={{ height: 180 }} role="img" aria-label="Bar chart of issues by category">{byCat.map(({ c, v }) => (
          <div key={c.key} className="bc"><span className="tnum" style={{ color: 'var(--ink-2)', fontWeight: 650 }}>{v}</span><span className="bar" style={{ height: `${(v / maxC) * 100}%`, background: c.hue }} /><span>{c.label.split(' ')[0]}</span></div>))}</div></div>
      <div className="card span-6"><h3>Response times (days)</h3><p className="xs faint">Median across all agencies on platform</p>
        <table className="table" style={{ marginTop: 10 }}><thead><tr><th>Month</th><th>Acknowledge</th><th>Inspect</th><th>Resolve</th><th /></tr></thead>
          <tbody>{MONTHS.map(([m, a, i, r]) => <tr key={m}><td>{m}</td><td className="tnum">{a}</td><td className="tnum">{i}</td><td className="tnum">{r}</td><td style={{ width: '40%' }}><div className="mini-progress"><span className="on" style={{ flex: r, background: 'var(--brand)' }} /><span style={{ flex: 35 - r }} /></div></td></tr>)}</tbody></table></div>
      <div className="card span-6"><h3>Issues by LGA</h3><div className="stack-sm" style={{ marginTop: 12 }}>{COMMUNITIES.map((c) => {
        const open = n((r) => r.community === c.slug && !['completed', 'monitoring'].includes(r.status)); const done = n((r) => r.community === c.slug && ['completed', 'monitoring'].includes(r.status));
        return <div key={c.slug} className="bar-row" style={{ gridTemplateColumns: '110px 1fr 90px' }}><span>{c.lgaName}</span><div className="b" style={{ display: 'flex' }}><span style={{ width: `${open * 9}%`, background: 'var(--st-planned)', borderRadius: 0 }} /><span style={{ width: `${done * 9}%`, background: 'var(--st-done)', borderRadius: 0 }} /></div><span className="xs faint">{open} open · {done} done</span></div>; })}</div></div>
      <div className="card span-6"><h3>Today&apos;s field activity</h3><div className="stack-sm" style={{ marginTop: 12 }}>
        {repo.inspections().filter((i) => !i.completedAt).map((i) => <div key={i.id} className="row gap-12"><span className="status" style={{ '--c': 'var(--st-inspection)' } as React.CSSProperties}><Icon name="clipboard" size={14} />Inspection</span><span className="small grow ellipsis">{i.report.street} — {INSPECTORS.find((p) => p.id === i.inspector)?.name}</span><span className="xs faint">{i.window}</span></div>)}
        {repo.listWorkOrders().filter((w) => w.status === 'in_progress').map((w) => <div key={w.id} className="row gap-12"><span className="status" style={{ '--c': 'var(--st-active)' } as React.CSSProperties}><Icon name="hammer" size={14} />Work</span><span className="small grow ellipsis">{w.id} — {repo.getContractor(w.contractor).name}</span><span className="xs faint">{w.progress}%</span></div>)}
      </div></div>
      <div className="card span-12"><div className="row between"><h3>Recent activity</h3><Link className="link" href="/gov/audit">Audit log</Link></div>
        <ol className="activity">{activity.map((a, i) => (
          <li key={a.r.ref + a.at + i}><span className="dot" style={{ '--c': statusColor(a.status) } as React.CSSProperties} />
            <Link className="grow" href={`/gov/reports/${a.r.ref}`}><b className="small">{a.title}</b> <span className="small muted">· {a.r.title}</span><div className="xs faint">{a.actor} · {a.r.ref}</div></Link>
            <span className="xs faint">{timeAgo(a.at)}</span></li>))}</ol></div>
    </div>
  </>;
}
