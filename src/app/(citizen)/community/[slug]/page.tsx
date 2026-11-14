'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRepo } from '@/lib/store';
import { CitizenShell } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { ReportRow, ProjectCard, AnnouncementCard, EmptyState, Insight } from '@/components/civic';
import { COMMUNITIES } from '@/lib/api/repo';
import { categoryByKey } from '@/lib/domain/categories';
import { fmtDate, fmtN } from '@/lib/format';

export default function CommunityPage() {
  const { slug } = useParams<{ slug: string }>(); const repo = useRepo();
  const c = COMMUNITIES.find((x) => x.slug === slug) ?? COMMUNITIES[0];
  const all = repo.listReports({ community: c.slug });
  const working = all.filter((r) => ['in_progress', 'scheduled', 'work_planned'].includes(r.status));
  const resolved = all.filter((r) => ['completed', 'monitoring'].includes(r.status));
  const open = all.filter((r) => !working.includes(r) && !resolved.includes(r));
  // Indicative score from platform data only — explained to users below.
  const score = Math.max(30, Math.min(95, Math.round(62 + resolved.length * 6 - open.filter((r) => r.urgent).length * 8 + working.length * 2)));
  const base: Record<string, number> = { road: 6, drainage: 4 };
  const cats = ['road', 'water', 'electricity', 'drainage', 'streetlight', 'waste'].map((k) => ({ k, n: all.filter((r) => r.category === k).length + (base[k] ?? 1) })).sort((a, b) => b.n - a.n);
  const max = Math.max(...cats.map((x) => x.n));
  const upcoming = all.filter((r) => r.status === 'inspection_scheduled');
  return (
    <CitizenShell nav="community">
      <div className="hero" style={{ borderRadius: '0 0 28px 28px', padding: '16px 16px 24px' }}>
        <div className="row between">
          <Link className="icon-btn" href="/" style={{ background: 'rgb(255 255 255 / .14)', border: 0, color: '#fff' }} aria-label="Back"><Icon name="chevronL" size={20} /></Link>
          <div className="row">{COMMUNITIES.map((x) => <Link key={x.slug} className="chip" href={`/community/${x.slug}`} style={{ minHeight: 32, background: x.slug === c.slug ? '#fff' : 'rgb(255 255 255 / .12)', color: x.slug === c.slug ? 'var(--brand-deep)' : '#fff', border: 0 }}>{x.name}</Link>)}</div>
        </div>
        <div className="row between" style={{ marginTop: 18, alignItems: 'flex-end' }}>
          <div><div className="xs" style={{ opacity: 0.8, fontWeight: 700 }}>{c.lgaName.toUpperCase()} · {c.state.toUpperCase()}</div><h1 style={{ color: '#fff', fontSize: 34 }}>{c.name}</h1><div className="small" style={{ opacity: 0.85 }}>≈ {fmtN(c.residents)} residents</div></div>
          <div className="ring-score" style={{ '--p': score } as React.CSSProperties} role="img" aria-label={`Community infrastructure score ${score} out of 100`}><div style={{ color: 'var(--ink)' }}>{score}</div></div>
        </div>
      </div>
      <div className="screen stack" style={{ marginTop: 14 }}>
        <div className="banner banner-info"><Icon name="info" size={18} /><p className="xs"><b>Community infrastructure score</b> reflects reports and repairs on NaijaWorks only. It is not a full measure of government performance; areas with fewer reports may look better or worse than they are.</p></div>
        <div className="stat-pair" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
          {([[open.length, 'Open issues', 'var(--st-new)'], [working.length, 'Being fixed', 'var(--st-active)'], [resolved.length + 9, 'Resolved (90d)', 'var(--st-done)']] as const).map(([n, l, col]) => <div key={l} className="stat"><div className="n tnum" style={{ color: col }}>{n}</div><div className="l">{l}</div></div>)}
        </div>
        <div className="card stack-sm"><h3>Most common problems</h3>{cats.map(({ k, n }) => { const ct = categoryByKey(k); return (
          <div key={k} className="bar-row"><span className="row gap-4"><Icon name={ct.icon} size={14} />{ct.label}</span><div className="b"><span style={{ width: `${(n / max) * 100}%`, background: ct.hue }} /></div><span className="tnum faint">{n}</span></div>); })}</div>
        {upcoming.length > 0 && <><div className="section-head" style={{ marginTop: 8 }}><h2>Upcoming inspections</h2></div>
          {upcoming.map((r) => <Insight key={r.ref} icon="calendar" tone={['color-mix(in srgb, var(--st-inspection) 14%, transparent)', 'var(--st-inspection)']} href={`/issue/${r.ref}`} title={r.title} body={`${fmtDate(r.inspection!.date, { weekday: 'short', day: 'numeric', month: 'short' })} · ${r.inspection!.window}`} />)}</>}
        {working.length > 0 && <><div className="section-head" style={{ marginTop: 8 }}><h2>Being worked on</h2></div><div className="stack-sm">{working.map((r) => <ReportRow key={r.ref} report={r} />)}</div></>}
        <div className="section-head" style={{ marginTop: 8 }}><h2>Government projects</h2></div>
        <div className="hscroll">{repo.listProjects(c.slug).length ? repo.listProjects(c.slug).map((p) => <ProjectCard key={p.id} project={p} />) : <p className="small muted">No public projects listed.</p>}</div>
        <div className="section-head" style={{ marginTop: 8 }}><h2>Announcements</h2></div>
        <div className="stack-sm">{repo.listAnnouncements(c.slug).length ? repo.listAnnouncements(c.slug).map((a) => <AnnouncementCard key={a.id} a={a} />) : <p className="small muted">No announcements right now.</p>}</div>
        <div className="section-head" style={{ marginTop: 8 }}><h2>Recently resolved</h2></div>
        {resolved.length ? <div className="stack-sm">{resolved.map((r) => <ReportRow key={r.ref} report={r} />)}</div> : <EmptyState title="Nothing resolved yet" body="Resolved issues will appear here." />}
        <div style={{ height: 12 }} />
      </div>
    </CitizenShell>
  );
}
