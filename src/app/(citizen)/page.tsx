'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRepo, useUi } from '@/lib/store';
import { useT, LOCALES } from '@/lib/i18n';
import { CitizenShell } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { ReportRow, FeedCard, BeforeAfter, ProjectCard, AnnouncementCard, Insight, EmptyState, StatusBadge, Logo, photoFor } from '@/components/civic';
import { COMMUNITIES } from '@/lib/api/repo';
import { STATUS, GROUPS } from '@/lib/domain/statuses';
import { categoryByKey } from '@/lib/domain/categories';
import { fmtN, timeAgo } from '@/lib/format';
import type { StatusGroup } from '@/lib/domain/types';

const OPEN = ['reported', 'under_review', 'verified', 'assigned', 'reopened', 'inspection_scheduled'];

export default function HomePage() {
  const repo = useRepo();
  return repo.state.prefs.onboarded ? <Home /> : <Onboarding />;
}

function Onboarding() {
  const repo = useRepo(); const p = repo.state.prefs;
  return (
    <CitizenShell hideNav>
      <div className="screen stack-lg" style={{ paddingTop: 28 }}>
        <div className="hero" style={{ padding: '28px 22px 26px' }}>
          <div className="row" style={{ gap: 10 }}><Logo size={36} /><b style={{ font: '750 20px var(--display)' }}>NaijaWorks</b></div>
          <h1 style={{ fontSize: 32, marginTop: 40, color: '#fff' }}>See it. Report it.<br />Watch it get fixed.</h1>
          <p style={{ marginTop: 10, opacity: 0.9 }}>Report bad roads, broken streetlights, blocked drains and more. We find who is responsible and show you every step until it is fixed.</p>
        </div>
        <div className="stack-sm">
          {[['flag', 'Report in 2 minutes', 'Snap a photo, drop a pin, done. No forms.'], ['building', 'We find who handles it', 'Local, state, federal or utility — you don’t need to know.'], ['eye', 'Track every step', 'Like tracking a parcel: inspection, repair, completion.']].map(([i, h, b]) => (
            <Insight key={h} icon={i} tone={['var(--brand-soft)', 'var(--brand)']} title={h} body={b} />
          ))}
        </div>
        <div className="field"><span className="label">Language</span>
          <div className="seg" role="tablist">{LOCALES.map((l) => <button key={l.key} role="tab" aria-selected={p.locale === l.key} onClick={() => repo.setPref('locale', l.key)}>{l.label}</button>)}</div></div>
        <div className="field"><label htmlFor="ob-comm">Your community</label>
          <select id="ob-comm" className="select" value={p.community} onChange={(e) => repo.setPref('community', e.target.value)}>{COMMUNITIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}, {c.state}</option>)}</select></div>
        <button className="btn btn-primary btn-lg btn-block" onClick={() => repo.setPref('onboarded', true)}>Get started <Icon name="arrowR" size={18} /></button>
        <p className="xs faint" style={{ textAlign: 'center', paddingBottom: 12 }}>Your phone number and address are never shown publicly.</p>
      </div>
    </CitizenShell>
  );
}

