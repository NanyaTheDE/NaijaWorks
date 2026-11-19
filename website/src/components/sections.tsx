import Link from 'next/link';
import { Icon } from './Icon';
import { BeforeAfter } from './client';
import { Btn, Container, Wordmark, cx } from './ui';
import { appUrl, BY_CATEGORY, CATEGORIES, DASH_RECENT, DASH_TREND, NAV, PIPELINE, STORIES } from '@/content/site';

export function CategoryMarquee({ dark = false }: { dark?: boolean }) {
  const row = [...CATEGORIES, ...CATEGORIES];
  return (
    <div className="marquee-mask overflow-hidden py-2" aria-label="Things you can report">
      <ul className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
        {row.map((c, i) => (
          <li key={i} aria-hidden={i >= CATEGORIES.length} className={cx('flex items-center gap-2 py-2 pr-6 text-[16px] font-medium whitespace-nowrap', dark ? 'text-white' : 'text-ink-2')}>
            <span className={cx('grid h-7 w-7 place-items-center rounded-full', dark ? 'bg-white/10' : 'bg-paper-2 text-ink')}><Icon name={c.icon} size={15} /></span>{c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StoryCard({ s, big = false }: { s: (typeof STORIES)[number]; big?: boolean }) {
  return (
    <article className="lift group overflow-hidden rounded-[20px] bg-white ring-1 ring-line" data-reveal>
      <div className="relative">
        <BeforeAfter before={s.before} after={s.after} className={big ? 'aspect-[16/10]' : undefined} />
        <span className="pointer-events-none absolute bottom-4 right-4"><span className="stamp"><Icon name="check" size={13} />Fixed</span></span>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-3"><Icon name="pin" size={14} />{s.place}</div>
        <h3 className="mt-1.5 text-[22px] font-medium text-ink">{s.title}</h3>
        <div className="mt-4 flex flex-wrap gap-2 text-[13px] font-semibold">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-brand ring-1 ring-brand/30"><Icon name="check" size={13} />Fixed in {s.days} days</span>
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-ink-2 ring-1 ring-line"><Icon name="users" size={13} />{s.confirmations} neighbours confirmed</span>
        </div>
        <div className="mt-3 text-[13px] text-ink-2">Handled by {s.authority}</div>
      </div>
    </article>
  );
}

/** Preview of the government operations dashboard: clean app chrome in the NaijaWorks style. */
export function GovPreview() {
  const max = Math.max(...BY_CATEGORY.map((b) => b.value));
  const kpis = PIPELINE.filter((p) => p.label !== 'Verified');
  const kpiIcon: Record<string, string> = { New: 'inbox', Inspection: 'clipboard', Work: 'hammer', Done: 'check' };
  // Smooth line for the trend chart
  const W = 300, H = 96, n = DASH_TREND.length, top = Math.max(...DASH_TREND) * 1.15;
  const pts = DASH_TREND.map((v, i) => [(i / (n - 1)) * W, H - (v / top) * H] as const);
  const line = pts.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `C${pts[i - 1][0] + W / (n - 1) / 2},${pts[i - 1][1]} ${x - W / (n - 1) / 2},${y} ${x},${y}`)).join(' ');
  // Donut: resolved vs in progress vs urgent
  const parts = [{ v: 214, c: '#0B7A4B' }, { v: 112, c: '#F5B301' }, { v: 6, c: '#D9481F' }];
  const total = parts.reduce((a, p) => a + p.v, 0), R = 30, CIRC = 2 * Math.PI * R;
  let acc = 0;
  const toneCls: Record<string, string> = { clay: 'text-clay bg-clay-soft', violet: 'text-violet bg-[#EEE9FE]', sun: 'text-[#8A5A00] bg-sun-soft', brand: 'text-brand bg-brand-soft' };
  return (
    <div className="@container overflow-hidden rounded-[16px] bg-white text-ink shadow-pop ring-1 ring-black/5" aria-label="Preview of the government dashboard" role="img">
      {/* App top bar */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <span className="flex items-center gap-2 text-[13px] font-semibold"><span className="grid h-6 w-6 place-items-center rounded-[7px] bg-sun text-[11px] font-bold text-[#063D27]">N</span>Operations</span>
        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-medium text-brand"><span className="h-1.5 w-1.5 rounded-full bg-brand" />Online</span>
        <span className="hidden items-center gap-2 text-[12px] text-ink-2 @md:flex"><span className="grid h-6 w-6 place-items-center rounded-full bg-paper-2 text-[10px] font-semibold text-ink">FA</span>Folake</span>
      </div>
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden w-[168px] shrink-0 border-r border-line bg-paper/60 p-3 text-[12px] text-ink-2 @3xl:block" aria-hidden>
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-white px-2.5 py-1.5 text-ink-3 ring-1 ring-line"><Icon name="search" size={12} />Search</div>
          {[['grid', 'Dashboard'], ['inbox', 'Reports'], ['clipboard', 'Inspections'], ['wrench', 'Work orders'], ['crane', 'Projects'], ['map', 'Map'], ['chart', 'Analytics']].map(([ic, x], i) => (
            <div key={x} className={cx('mb-0.5 flex items-center gap-2 rounded-xl px-2.5 py-1.5 font-medium', i === 0 ? 'bg-brand-soft text-brand' : 'hover:text-ink')}><Icon name={ic} size={13} />{x}</div>
          ))}
          <div className="mb-1.5 mt-4 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-ink-3">Today</div>
          {['Inspection · Ogunlana Dr.', 'Work started · Allen Ave.'].map((t) => <div key={t} className="truncate rounded-xl px-2.5 py-1 text-[11px]">{t}</div>)}
        </div>
        {/* Main */}
        <div className="min-w-0 flex-1 bg-paper/40 p-4 @xl:p-5">
          <div className="display text-[20px] text-ink">Good morning, Folake</div>
          <div className="text-[11px] text-ink-3">Lagos State Public Works</div>
          {/* KPI cards */}
          <div className="mt-4 grid grid-cols-2 gap-2.5 @2xl:grid-cols-4">
            {kpis.map((k) => (
              <div key={k.label} className="flex items-center gap-2.5 rounded-xl bg-white p-3 ring-1 ring-line">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: `color-mix(in srgb, ${k.color} 12%, white)`, color: k.color }}><Icon name={kpiIcon[k.label] ?? 'dots'} size={15} /></span>
                <span className="min-w-0"><span className="block truncate text-[10px] text-ink-3">{k.label}</span><span className="display block text-[19px] leading-tight text-ink">{k.count}</span></span>
              </div>
            ))}
          </div>
          {/* Charts */}
          <div className="mt-2.5 grid gap-2.5 @lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-xl bg-white p-3.5 ring-1 ring-line">
              <div className="text-[12px] font-semibold text-ink">Reports received</div>
              <svg viewBox={`0 -6 ${W} ${H + 12}`} className="mt-2 h-[96px] w-full" preserveAspectRatio="none" aria-hidden>
                <defs><linearGradient id="dash-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0B7A4B" stopOpacity=".18" /><stop offset="1" stopColor="#0B7A4B" stopOpacity="0" /></linearGradient></defs>
                {[0.25, 0.5, 0.75].map((f) => <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="#EFE9DC" strokeWidth="1" />)}
                <path d={`${line} L${W},${H} L0,${H} Z`} fill="url(#dash-g)" />
                <path d={line} fill="none" stroke="#0B7A4B" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              </svg>
              <div className="mt-1 flex justify-between text-[9px] text-ink-3"><span>1 Nov</span><span>7 Nov</span><span>14 Nov</span></div>
            </div>
            <div className="rounded-xl bg-white p-3.5 ring-1 ring-line">
              <div className="text-[12px] font-semibold text-ink">Status breakdown</div>
              <div className="mt-2 flex items-center gap-3">
                <svg viewBox="0 0 80 80" className="h-[84px] w-[84px] shrink-0 -rotate-90" aria-hidden>
                  <circle cx="40" cy="40" r={R} fill="none" stroke="#F2ECDF" strokeWidth="11" />
                  {parts.map((p) => { const len = (p.v / total) * CIRC; const el = <circle key={p.c} cx="40" cy="40" r={R} fill="none" stroke={p.c} strokeWidth="11" strokeDasharray={`${len} ${CIRC - len}`} strokeDashoffset={-acc} />; acc += len; return el; })}
                </svg>
                <div className="space-y-1.5 text-[10px] text-ink-2">
                  {[['#0B7A4B', 'Done', 214], ['#F5B301', 'Work', 112], ['#D9481F', 'Urgent', 6]].map(([c, l, v]) => <div key={l as string} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: c as string }} /><span className="w-12">{l}</span><b className="font-semibold text-ink">{v}</b></div>)}
                </div>
              </div>
            </div>
          </div>
          {/* Lists */}
          <div className="mt-2.5 grid gap-2.5 @2xl:grid-cols-[1fr_1.6fr]">
            <div className="rounded-xl bg-white p-3.5 ring-1 ring-line">
              <div className="text-[12px] font-semibold text-ink">Open issues by category</div>
              <div className="mt-2.5 space-y-2">
                {BY_CATEGORY.slice(0, 5).map((b) => (
                  <div key={b.label} className="text-[10px]"><div className="flex justify-between"><span className="text-ink-2">{b.label}</span><b className="font-semibold tabular-nums text-ink">{b.value}</b></div>
                    <div className="mt-1 h-1.5 rounded-full bg-paper-2"><div className="h-full rounded-full bg-brand" style={{ width: `${(b.value / max) * 100}%` }} /></div></div>
                ))}
              </div>
            </div>
            <div className="hidden rounded-xl bg-white ring-1 ring-line @lg:block">
              <div className="px-3.5 pt-3.5 text-[12px] font-semibold text-ink">Recent reports</div>
              <div className="mt-2 grid grid-cols-[1.2fr_1fr_auto] gap-x-3 border-b border-line px-3.5 pb-1.5 text-[9px] font-semibold uppercase tracking-wider text-ink-3"><span>Report</span><span>Status</span><span>When</span></div>
              {DASH_RECENT.map((r) => (
                <div key={r.report} className="grid grid-cols-[1.2fr_1fr_auto] items-center gap-x-3 border-b border-line px-3.5 py-2 text-[10px] last:border-0">
                  <span className="min-w-0"><b className="block truncate font-semibold text-ink">{r.report}</b><span className="block truncate text-ink-3">{r.place}</span></span>
                  <span><span className={cx('inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium', toneCls[r.tone])}><span className="h-1 w-1 rounded-full bg-current" />{r.status}</span></span>
                  <span className="whitespace-nowrap text-ink-3">{r.when}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CtaBand() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="panel-sun relative overflow-hidden rounded-[24px] px-6 py-16 text-center sm:px-12 sm:py-24" data-reveal>
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-[40px] leading-[1.02] text-ink sm:text-[60px]">Your street is waiting. Report it in two minutes.</h2>
            <p className="mx-auto mt-5 max-w-lg text-lg text-ink-2">Free, works on low data, in English and Pidgin. No forms, no knowing which office to call.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Btn href={appUrl('/report')} size="lg" icon="arrowR">Report an issue</Btn>
              <Btn href={appUrl('/explore')} size="lg" variant="ghost" className="bg-paper/70">Explore your area</Btn>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-2 text-ink-2">
      <Container className="py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed">A civic platform for reporting public infrastructure problems in Nigeria, and watching them get fixed in the open.</p>
            <p className="mt-5 flex items-start gap-2 text-[13px] text-ink-2"><Icon name="alert" size={16} className="mt-0.5 shrink-0 text-clay" />Not for emergencies. If a life is in danger, call 112 first.</p>
          </div>
          <FooterCol title="Explore" links={[{ href: '/', label: 'Home' }, ...NAV]} />
          <FooterCol title="Use NaijaWorks" links={[{ href: appUrl('/report'), label: 'Report an issue' }, { href: appUrl('/explore'), label: 'Issue map' }, { href: appUrl('/data'), label: 'Open data' }, { href: appUrl('/gov'), label: 'Government sign in' }]} />
          <FooterCol title="Trust" links={[{ href: '/how-it-works#statuses', label: 'What each status means' }, { href: '/how-it-works#privacy', label: 'Privacy & safety' }, { href: '/impact#limits', label: 'About our data' }, { href: '/#faq', label: 'FAQ' }]} />
        </div>
        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-line pt-6 text-[13px] sm:flex-row">
          <span>© 2026 NaijaWorks.</span>
          <span>Made for every LGA, from Lagos to Enugu.</span>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: readonly { href: string; label: string }[] }) {
  return (
    <div>
      <div className="text-[14px] font-medium text-ink">{title}</div>
      <ul className="mt-4 space-y-2.5 text-[15px]">
        {links.map((l) => <li key={l.label}>{l.href.startsWith('http') ? <a className="hover:text-ink" href={l.href}>{l.label}</a> : <Link className="hover:text-ink" href={l.href}>{l.label}</Link>}</li>)}
      </ul>
    </div>
  );
}
