import Link from 'next/link';
import { Icon } from './Icon';
import { BeforeAfter } from './client';
import { Btn, Container, Wordmark, cx } from './ui';
import { appUrl, BY_CATEGORY, CATEGORIES, NAV, PIPELINE, STORIES } from '@/content/site';

export function CategoryMarquee({ dark = false }: { dark?: boolean }) {
  const row = [...CATEGORIES, ...CATEGORIES];
  return (
    <div className="marquee-mask overflow-hidden py-2" aria-label="Things you can report">
      <ul className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
        {row.map((c, i) => (
          <li key={i} aria-hidden={i >= CATEGORIES.length} className={cx('flex items-center gap-2 py-2 pr-6 text-[16px] font-medium whitespace-nowrap', dark ? 'text-white' : 'text-ink-2')}>
            <span className={cx('grid h-7 w-7 place-items-center rounded-lg', dark ? 'bg-white/10' : 'bg-paper-2 text-ink')}><Icon name={c.icon} size={15} /></span>{c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StoryCard({ s, big = false }: { s: (typeof STORIES)[number]; big?: boolean }) {
  return (
    <article className="group overflow-hidden rounded-[20px] bg-white ring-1 ring-line transition-shadow hover:shadow-soft" data-reveal>
      <div className="relative">
        <BeforeAfter before={s.before} after={s.after} className={big ? 'aspect-[16/10]' : undefined} />
        <span className="pointer-events-none absolute bottom-4 right-4 rounded-lg bg-paper/90 p-1"><span className="stamp"><Icon name="check" size={13} />Fixed</span></span>
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

/** Static preview of the government operations portal (pipeline + chart). */
export function GovPreview() {
  const max = Math.max(...BY_CATEGORY.map((b) => b.value));
  return (
    <div className="overflow-hidden rounded-[16px] bg-white text-ink shadow-pop ring-1 ring-black/5" aria-label="Preview of the government dashboard" role="img">
      <div className="flex">
        <div className="hidden w-44 shrink-0 border-r border-line bg-paper-2/60 p-4 text-ink-2 sm:block" aria-hidden>
          <div className="mb-5 flex items-center gap-2 text-[13px] font-semibold text-ink"><span className="h-6 w-6 rounded-lg bg-sun" />Operations</div>
          {['Dashboard', 'Reports', 'Inspections', 'Work orders', 'Projects', 'Map', 'Analytics'].map((x, i) => (
            <div key={x} className={cx('mb-1 rounded-lg px-2.5 py-1.5 text-[12px] font-medium', i === 0 && 'bg-white text-ink shadow-sm ring-1 ring-line')}>{x}</div>
          ))}
        </div>
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="flex items-center justify-between"><div><div className="text-[11px] text-ink-3">Lagos State Public Works</div><div className="display text-lg font-medium text-ink">Good morning, Folake</div></div><span className="rounded-full bg-clay-soft px-2.5 py-1 text-[11px] font-bold text-clay">6 urgent</span></div>
          <div className="mt-4 grid grid-cols-5 gap-1.5">
            {PIPELINE.map((p) => (
              <div key={p.label} className="tint-card-paper rounded-xl p-2 sm:p-2.5" style={{ ['--tint' as string]: p.color }}>
                <div className="flex items-center gap-1.5 truncate text-[10px] font-semibold text-ink-3 sm:text-[11px]"><span className="hidden h-1.5 w-1.5 shrink-0 rounded-full sm:inline-block" style={{ background: p.color }} />{p.label}</div>
                <div className="display text-lg font-medium text-ink sm:text-2xl">{p.count}</div>
                <div className="truncate text-[9px] font-semibold sm:text-[10px]" style={{ color: p.color }}>{p.sub}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1.3fr_1fr]">
            <div className="rounded-xl bg-paper-2 p-3">
              <div className="text-[11px] font-bold text-ink-2">Open issues by category</div>
              <div className="mt-2 space-y-1.5">
                {BY_CATEGORY.map((b) => (
                  <div key={b.label} className="flex items-center gap-2 text-[10px]"><span className="w-16 truncate text-ink-2">{b.label}</span><span className="h-2 flex-1 rounded-full bg-white"><span className="block h-full rounded-full bg-brand" style={{ width: `${(b.value / max) * 100}%` }} /></span><span className="w-6 text-right font-semibold tabular-nums">{b.value}</span></div>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-paper-2 p-3 text-[11px]">
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
