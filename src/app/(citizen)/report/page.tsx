'use client';
import { useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRepo, useUi } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { CitizenShell } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { Scene } from '@/components/ui/Scene';
import { Media, ReportRow, SeverityBadge, MapBase, AuthorityLogo } from '@/components/civic';
import { CATEGORIES, categoryByKey, URGENT_SUBTYPES } from '@/lib/domain/categories';
import { SEVERITY } from '@/lib/domain/statuses';
import { AGENCIES, LEVEL_EXPLAINER, routeReport, assignmentState } from '@/lib/domain/routing';
import { COMMUNITIES } from '@/lib/api/repo';
import type { ReportDraft, Severity, IdentityMode } from '@/lib/domain/types';

// Known streets for pin → address lookup (mock geocoder; a real one comes from the mapping API).
const STREETS = [
  { name: 'Adeola Street', c: 'surulere', x: 44, y: 61 }, { name: 'Bode Thomas Street', c: 'surulere', x: 50, y: 54 }, { name: 'Ogunlana Drive', c: 'surulere', x: 38, y: 66 },
  { name: 'Akerele Street', c: 'surulere', x: 54, y: 63 }, { name: 'Lawanson Road', c: 'surulere', x: 33, y: 55 }, { name: 'Masha Road', c: 'surulere', x: 57, y: 50 },
  { name: 'Iponri Market Road', c: 'surulere', x: 62, y: 70 }, { name: 'Aguda Road', c: 'surulere', x: 28, y: 48 }, { name: 'Funsho Williams Avenue', c: 'surulere', x: 46, y: 75 },
  { name: 'Herbert Macaulay Way', c: 'yaba', x: 66, y: 36 }, { name: 'Alagomeji Street', c: 'yaba', x: 70, y: 46 }, { name: 'Ikorodu Road', c: 'yaba', x: 56, y: 30 },
  { name: 'Allen Avenue', c: 'ikeja', x: 42, y: 22 }, { name: 'Opebi Road', c: 'ikeja', x: 48, y: 15 }, { name: 'Obafemi Awolowo Way', c: 'ikeja', x: 30, y: 12 },
];
const nearestStreet = (x: number, y: number) => STREETS.reduce((a, s) => (Math.hypot(s.x - x, s.y - y) < Math.hypot(a.x - x, a.y - y) ? s : a));

const compress = (file: File, max: number) => new Promise<string>((res) => {
  const img = new Image();
  img.onload = () => { const s = Math.min(1, max / Math.max(img.width, img.height)); const c = document.createElement('canvas'); c.width = img.width * s; c.height = img.height * s; c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', 0.7)); URL.revokeObjectURL(img.src); };
  img.src = URL.createObjectURL(file);
});

export default function ReportPage() {
  const repo = useRepo(); const ui = useUi(); const t = useT(); const router = useRouter();
  const [d, setD] = useState<ReportDraft>(() => repo.state.drafts ?? { category: null, subtype: null, photos: [], pos: null, street: '', landmark: '', community: repo.state.prefs.community, title: '', description: '', answers: {}, severity: null, identity: repo.state.prefs.identity });
  const [step, setStep] = useState(0);
  const [dupDismissed, setDupDismissed] = useState(false);
  const scroller = () => document.getElementById('scroller');
  const set = (patch: Partial<ReportDraft>) => setD((x) => ({ ...x, ...patch }));
  const titles = [t('report.step1'), t('report.step2'), t('report.step3'), t('report.step4'), t('report.step5')];
  const canNext = [!!d.category, true, !!d.street, !!d.severity && !!(d.title || d.description), true][step];
  const go = (n: number) => { setStep(n); scroller()?.scrollTo(0, 0); };

  const footer = (
    <div className="sticky-cta">{step < 4
      ? <button className="btn btn-primary btn-lg btn-block" onClick={() => go(step + 1)} disabled={!canNext}>{step === 1 && !d.photos.length ? t('report.skip') : t('report.continue')} <Icon name="arrowR" size={18} /></button>
      : <button className="btn btn-primary btn-lg btn-block" onClick={() => { const r = repo.createReport(d); router.push(`/report/success/${r.ref}`); }}><Icon name="check" size={20} />{t('report.submit')}</button>}</div>
  );

  return (
    <CitizenShell hideNav footer={footer}>
      <header className="topbar" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 12 }}>
        <div className="row">
          <button className="icon-btn" onClick={() => (step ? go(step - 1) : router.push('/'))} aria-label={step ? 'Previous step' : 'Close'}><Icon name={step ? 'chevronL' : 'x'} size={20} /></button>
          <div className="grow" style={{ textAlign: 'center' }}><div className="xs faint" style={{ fontWeight: 700 }}>STEP {step + 1} OF 5</div></div>
          <button className="btn btn-ghost btn-sm" onClick={() => { repo.saveDraft(d); ui.toast('Draft saved on this phone. It will send when you are back online.', 'wifi'); }}>Save draft</button>
        </div>
        <div className="steps">{titles.map((_, i) => <span key={i} className={i <= step ? 'on' : ''} />)}</div>
      </header>
      <div className="screen stack" style={{ paddingBottom: 100 }}>
        <h1 style={{ fontSize: 26, marginTop: 4 }}>{titles[step]}</h1>
        {step === 0 && <StepCategory d={d} set={set} />}
        {step === 1 && <StepEvidence d={d} set={set} />}
        {step === 2 && <StepLocation d={d} set={(p) => { set(p); if (p.street !== undefined || p.community !== undefined) setDupDismissed(false); }} dupDismissed={dupDismissed} onDismiss={() => setDupDismissed(true)} />}
        {step === 3 && <StepDetails d={d} set={set} />}
        {step === 4 && <StepReview d={d} set={set} />}
      </div>
    </CitizenShell>
  );
}
type StepProps = { d: ReportDraft; set: (p: Partial<ReportDraft>) => void };

