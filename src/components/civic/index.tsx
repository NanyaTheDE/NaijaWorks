'use client';
// Reusable civic components (design system "Ọ̀nà"). See docs/04-design-system.md.
import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Scene } from '@/components/ui/Scene';
import { STATUS, GROUPS, JOURNEY, journeyIndex, SEVERITY } from '@/lib/domain/statuses';
import { categoryByKey } from '@/lib/domain/categories';
import { AGENCIES } from '@/lib/domain/routing';
import { COMMUNITIES } from '@/lib/api/repo';
import { fmtDate, timeAgo, cx } from '@/lib/format';
import type { Report, StatusKey, Severity, Evidence, TimelineEntry, Delay, Project, Announcement } from '@/lib/domain/types';

export const statusColor = (s: StatusKey) => GROUPS[STATUS[s]?.group ?? 'new'].color;
export const communityName = (slug: string) => COMMUNITIES.find((c) => c.slug === slug)?.name ?? slug;
export const photoFor = (r: Report, phase: Evidence['phase'] = 'before'): Evidence =>
  r.photos.find((p) => p.phase === phase) ?? r.photos[0] ?? { phase: 'before', scene: categoryByKey(r.category).key };

export function Media({ photo, label }: { photo?: Evidence; label?: string }) {
  if (photo?.src) return <img src={photo.src} alt={label ?? 'Evidence photo'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />;
  return <Scene name={photo?.scene ?? 'road'} label={label} />;
}

export function StatusBadge({ status, size }: { status: StatusKey; size?: 'lg' }) {
  return <span className={cx('status', size && 'status-lg')} style={{ '--c': statusColor(status) } as React.CSSProperties}><Icon name={STATUS[status].icon} size={14} />{STATUS[status].label}</span>;
}
export function SeverityBadge({ severity }: { severity?: Severity }) {
  return severity ? <span className={`sev sev-${severity}`}>{SEVERITY[severity].label}</span> : null;
}
export function CatIcon({ category, size = 26 }: { category: string; size?: number }) {
  const c = categoryByKey(category);
  return <span className="cat-ic" style={{ background: c.hue, width: size, height: size }}><Icon name={c.icon} size={size * 0.58} /></span>;
}
export function AuthorityLogo({ agency }: { agency: string }) {
  return <span className="logo">{(AGENCIES[agency]?.short ?? '?').slice(0, 4)}</span>;
}
export function InlineIcon({ name, size = 13 }: { name: string; size?: number }) {
  return <span style={{ display: 'inline-block', verticalAlign: -2, marginRight: 4 }}><Icon name={name} size={size} /></span>;
}

export function MiniProgress({ status }: { status: StatusKey }) {
  const i = Math.max(0, journeyIndex(status));
  return <div className="mini-progress" style={{ '--c': statusColor(status) } as React.CSSProperties} aria-label={`Step ${i + 1} of ${JOURNEY.length}`}>{JOURNEY.map((_, k) => <span key={k} className={k <= i ? 'on' : ''} />)}</div>;
}
export function ProgressBar({ pct, height = 6 }: { pct: number; height?: number }) {
  return <div className="mini-progress" style={{ height }}><span className="on" style={{ flex: pct }} /><span style={{ flex: 100 - pct }} /></div>;
}

export function ReportRow({ report: r, href }: { report: Report; href?: string }) {
  const last = r.timeline.at(-1)!;
  return (
    <Link className="card card-flush card-hover rcard" href={href ?? `/issue/${r.ref}`}>
      <div className="thumb"><Media photo={photoFor(r)} /><CatIcon category={r.category} /></div>
      <div className="grow col gap-4">
        <div className="row between"><StatusBadge status={r.status} /><span className="xs faint">{timeAgo(last.at)}</span></div>
        <h3>{r.title}</h3>
        <div className="xs muted row gap-4"><Icon name="pin" size={13} /><span className="ellipsis">{r.street}, {communityName(r.community)}</span></div>
        <div className="xs muted ellipsis"><InlineIcon name="clock" size={12} />{last.title}</div>
        <MiniProgress status={r.status} />
      </div>
    </Link>
  );
}

export function FeedCard({ report: r }: { report: Report }) {
  const c = categoryByKey(r.category); const done = ['completed', 'monitoring'].includes(r.status);
  return (
    <Link className="card card-flush card-hover feedcard" href={`/issue/${r.ref}`}>
      <div className="media"><Media photo={photoFor(r, done ? 'after' : 'before')} /><StatusBadge status={r.status} /></div>
      <div style={{ padding: '12px 14px 14px' }} className="stack-sm">
        <div className="row xs muted" style={{ fontWeight: 600 }}><Icon name={c.icon} size={14} />{c.label} · {r.street}</div>
        <h3 className="ellipsis">{r.title}</h3>
        <div className="row between xs muted"><span><InlineIcon name="users" />{r.affected} affected</span><span>{timeAgo(r.timeline.at(-1)!.at)}</span></div>
      </div>
    </Link>
  );
}

/** Delivery-tracking style status summary (Talabat / Keeta / Walmart pattern — docs/05-mobbin-research.md). */
const STOPS: [string, string, number][] = [['Reported', 'flag', 0], ['Verified', 'check', 1], ['Inspected', 'clipboard', 4], ['Repair', 'hammer', 8], ['Fixed', 'sparkle', 8]];
export function StatusHero({ report: r }: { report: Report }) {
  const idx = journeyIndex(r.status); const st = STATUS[r.status];
  const done = ['completed', 'monitoring'].includes(r.status);
  const day = (iso: string, wd = false) => fmtDate(iso, wd ? { weekday: 'short', day: 'numeric', month: 'short' } : { day: 'numeric', month: 'short' });
  let kicker = 'NEXT STEP', head = st.next;
  if (done) { kicker = r.status === 'monitoring' ? 'FIXED · CONFIRMED BY RESIDENTS' : 'FIXED'; head = `Fixed ${day(r.completion?.at ?? r.timeline.at(-1)!.at)}`; }
  else if (r.status === 'inspection_scheduled' && r.inspection) { kicker = 'INSPECTION'; head = day(r.inspection.date, true); }
  else if (r.eta) { kicker = r.status === 'in_progress' ? 'REPAIR EXPECTED BY' : 'WORK DUE BY'; head = day(r.eta, true); }
  else if (r.status === 'reopened') { kicker = 'BACK UNDER REVIEW'; head = 'Re-inspection next'; }
  const pill = done ? ['Fixed', 'var(--st-done)'] : r.delay ? ['Delayed', 'var(--st-planned)'] : r.urgent ? ['Urgent', 'var(--clay)'] : ['On track', 'var(--st-done)'];
  const cur = done ? STOPS.length : STOPS.findIndex(([, , at]) => idx < at);
  const sentence = done ? 'The team shared completion photos. Tell us if it’s really fixed.'
    : r.status === 'in_progress' ? `${(r.progress ?? 0) >= 75 ? 'Nearly done' : (r.progress ?? 0) >= 50 ? 'About halfway' : 'Work has started'} · ${st.who} on site.`
    : `${st.meaning} ${st.who === 'NaijaWorks' ? '' : `Who acts: ${st.who}.`}`;
  return (
    <section className="track-hero" aria-label="Current status">
      <div className="row between"><span className="xs faint" style={{ fontWeight: 700, letterSpacing: '.05em' }}>{kicker}</span><span className="pill" style={{ '--c': pill[1] } as React.CSSProperties}>{pill[0]}</span></div>
      <div className={cx('big', head.length > 20 && 'big-sm')}>{head}</div>
      <div className="stops" role="list">
        {STOPS.map(([label, ic], k) => (
          <span key={label} style={{ display: 'contents' }}>
            {k > 0 && <span className={cx('ln', k < cur && 'done', k === cur && 'half')} />}
            <span role="listitem" aria-label={`${label}${k < cur ? ', done' : k === cur ? ', in progress' : ''}`} className={cx('stop', k < cur && 'done', k === cur && 'now')}><Icon name={k < cur ? 'check' : ic} size={15} /></span>
          </span>
        ))}
      </div>
      <div className="stop-labels">{STOPS.map(([label], k) => <span key={label} className={k === cur ? 'on' : ''}>{label}</span>)}</div>
      <p className="small" style={{ marginTop: 12 }}><StatusBadge status={r.status} /> <span className="muted">{sentence}</span></p>
      {r.delay && !done && <DelayBox delay={r.delay} />}
    </section>
  );
}
export function DelayBox({ delay }: { delay: Delay }) {
  return <div className="delay-box"><b>Rescheduled:</b> {delay.reason}<div className="row between" style={{ marginTop: 6 }}><span>Original date</span><s>{fmtDate(delay.original)}</s></div><div className="row between"><span>New date</span><b>{fmtDate(delay.updated)}</b></div></div>;
}

export function ProgressTracker({ report: r }: { report: Report }) {
  const idx = journeyIndex(r.status);
  const at = (s: StatusKey) => [...r.timeline].reverse().find((t) => t.status === s)?.at;
  const steps: StatusKey[] = ['reported', 'verified', 'assigned', 'inspection_scheduled', 'inspected', 'work_planned', 'scheduled', 'in_progress', 'completed'];
  return (
    <ol className="vtrack">{steps.map((s) => {
      const k = JOURNEY.indexOf(s);
      const state = k < idx || (k === idx && ['completed', 'monitoring'].includes(r.status)) ? 'done' : k === idx ? 'now' : 'todo';
      const label = s === 'work_planned' ? 'Repair approved' : s === 'scheduled' ? 'Repair scheduled' : STATUS[s].label; const when = at(s);
      return (
        <li key={s} className={state}>
          <span className="node">{state === 'done' ? <Icon name="check" size={14} /> : state === 'now' ? <Icon name={STATUS[s].icon} size={14} /> : null}</span>
          <div><div className="t">{label}</div>{state === 'now' && <div className="xs muted">{STATUS[s].meaning}</div>}</div>
          <div className="xs faint tnum" style={{ paddingTop: 4 }}>{when ? fmtDate(when) : state === 'now' ? 'Now' : ''}</div>
        </li>
      );
    })}</ol>
  );
}

/** Parcel-tracking timeline, newest first. */
export function Timeline({ items, delay }: { items: TimelineEntry[]; delay?: Delay }) {
  return (
    <ol className="timeline">{[...items].reverse().map((t, i) => {
      const d = new Date(t.at); const isDelay = t.title.toLowerCase().startsWith('delay');
      return (
        <li key={t.at + i} className={i === 0 ? 'latest' : ''}>
          <div className="date"><b>{d.getDate()}</b>{d.toLocaleDateString('en-NG', { month: 'short' })}</div>
          <span className="dot" style={{ '--c': isDelay ? 'var(--sun)' : statusColor(t.status) } as React.CSSProperties} />
          <div>
            <div className="title">{t.title}</div>
            {t.body && <p className="small muted" style={{ marginTop: 2 }}>{t.body}</p>}
            {isDelay && delay && <div className="delay-box"><div className="row between"><span>Original date</span><s>{fmtDate(delay.original)}</s></div><div className="row between"><span>Updated date</span><b>{fmtDate(delay.updated)}</b></div></div>}
            <div className="actor"><Icon name="building" size={12} />{t.actor} · {d.toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' })}</div>
          </div>
        </li>
      );
    })}</ol>
  );
}

export function BeforeAfter({ before, after }: { before?: string; after?: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="ba" style={{ '--pos': `${pos}%` } as React.CSSProperties}>
      <div className="layer"><Scene name={before ?? 'road'} label="Before" /></div>
      <div className="layer after"><Scene name={after ?? 'road-fixed'} label="After" /></div>
      <span className="lbl" style={{ left: 10 }}>Before</span><span className="lbl" style={{ right: 10 }}>After</span>
      <div className="handle" />
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(+e.target.value)} aria-label="Compare before and after" />
    </div>
  );
}

// ---------- Map ----------
// Stylised offline base map. Positions are % of the box. A real MapView adapter (Leaflet/Mapbox) would replace MapBase.
const MAP_BASE = `<rect width="100" height="100" fill="currentColor" opacity="0"/>
  <path d="M78 0 C70 20 88 40 80 62 C74 78 90 90 86 100 L100 100 L100 0Z" fill="#A8D3E6" opacity=".85"/>
  <path d="M0 88 C20 84 40 92 60 88 C70 86 78 92 86 100 L0 100Z" fill="#A8D3E6" opacity=".85"/>
  <g fill="#CFE5C3" opacity=".9"><rect x="20" y="30" width="9" height="7" rx="1.5"/><rect x="58" y="62" width="7" height="9" rx="1.5"/><rect x="8" y="64" width="10" height="6" rx="1.5"/></g>
  <g stroke="#fff" stroke-linecap="round" fill="none"><path d="M-2 40 C30 44 60 30 102 36" stroke-width="2.6"/><path d="M40 -2 C42 30 52 60 46 102" stroke-width="2.6"/><path d="M-2 72 C30 70 60 76 80 70" stroke-width="2"/>
  <path d="M14 -2 C18 40 10 70 18 102" stroke-width="1.6"/><path d="M62 -2 C64 30 70 60 64 90" stroke-width="2"/><path d="M-2 18 L80 12" stroke-width="1.6"/><path d="M-2 56 L76 52" stroke-width="1.3"/><path d="M24 30 L30 90" stroke-width="1"/><path d="M52 10 L56 80" stroke-width="1"/></g>
  <g stroke="#F3D58A" stroke-width=".9" fill="none"><path d="M-2 40 C30 44 60 30 102 36"/><path d="M40 -2 C42 30 52 60 46 102"/></g>`;
export function MapBase() { return <svg className="base" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" dangerouslySetInnerHTML={{ __html: MAP_BASE }} />; }
export function MapPin({ report: r, selected, onSelect }: { report: Report; selected?: boolean; onSelect?: (ref: string) => void }) {
  const urgent = r.urgent && !['completed', 'monitoring'].includes(r.status);
  return (
    <button className={cx('pin', selected && 'sel', urgent && 'urgent')} style={{ left: `${r.pos.x}%`, top: `${r.pos.y}%`, '--c': GROUPS[STATUS[r.status].group].color } as React.CSSProperties}
      onClick={(e) => { e.stopPropagation(); onSelect?.(r.ref); }} aria-label={`${r.title}, ${STATUS[r.status].label}`} tabIndex={onSelect ? 0 : -1}>
      <span className="head"><Icon name={categoryByKey(r.category).icon} size={15} /></span>
    </button>
  );
}
export function MapLegend() {
  return <div className="map-legend">{(['new', 'confirmed', 'inspection', 'planned', 'active', 'done'] as const).map((g) => <span key={g}><i style={{ background: GROUPS[g].color }} />{GROUPS[g].label}</span>)}</div>;
}

// ---------- Misc ----------
export function EmptyState({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <svg className="art" viewBox="0 0 120 100" aria-hidden="true"><circle cx="60" cy="54" r="40" fill="var(--brand-soft)" /><path d="M30 74 Q60 56 90 74" stroke="var(--brand)" strokeWidth="3" fill="none" strokeLinecap="round" /><circle cx="60" cy="40" r="12" fill="var(--sun)" /><path d="M60 20v-8M40 40h-8M88 40h-8M46 26l-5-5M74 26l5-5" stroke="var(--sun)" strokeWidth="3" strokeLinecap="round" /></svg>
      <h3>{title}</h3><p className="small muted" style={{ maxWidth: 280 }}>{body}</p>{children}
    </div>
  );
}
export function ProjectCard({ project: p }: { project: Project }) {
  const pct = Math.round((p.stage / (p.milestones.length - 1)) * 100);
  return (
    <Link className="card card-hover stack-sm" href={`/projects/${p.id}`} style={{ width: 280 }}>
      <div className="row between"><span className="tag"><Icon name="crane" size={13} />Project</span>{p.stalled ? <span className="sev sev-serious">Behind schedule</span> : <span className="xs faint">{pct}%</span>}</div>
      <h3>{p.name}</h3>
      <p className="xs muted">{p.milestones[p.stage]} · {AGENCIES[p.agency].short}</p>
      <div className="mini-progress">{p.milestones.map((_, i) => <span key={i} className={i <= p.stage ? 'on' : ''} />)}</div>
    </Link>
  );
}
export function AnnouncementCard({ a }: { a: Announcement }) {
  return (
    <div className="insight"><span className="ii" style={{ background: 'var(--sun-soft)', color: '#8A6400' }}><Icon name="megaphone" size={19} /></span>
      <div className="grow"><div className="xs faint" style={{ fontWeight: 650 }}>{a.kind} · {AGENCIES[a.agency].short}</div><div style={{ fontWeight: 650, margin: '2px 0' }}>{a.title}</div><p className="small muted">{a.body}</p></div></div>
  );
}
export function Insight({ icon, tone, title, body, href }: { icon: string; tone: [string, string]; title: ReactNode; body?: ReactNode; href?: string }) {
  const inner = <><span className="ii" style={{ background: tone[0], color: tone[1] }}><Icon name={icon} size={19} /></span><div className="grow"><b>{title}</b>{body && <p className="small muted">{body}</p>}</div>{href && <Icon name="chevronR" size={18} className="faint" />}</>;
  return href ? <Link className="insight card-hover" href={href}>{inner}</Link> : <div className="insight">{inner}</div>;
}
export function Logo({ size = 32 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="12" fill="#F5B301" /><path d="M11 29V12l18 17V12" stroke="#063D27" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>;
}
export function Toggle({ on, label, sub, onToggle }: { on: boolean; label: string; sub: string; onToggle: () => void }) {
  return (
    <button className="radio-card" role="switch" aria-checked={on} onClick={onToggle} style={{ borderWidth: 1 }}>
      <div className="grow"><b>{label}</b><div className="xs muted">{sub}</div></div>
      <span style={{ width: 46, height: 28, borderRadius: 99, background: on ? 'var(--brand)' : 'var(--surface-3)', position: 'relative', transition: '.2s', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 22, height: 22, borderRadius: '50%', background: '#fff', boxShadow: 'var(--shadow)', transition: '.2s' }} /></span>
    </button>
  );
}
