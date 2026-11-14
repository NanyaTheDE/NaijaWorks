'use client';
import Link from 'next/link';
import { useRepo } from '@/lib/store';
import { PTop } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { CatIcon } from '@/components/civic';
import { isOverdue } from '@/components/gov/queues';
import { COMMUNITIES } from '@/lib/api/repo';
import { categoryByKey } from '@/lib/domain/categories';
import { fmtN } from '@/lib/format';

const DAY = 864e5;

// Per-community view for officers: where unresolved work and urgent issues are concentrated.
export default function CommunitiesPage() {
  const repo = useRepo();
  const R = repo.allReportsInternal().filter((r) => !r.mergedInto && !r.rejected);
  const rows = COMMUNITIES.map((c) => {
    const mine = R.filter((r) => r.community === c.slug);
    const resolved = mine.filter((r) => ['completed', 'monitoring'].includes(r.status));
    const open = mine.filter((r) => !resolved.includes(r) && r.status !== 'unable');
    const ages = open.map((r) => (Date.now() - new Date(r.createdAt).getTime()) / DAY);
    const topCat = Object.entries(mine.reduce<Record<string, number>>((a, r) => ({ ...a, [r.category]: (a[r.category] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1])[0]?.[0];
    return {
      c, total: mine.length, open: open.length, resolved: resolved.length,
      urgent: open.filter((r) => r.urgent).length, overdue: open.filter(isOverdue).length,
      inWork: open.filter((r) => ['work_planned', 'scheduled', 'in_progress'].includes(r.status)).length,
      avgAge: ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0,
      people: mine.reduce((a, r) => a + (r.peopleImpacted || 0), 0), topCat,
      projects: repo.listProjects(c.slug).length,
    };
  }).sort((a, b) => b.urgent - a.urgent || b.open - a.open);

  return <>
    <PTop title="Communities" sub="Where unresolved work is concentrated. Sorted by urgent issues, then open issues." />
    <div className="banner banner-sun" style={{ marginBottom: 16 }}><Icon name="info" size={18} /><p className="small">These figures only count reports made on NaijaWorks. Areas where fewer people use the platform will look quieter than they are, so use them to plan work, not to rank communities.</p></div>
    <div className="table-wrap"><table className="table">
      <thead><tr><th>Community</th><th>Open</th><th>Urgent</th><th>Overdue</th><th>Being fixed</th><th>Resolved</th><th>Avg. age</th><th>Most reported</th><th>Affected</th><th /></tr></thead>
      <tbody>{rows.map((x) => (
        <tr key={x.c.slug}>
          <td><b>{x.c.name}</b><div className="xs faint" style={{ whiteSpace: 'nowrap' }}>{x.c.lgaName} · ≈ {fmtN(x.c.residents)}</div></td>
          <td className="tnum">{x.open}</td>
          <td className="tnum" style={x.urgent ? { color: 'var(--clay)', fontWeight: 700 } : undefined}>{x.urgent}</td>
          <td className="tnum" style={x.overdue ? { color: 'var(--st-planned)', fontWeight: 700 } : undefined}>{x.overdue}</td>
          <td className="tnum">{x.inWork}</td>
          <td className="tnum">{x.resolved}</td>
          <td className="tnum">{x.open ? `${x.avgAge} days` : '—'}</td>
          <td>{x.topCat ? <span className="row gap-4 small"><CatIcon category={x.topCat} size={22} />{categoryByKey(x.topCat).label}</span> : '—'}</td>
          <td className="tnum">{fmtN(x.people)}</td>
          <td><Link className="btn btn-ghost btn-sm" href={`/community/${x.c.slug}`} aria-label={`${x.c.name} public page`}><Icon name="eye" size={15} />View</Link></td>
        </tr>))}</tbody>
    </table></div>

    <div className="pgrid">{rows.map((x) => (
      <div key={x.c.slug} className="card span-4 stack-sm">
        <div className="row between"><h3>{x.c.name}</h3><span className="xs faint">{x.total} reports · {x.projects} project{x.projects === 1 ? '' : 's'}</span></div>
        <div className="mini-progress" style={{ height: 10 }} role="img" aria-label={`${x.resolved} resolved, ${x.inWork} being fixed, ${x.open - x.inWork} waiting`}>
          <span className="on" style={{ flex: x.resolved || 0.001, background: 'var(--st-done)' }} />
          <span className="on" style={{ flex: x.inWork || 0.001, background: 'var(--st-active)' }} />
          <span style={{ flex: (x.open - x.inWork) || 0.001, background: 'var(--st-planned)' }} />
        </div>
        <div className="row xs muted wrap" style={{ gap: 12 }}>
          <span><i style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 4, background: 'var(--st-done)', marginRight: 5 }} />{x.resolved} resolved</span>
          <span><i style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 4, background: 'var(--st-active)', marginRight: 5 }} />{x.inWork} being fixed</span>
          <span><i style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 4, background: 'var(--st-planned)', marginRight: 5 }} />{x.open - x.inWork} waiting</span>
        </div>
      </div>))}</div>
  </>;
}