function EmergencyBanner() {
  return (
    <div className="banner banner-urgent" role="alert"><Icon name="alert" size={22} /><div><b>If someone&apos;s life is in immediate danger, call 112 first.</b>
      <p className="small">You can still report it here. A government team will check how urgent it is.</p>
      <a className="btn btn-danger btn-sm" href="tel:112" style={{ marginTop: 8 }}><Icon name="phone" size={15} />Call 112</a></div></div>
  );
}

function StepCategory({ d, set }: StepProps) {
  const cat = d.category ? categoryByKey(d.category) : null;
  return <>
    <p className="muted">Pick the closest match. You don’t need to know who handles it.</p>
    <div className="cat-grid">{CATEGORIES.map((c) => (
      <button key={c.key} className="cat-tile" aria-pressed={d.category === c.key} onClick={() => set({ category: c.key, subtype: c.subtypes[0] })}>
        <span className="ci" style={{ background: `color-mix(in srgb, ${c.hue} 16%, transparent)`, color: c.hue }}><Icon name={c.icon} size={24} /></span>{c.label}</button>))}</div>
    {cat && <div className="card stack-sm"><span className="label">What kind of {cat.label.toLowerCase()} problem?</span>
      <div className="chips">{cat.subtypes.map((st) => <button key={st} className="chip" aria-pressed={d.subtype === st} onClick={() => set({ subtype: st, ...(URGENT_SUBTYPES.includes(st) ? { severity: 'urgent' as Severity } : {}) })}>{st}</button>)}</div></div>}
    {d.subtype && URGENT_SUBTYPES.includes(d.subtype) && <EmergencyBanner />}
    {d.category === 'abandoned' && <div className="banner banner-info"><Icon name="crane" size={20} /><p className="small">For stalled projects, tell us the project name if you know it, how long work has stopped, and how it affects your community.</p></div>}
  </>;
}

