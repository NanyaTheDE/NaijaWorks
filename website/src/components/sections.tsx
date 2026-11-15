import Link from 'next/link';
import { Icon } from './Icon';
import { BeforeAfter } from './client';
import { Btn, Container, Wordmark, cx } from './ui';
import { appUrl, BY_CATEGORY, CATEGORIES, NAV, PIPELINE, STORIES } from '@/content/site';

export function CategoryMarquee({ dark = false }: { dark?: boolean }) {
  const row = [...CATEGORIES, ...CATEGORIES];
  return (
    <div className="marquee-mask overflow-hidden py-2" aria-label="Things you can report">
      <ul className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
        {row.map((c, i) => (
          <li key={i} aria-hidden={i >= CATEGORIES.length} className={cx('flex items-center gap-2.5 rounded-full py-2.5 pl-2.5 pr-5 text-[15px] font-semibold', dark ? 'bg-white/10 text-white' : 'bg-white text-forest ring-1 ring-line')}>
            <span className={cx('grid h-8 w-8 place-items-center rounded-full', dark ? 'bg-sun text-forest' : 'bg-brand-soft text-brand')}><Icon name={c.icon} size={16} /></span>{c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StoryCard({ s, big = false }: { s: (typeof STORIES)[number]; big?: boolean }) {
  return (
    <article className="group overflow-hidden rounded-[28px] bg-white shadow-soft ring-1 ring-line" data-reveal>
      <BeforeAfter before={s.before} after={s.after} className={big ? 'aspect-[16/10]' : undefined} />
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-3"><Icon name="pin" size={14} />{s.place}</div>
        <h3 className="mt-1.5 text-xl font-bold text-forest">{s.title}</h3>
        <div className="mt-4 flex flex-wrap gap-2 text-[13px] font-semibold">
          <span className="rounded-full bg-brand-soft px-3 py-1 text-brand">Fixed in {s.days} days</span>
          <span className="rounded-full bg-sun-soft px-3 py-1 text-[#8A5A00]">{s.confirmations} neighbours confirmed</span>
        </div>
        <div className="mt-3 text-[13px] text-ink-2">Handled by {s.authority}</div>
      </div>
    </article>
  );
}

/** Static preview of the government operations portal (pipeline + chart). */
export function GovPreview() {
  const max = Math.max(...BY_CATEGORY.map((b) => b.value));
  return (
    <div className="overflow-hidden rounded-[28px] bg-white text-ink shadow-pop ring-1 ring-black/5" aria-label="Preview of the government dashboard" role="img">
      <div className="flex">
        <div className="hidden w-44 shrink-0 bg-forest-2 p-4 text-white/70 sm:block" aria-hidden>
          <div className="mb-5 flex items-center gap-2 text-[13px] font-bold text-white"><span className="h-6 w-6 rounded-lg bg-sun" />Operations</div>
          {['Dashboard', 'Reports', 'Inspections', 'Work orders', 'Projects', 'Map', 'Analytics'].map((x, i) => (
            <div key={x} className={cx('mb-1 rounded-lg px-2.5 py-1.5 text-[12px] font-medium', i === 0 && 'bg-white/10 text-white')}>{x}</div>
          ))}
        </div>
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="flex items-center justify-between"><div><div className="text-[11px] text-ink-3">Lagos State Public Works</div><div className="display text-lg font-extrabold text-forest">Good morning, Folake</div></div><span className="rounded-full bg-clay-soft px-2.5 py-1 text-[11px] font-bold text-clay">6 urgent</span></div>
          <div className="mt-4 grid grid-cols-5 gap-1.5">
            {PIPELINE.map((p) => (
              <div key={p.label} className="tint-card-paper rounded-xl p-2 sm:p-2.5" style={{ ['--tint' as string]: p.color }}>
                <div className="flex items-center gap-1.5 truncate text-[10px] font-semibold text-ink-3 sm:text-[11px]"><span className="hidden h-1.5 w-1.5 shrink-0 rounded-full sm:inline-block" style={{ background: p.color }} />{p.label}</div>
                <div className="display text-lg font-extrabold text-forest sm:text-2xl">{p.count}</div>
                <div className="truncate text-[9px] font-semibold sm:text-[10px]" style={{ color: p.color }}>{p.sub}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1.3fr_1fr]">
            <div className="rounded-xl bg-paper p-3">
              <div className="text-[11px] font-bold text-ink-2">Open issues by category</div>
              <div className="mt-2 space-y-1.5">
                {BY_CATEGORY.map((b) => (
                  <div key={b.label} className="flex items-center gap-2 text-[10px]"><span className="w-16 truncate text-ink-2">{b.label}</span><span className="h-2 flex-1 rounded-full bg-white"><span className="block h-full rounded-full bg-brand" style={{ width: `${(b.value / max) * 100}%` }} /></span><span className="w-6 text-right font-semibold tabular-nums">{b.value}</span></div>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-paper p-3 text-[11px]">
              <div className="font-bold text-ink-2">Today</div>
              {[['clipboard', 'Inspection · Ogunlana Dr.', '#8B5CF6'], ['hammer', 'Work started · Allen Ave.', '#0284C7'], ['check', 'Completed · Adeola St.', '#15803D'], ['alert', 'Urgent · open manhole', '#D9481F']].map(([ic, t, c]) => (
                <div key={t} className="mt-2 flex items-center gap-2"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg text-white" style={{ background: c }}><Icon name={ic} size={12} /></span><span className="truncate">{t}</span></div>
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
        <div className="relative overflow-hidden rounded-[36px] bg-sun px-6 py-14 text-center sm:px-12 sm:py-20" data-reveal>
          <div className="adire-ink absolute inset-0" aria-hidden />
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/30 blur-2xl" aria-hidden />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-[38px] leading-[1] font-extrabold text-forest sm:text-6xl">Your street is waiting. Report it in two minutes.</h2>
            <p className="mx-auto mt-5 max-w-lg text-lg text-forest/75">Free, works on low data, in English and Pidgin. No forms, no knowing which office to call.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Btn href={appUrl('/report')} size="lg" icon="arrowR">Report an issue</Btn>
              <Btn href={appUrl('/explore')} size="lg" variant="ghost">Explore your area</Btn>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-forest-2 text-white/70">
      <div className="adire absolute inset-0 opacity-60" aria-hidden />
      <Container className="relative py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Wordmark light />
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed">A civic platform for reporting public infrastructure problems in Nigeria, and watching them get fixed in the open.</p>
            <p className="mt-5 flex items-start gap-2 rounded-2xl bg-white/5 p-3 text-[13px] text-white/80"><Icon name="alert" size={16} className="mt-0.5 shrink-0 text-sun" />Not for emergencies. If a life is in danger, call 112 first.</p>
          </div>
          <FooterCol title="Explore" links={[{ href: '/', label: 'Home' }, ...NAV]} />
          <FooterCol title="Use NaijaWorks" links={[{ href: appUrl('/report'), label: 'Report an issue' }, { href: appUrl('/explore'), label: 'Issue map' }, { href: appUrl('/data'), label: 'Open data' }, { href: appUrl('/gov'), label: 'Government sign in' }]} />
          <FooterCol title="Trust" links={[{ href: '/how-it-works#statuses', label: 'What each status means' }, { href: '/how-it-works#privacy', label: 'Privacy & safety' }, { href: '/impact#limits', label: 'About our data' }, { href: '/#faq', label: 'FAQ' }]} />
        </div>
        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-[13px] sm:flex-row">
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
      <div className="text-[13px] font-bold uppercase tracking-wider text-white">{title}</div>
      <ul className="mt-4 space-y-2.5 text-[15px]">
        {links.map((l) => <li key={l.label}>{l.href.startsWith('http') ? <a className="hover:text-sun" href={l.href}>{l.label}</a> : <Link className="hover:text-sun" href={l.href}>{l.label}</Link>}</li>)}
      </ul>
    </div>
  );
}