function Home() {
  const repo = useRepo(); const t = useT(); const ui = useUi(); const router = useRouter();
  const p = repo.state.prefs; const comm = COMMUNITIES.find((c) => c.slug === p.community)!;
  const all = repo.listReports({ community: p.community });
  const by = (g: StatusGroup) => all.filter((r) => STATUS[r.status].group === g);
  const fixed = all.filter((r) => ['completed', 'monitoring'].includes(r.status));
  const working = all.filter((r) => ['in_progress', 'scheduled', 'work_planned'].includes(r.status));
  const awaitingInsp = all.filter((r) => ['inspection_scheduled', 'assigned', 'verified'].includes(r.status));
  const mine = repo.myReports(); const myImpact = mine.reduce((a, r) => a + (r.peopleImpacted || 0), 0);
  const h = new Date().getHours(); const greet = t(h < 12 ? 'home.greet.morning' : h < 17 ? 'home.greet.afternoon' : 'home.greet.evening');
  const lanes: [StatusGroup, string, string][] = [['new', 'flag', 'Needs attention'], ['inspection', 'clipboard', 'Being inspected'], ['planned', 'calendar', 'Work scheduled'], ['active', 'hammer', 'Work in progress'], ['done', 'sparkle', 'Recently fixed']];
  const inProg = working.find((r) => r.status === 'in_progress');
  const tone = (c: string): [string, string] => [`color-mix(in srgb, ${c} 14%, transparent)`, c];

  const pickCommunity = () => ui.openModal(
    <><h2>Choose your area</h2><div className="stack-sm" style={{ marginTop: 14 }}>{COMMUNITIES.map((c) => (
      <button key={c.slug} className="radio-card" role="radio" aria-checked={p.community === c.slug} onClick={() => { repo.setPref('community', c.slug); ui.closeModal(); }}>
        <span className="ring" /><div><b>{c.name}</b><div className="xs muted">{c.lgaName}, {c.state}</div></div></button>))}</div></>,
  );

  return (
    <CitizenShell nav="home">
      <h1 className="sr-only">NaijaWorks home</h1>
      <header className="topbar" style={{ paddingTop: 18 }}>
        <div className="grow"><div className="small muted">{greet}, {repo.state.user.name} 👋</div>
          <button className="row" onClick={pickCommunity} style={{ border: 0, background: 'none', padding: 0, gap: 4 }}><b style={{ font: '750 20px var(--display)' }}>{comm.name}</b><span className="muted">{comm.state}</span><Icon name="chevronD" size={16} /></button></div>
        <Link className="icon-btn" href="/notifications" aria-label="Notifications"><Icon name="bell" size={20} />{repo.unreadCount() > 0 && <span className="badge-dot" />}</Link>
        <Link className="icon-btn" href="/profile" aria-label="Profile" style={{ background: 'var(--brand-soft)', color: 'var(--brand)', fontWeight: 750 }}>{repo.state.user.name[0]}</Link>
      </header>
      <div className="screen">
        <form className="search" onSubmit={(e) => { e.preventDefault(); router.push('/explore?q=' + encodeURIComponent(String(new FormData(e.currentTarget).get('q') ?? ''))); }}>
          <label className="sr-only" htmlFor="hs">Search</label><Icon name="search" size={18} /><input id="hs" name="q" className="input" placeholder={t('home.search')} />
        </form>

        <section className="hero" style={{ marginTop: 14 }}>
          <h2 style={{ fontSize: 22, color: '#fff', maxWidth: 250 }}>{t('home.hero.title')}</h2>
          <p className="small" style={{ opacity: 0.88, margin: '8px 0 16px', maxWidth: 290 }}>{t('home.hero.body')}</p>
          <Link className="btn btn-primary btn-lg" href="/report"><Icon name="camera" size={20} />{t('home.cta')}</Link>
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: 'absolute', right: -14, bottom: -12, opacity: 0.95 }} aria-hidden="true"><circle cx="70" cy="70" r="46" fill="#F5B301" opacity=".18" /><path d="M50 98V58l20-16 20 16v40" fill="#F5B301" opacity=".9" /><rect x="62" y="74" width="16" height="24" rx="2" fill="#063D27" /><path d="M34 98h76" stroke="#fff" strokeWidth="3" strokeLinecap="round" /><circle cx="96" cy="36" r="6" fill="#fff" /></svg>
        </section>

        <div className="hscroll" style={{ marginTop: 16 }}>{lanes.map(([g, ic, label]) => (
          <Link key={g} className="lane card-hover" href={`/explore?group=${g}`}>
            <span className="chip-ic" style={{ background: tone(GROUPS[g].color)[0], color: GROUPS[g].color }}><Icon name={ic} size={18} /></span>
            <span className="num tnum">{by(g).length}</span><span className="xs muted" style={{ fontWeight: 600 }}>{label}</span></Link>))}</div>

        <div className="stack-sm" style={{ marginTop: 16 }}>
          <Insight icon="sparkle" tone={['var(--brand-soft)', 'var(--brand)']} title={`${fixed.length + 10} issues were resolved around ${comm.name} this month.`} body="Up from 7 last month." />
          {inProg && <Insight icon="hammer" tone={tone('var(--st-active)')} href={`/issue/${inProg.ref}`} title={`${categoryByKey(inProg.category).label} repairs are underway on ${inProg.street}.`} body={inProg.timeline.at(-1)!.body} />}
          {awaitingInsp.length > 0 && <Insight icon="clipboard" tone={tone('var(--st-inspection)')} title={`${awaitingInsp.length} problems near you are awaiting inspection.`} body="Follow them to get updates." />}
          {myImpact > 0 && <Insight icon="heart" tone={['var(--sun-soft)', '#8A6400']} href="/my-reports" title={`Your reports helped ${fmtN(myImpact)} residents.`} body={`${mine.filter((r) => ['completed', 'monitoring'].includes(r.status)).length} of your reports are now resolved.`} />}
        </div>

        <div className="section-head"><h2>{t('home.near')}</h2><Link className="link" href="/explore">See map</Link></div>
        {all.length ? <div className="stack-sm">{all.filter((r) => OPEN.includes(r.status)).slice(0, 3).map((r) => <ReportRow key={r.ref} report={r} />)}</div>
          : <EmptyState title="Looks quiet around here" body="If you notice something that needs attention, you can report it in a few taps."><Link className="btn btn-primary" href="/report">{t('home.cta')}</Link></EmptyState>}

        {working.length > 0 && <><div className="section-head"><h2>{t('home.work')}</h2><Link className="link" href="/explore?group=active">All</Link></div>
          <div className="hscroll">{working.map((r) => <FeedCard key={r.ref} report={r} />)}</div></>}

        {fixed.length > 0 && <><div className="section-head"><h2>{t('home.fixed')}</h2><Link className="link" href="/impact">Impact</Link></div>
          <div className="card card-flush">
            <BeforeAfter before={photoFor(fixed[0], 'before').scene} after={photoFor(fixed[0], 'after').scene} />
            <Link href={`/issue/${fixed[0].ref}`} style={{ padding: '12px 14px' }} className="row between"><div><b>{fixed[0].title}</b><div className="xs muted">{fixed[0].street} · fixed {timeAgo(fixed[0].completion?.at ?? fixed[0].timeline.at(-1)!.at)}</div></div><StatusBadge status={fixed[0].status} /></Link>
          </div></>}

        <div className="section-head"><h2>Projects nearby</h2><Link className="link" href={`/community/${p.community}`}>All</Link></div>
        <div className="hscroll">{repo.listProjects().map((pr) => <ProjectCard key={pr.id} project={pr} />)}</div>

        <div className="section-head"><h2>{t('home.ann')}</h2></div>
        <div className="stack-sm">{repo.listAnnouncements(p.community).length ? repo.listAnnouncements(p.community).map((a) => <AnnouncementCard key={a.id} a={a} />) : <p className="small muted">No announcements for your area.</p>}</div>

        <div className="section-head"><h2>{t('home.tips')}</h2></div>
        <Link className="card card-hover row gap-12" href="/learn" style={{ background: 'var(--sun-soft)', borderColor: 'transparent' }}>
          <span style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--sun)', color: '#2A1E00', display: 'grid', placeItems: 'center' }}><Icon name="book" size={22} /></span>
          <div className="grow"><b>Who fixes what?</b><p className="small muted">Local streets, state roads, waste, water, electricity — a 1-minute guide.</p></div><Icon name="chevronR" size={18} /></Link>
        <div style={{ height: 24 }} />
      </div>
    </CitizenShell>
  );
}