function StepEvidence({ d, set }: StepProps) {
  const repo = useRepo(); const ui = useUi(); const fileRef = useRef<HTMLInputElement>(null); const low = repo.state.prefs.lowData;
  const add = (p: ReportDraft['photos'][number]) => set({ photos: [...d.photos, p] });
  return <>
    <p className="muted">A clear photo helps the team understand the problem faster. It is optional.</p>
    <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden multiple onChange={async (e) => {
      const files = Array.from(e.target.files ?? []); const out = [];
      for (const f of files) out.push({ phase: 'before' as const, src: await compress(f, low ? 640 : 1024) });
      set({ photos: [...d.photos, ...out] });
    }} />
    <div className="up-grid">
      <button className="up-tile big" onClick={() => fileRef.current?.click()}><Icon name="camera" size={30} />Take a photo<span className="xs" style={{ fontWeight: 500, opacity: 0.8 }}>or choose from gallery</span></button>
      <button className="up-tile" onClick={() => add({ phase: 'before', scene: categoryByKey(d.category).key })}><Icon name="image" size={22} />Use sample photo</button>
      <button className="up-tile" onClick={() => { add({ phase: 'before', kind: 'video' }); ui.toast('Video attached (0:08)', 'video'); }}><Icon name="video" size={22} />Short video</button>
      <button className="up-tile" style={{ gridColumn: 'span 2', minHeight: 64, flexDirection: 'row' }} onClick={() => { add({ phase: 'before', kind: 'voice' }); ui.toast('Voice note recorded (0:12)', 'mic'); }}><Icon name="mic" size={20} />Record a voice note instead of typing</button>
    </div>
    {d.photos.length > 0 && <div className="stack-sm"><span className="label">{d.photos.length} attached</span><div className="thumbs">{d.photos.map((p, i) => (
      <div className="t" key={i}>{p.kind === 'voice' ? <div style={{ height: '100%', display: 'grid', placeItems: 'center', background: 'var(--brand-soft)', color: 'var(--brand)' }}><Icon name="mic" size={24} /></div>
        : p.kind === 'video' ? <div style={{ height: '100%', display: 'grid', placeItems: 'center', background: 'var(--ink)', color: '#fff' }}><Icon name="play" size={22} /></div> : <Media photo={p} />}
        <button onClick={() => set({ photos: d.photos.filter((_, k) => k !== i) })} aria-label="Remove"><Icon name="x" size={12} /></button></div>))}</div></div>}
    <div className="banner banner-sun"><Icon name="info" size={18} /><p className="small"><b>Tips:</b> stand back so we can see the surroundings, include a landmark, and don’t photograph people’s faces. {low && 'Low-data mode: photos are compressed to under 200 KB.'}</p></div>
  </>;
}

function StepLocation({ d, set, dupDismissed, onDismiss }: StepProps & { dupDismissed: boolean; onDismiss: () => void }) {
  const repo = useRepo(); const ui = useUi(); const router = useRouter();
  const comm = COMMUNITIES.find((c) => c.slug === d.community)!;
  const dups = d.street && !dupDismissed ? repo.findDuplicates({ category: d.category, community: d.community, street: d.street }) : [];
  return <>
    <div className="map" style={{ height: 240 }} role="application" aria-label="Map. Tap to place the pin." onClick={(e) => {
      if ((e.target as HTMLElement).closest('button')) return; const b = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - b.left) / b.width) * 100, y = ((e.clientY - b.top) / b.height) * 100; const s = nearestStreet(x, y);
      set({ pos: { x, y }, street: s.name, community: s.c });
    }}>
      <MapBase />
      {d.pos ? <div className="pin sel" style={{ left: `${d.pos.x}%`, top: `${d.pos.y}%`, '--c': 'var(--clay)', pointerEvents: 'none' } as React.CSSProperties}><span className="head"><Icon name="pin" size={15} /></span></div>
        : <div className="mypos" style={{ left: '44%', top: '61%' }} />}
      <div className="map-sheet row" style={{ justifyContent: 'flex-end' }}><button className="btn btn-secondary btn-sm" style={{ boxShadow: 'var(--shadow)' }} onClick={() => { set({ pos: { x: 44.5, y: 61 }, street: 'Adeola Street', community: 'surulere' }); ui.toast('Location found · accurate to 12 m', 'target'); }}><Icon name="target" size={16} />Use my location</button></div>
    </div>
    <p className="xs faint" style={{ textAlign: 'center' }}>Tap the map to drop a pin, or search below.</p>
    {d.street && <div className="card row gap-12"><span style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--clay-soft)', color: 'var(--clay)', display: 'grid', placeItems: 'center' }}><Icon name="pin" size={20} /></span>
      <div className="grow"><b>{d.street}</b><div className="xs muted">{comm.name} · {comm.lgaName} · {comm.state} State</div></div><Icon name="check" size={20} className="brand" /></div>}
    <div className="field"><label htmlFor="street">Street or area</label><input id="street" className="input" list="streets" value={d.street} onChange={(e) => set({ street: e.target.value })} placeholder="e.g. Adeola Street" />
      <datalist id="streets">{STREETS.map((s) => <option key={s.name} value={s.name} />)}</datalist></div>
    <div className="field"><label htmlFor="lm">Nearby landmark <span className="faint">(optional)</span></label><input id="lm" className="input" value={d.landmark} onChange={(e) => set({ landmark: e.target.value })} placeholder="e.g. Opposite the church, near the bus stop" /></div>
    <div className="row gap-12">
      <div className="field grow"><label htmlFor="cm">Community</label><select id="cm" className="select" value={d.community} onChange={(e) => set({ community: e.target.value })}>{COMMUNITIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></div>
      <div className="field grow"><span className="label">LGA · State</span><div className="input muted" style={{ display: 'flex', alignItems: 'center' }}>{comm.lgaName.replace(' LGA', '').replace(' LCDA', '')} · Lagos</div></div>
    </div>
    {dups.length > 0 && (
      <div className="card stack" style={{ borderColor: 'color-mix(in srgb, var(--sun) 60%, var(--line))', background: 'color-mix(in srgb, var(--sun) 7%, var(--surface))' }}>
        <div className="row"><Icon name="layers" size={20} /><b>This issue may already have been reported</b></div>
        {dups.map((r) => <div key={r.ref} className="stack-sm"><ReportRow report={r} /><div className="xs muted">{r.affected} people have confirmed this issue.</div>
          <div className="chips">
            <button className="chip" onClick={() => { repo.confirmAffected(r.ref); repo.saveDraft(null); ui.toast('Added you to this issue. Thank you!'); router.push(`/issue/${r.ref}`); }}><Icon name="hand" size={15} />Yes, I&apos;m affected too</button>
            <Link className="chip" href={`/issue/${r.ref}`}><Icon name="camera" size={15} />Add photo or info</Link>
            <button className="chip" onClick={() => { repo.toggleFollow(r.ref); ui.toast('Following. We’ll keep you updated.', 'bell'); }}><Icon name="bell" size={15} />Follow</button>
          </div></div>)}
        <button className="btn btn-ghost btn-sm" onClick={onDismiss}>This is a different problem — continue my report</button>
      </div>)}
  </>;
}

function StepDetails({ d, set }: StepProps) {
  const ui = useUi();
  const Q = ({ k, label, opts }: { k: string; label: string; opts: string[] }) => (
    <div className="stack-sm"><span className="label">{label}</span><div className="chips">{opts.map((o) => <button key={o} className="chip" aria-pressed={d.answers[k] === o} onClick={() => set({ answers: { ...d.answers, [k]: o } })}>{o}</button>)}</div></div>
  );
  const describe = () => {
    const cat = categoryByKey(d.category); const a = d.answers;
    const desc = `${d.subtype || cat.label} at ${d.street || 'this location'}${d.landmark ? ` (${d.landmark})` : ''}. ${a.duration ? `This has been happening for ${a.duration === 'Today' ? 'less than a day' : a.duration.toLowerCase()}. ` : ''}${a.access === 'Yes' ? 'It is blocking access to homes and businesses. ' : a.access === 'Partly' ? 'It partly blocks access. ' : ''}${a.safety === 'Yes' ? 'There is a safety risk to people passing.' : ''}`.trim();
    set({ title: d.title || `${d.subtype || cat.label} on ${d.street || 'my street'}`, description: desc });
    ui.toast('Suggested a description — edit anything you like', 'sparkle');
  };
  const sub: Record<Severity, string> = { low: 'Annoying, but not dangerous', moderate: 'Affects daily life', serious: 'Causes damage or blocks access', urgent: 'Someone could get hurt' };
  return <>
    <p className="muted">A few words is enough. Plain language is perfect.</p>
    <div className="field"><label htmlFor="ttl">Short title</label><input id="ttl" className="input" maxLength={80} value={d.title} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. Deep pothole at the junction" /></div>
    <div className="field"><div className="row between"><label htmlFor="desc">What’s happening?</label><button className="btn btn-soft btn-sm" onClick={describe}><Icon name="sparkle" size={15} />Help me describe</button></div>
      <textarea id="desc" className="textarea" value={d.description} onChange={(e) => set({ description: e.target.value })} placeholder="What you see, and how it affects people" /></div>
    <Q k="duration" label="How long has this been happening?" opts={['Today', 'Days', 'Weeks', 'Months', 'Over a year']} />
    <Q k="access" label="Is it blocking homes, shops or roads?" opts={['Yes', 'Partly', 'No']} />
    <Q k="safety" label="Is there an immediate safety risk?" opts={['Yes', 'Not sure', 'No']} />
    <div className="stack-sm"><span className="label">How serious is it?</span>
      {(Object.keys(SEVERITY) as Severity[]).map((k) => (
        <button key={k} className="radio-card" role="radio" aria-checked={d.severity === k} onClick={() => set({ severity: k })}><span className="ring" /><div className="grow"><b>{SEVERITY[k].label}</b><div className="xs muted">{sub[k]}</div></div><span className={`sev sev-${k}`} aria-hidden /></button>))}
      <p className="xs faint">The government team will also check how serious it is. Serious problems are prioritised even if few people report them.</p></div>
    {(d.severity === 'urgent' || d.answers.safety === 'Yes') && <EmergencyBanner />}
  </>;
}

function StepReview({ d, set }: StepProps) {
  const repo = useRepo();
  const comm = COMMUNITIES.find((c) => c.slug === d.community)!; const cat = categoryByKey(d.category);
  const r = routeReport({ category: d.category, subtype: d.subtype, street: d.street, lga: comm.lga });
  const firstPhoto = d.photos.find((p) => !p.kind);
  const ids: [IdentityMode, string, string][] = [['first_name', `Show my first name (${repo.state.user.name})`, 'Neighbours see who reported it'], ['community_member', 'Show as “community member”', 'Your name stays hidden'], ['private', 'Keep me private publicly', 'Only the authority can contact you']];
  const Row = ({ k, children }: { k: string; children: ReactNode }) => <><dt>{k}</dt><dd>{children}</dd></>;
  return <>
    <div className="card card-flush">
      <div style={{ height: 150, position: 'relative' }}>{firstPhoto ? <Media photo={firstPhoto} /> : <Scene name={cat.key} />}<span className="tag" style={{ position: 'absolute', left: 10, top: 10, background: 'var(--surface)' }}><Icon name={cat.icon} size={13} />{cat.label}{d.subtype ? ' · ' + d.subtype : ''}</span></div>
      <div style={{ padding: 14 }} className="stack-sm"><h3 style={{ fontSize: 18 }}>{d.title || `${d.subtype || cat.label} on ${d.street}`}</h3><p className="small muted">{d.description || <i>No description</i>}</p>
        <dl className="kv" style={{ marginTop: 12 }}><Row k="Location">{d.street}, {comm.name}</Row><Row k="Severity"><SeverityBadge severity={d.severity ?? undefined} /></Row><Row k="Evidence">{d.photos.length} item{d.photos.length === 1 ? '' : 's'}</Row></dl></div>
    </div>
    <div className="next-card stack-sm"><div className="xs faint" style={{ fontWeight: 700 }}>LIKELY RESPONSIBLE</div>
      <div className="authority"><AuthorityLogo agency={r.primary} /><div><b>{AGENCIES[r.primary].name}</b><div className="xs muted">{assignmentState(r.confidence)}</div></div></div>
      <p className="small">{LEVEL_EXPLAINER[r.level]} {r.reason}</p>{r.supporting && <p className="xs muted">Also notified: {AGENCIES[r.supporting].name}</p>}</div>
    <div className="stack-sm"><span className="label">How should you appear publicly?</span>
      {ids.map(([k, l, s]) => <button key={k} className="radio-card" role="radio" aria-checked={d.identity === k} onClick={() => set({ identity: k })}><span className="ring" /><div><b>{l}</b><div className="xs muted">{s}</div></div></button>)}
      <p className="xs faint row gap-4"><Icon name="lock" size={13} />Your phone number and home address are never shown on public reports.</p></div>
  </>;
}
