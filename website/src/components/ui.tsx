import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { MOODS, type Mood } from '@/content/site';

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

/**
 * The NaijaWorks mark: a sun-yellow tile with a location pin that is also a speech bubble, holding a tick.
 * A citizen speaks up about a place, and it gets fixed.
 */
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="12" fill="#F5B301" />
      <path d="M20 33.5c-1.1 0-6.2-5.4-8.3-8.6A10.6 10.6 0 1 1 30.6 18c0 2.6-.9 4.8-2.3 6.9-2.1 3.2-7.2 8.6-8.3 8.6Z" fill="#0F3B2A" />
      <path d="M15.4 18.3l3.2 3.2 6.2-6.6" fill="none" stroke="#F5B301" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Logo lockup: the mark plus a sans wordmark, "Naija" in deep ink and "Works" in green (white and gold on dark). */
export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <Logo />
      <span className={cx('font-sans text-[20px] font-semibold leading-none tracking-[-0.035em]', light ? 'text-white' : 'text-ink')} translate="no">
        Naija<span className={light ? 'text-sun' : 'text-brand'}>Works</span>
      </span>
    </span>
  );
}

type BtnProps = { href: string; children: ReactNode; variant?: 'primary' | 'sun' | 'ghost' | 'light' | 'outline-light'; size?: 'md' | 'lg'; icon?: string; className?: string };
/** Pill buttons: solid ink or outlined. `sun` is kept as an alias of primary for older call sites. */
export function Btn({ href, children, variant = 'primary', size = 'md', icon, className }: BtnProps) {
  const v = {
    primary: 'bg-forest text-white hover:bg-brand',
    sun: 'bg-forest text-white hover:bg-brand',
    ghost: 'text-ink ring-1 ring-inset ring-ink/80 hover:bg-ink/[.04]',
    light: 'bg-white text-ink hover:bg-white/85',
    'outline-light': 'text-white ring-1 ring-inset ring-white/60 hover:bg-white/10',
  }[variant];
  const s = size === 'lg' ? 'h-12 px-6 text-[15px]' : 'h-10 px-5 text-[14px]';
  const external = href.startsWith('http');
  const cls = cx('group inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[.97]', v, s, className);
  const inner = (
    <>
      {children}
      {icon && <Icon name={icon} size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />}
    </>
  );
  return external ? <a className={cls} href={href}>{inner}</a> : <Link className={cls} href={href}>{inner}</Link>;
}

export function SectionHead({ eyebrow, title, body, center = false, light = false, tone }: { eyebrow?: ReactNode; title: ReactNode; body?: ReactNode; center?: boolean; light?: boolean; tone?: 'brand' | 'sun' | 'light' }) {
  return (
    <div className={cx('max-w-2xl', center && 'mx-auto text-center')} data-reveal>
      {/* Eyebrow labels were removed by design; `eyebrow` is kept as an optional prop so callers stay valid. */}
      <h2 className={cx('text-[36px] leading-[1.04] sm:text-[52px]', light ? 'text-white' : 'text-ink')}>{title}</h2>
      {body && <p className={cx('mt-5 text-[17px] leading-relaxed', light ? 'text-white/75' : 'text-ink-2')}>{body}</p>}
    </div>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8', className)}>{children}</div>;
}

/** Hero for inner pages: clean white text block with a painted-sky panel. */
export function PageHero({ eyebrow, title, body, children, icon = 'sparkle' }: { eyebrow: string; title: ReactNode; body: ReactNode; children?: ReactNode; icon?: string }) {
  return (
    <section className="pt-28 sm:pt-36">
      <Container className="grid items-center gap-10 pb-16 lg:grid-cols-[1.25fr_1fr] lg:pb-24">
        <div className="rise">
          <h1 className="text-[46px] leading-[1.02] text-ink sm:text-6xl lg:text-[72px] [&_.text-sun]:italic [&_.text-sun]:text-brand">{title}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">{body}</p>
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
        <div className="panel-indigo relative hidden aspect-[5/4] overflow-hidden rounded-[24px] lg:block" aria-hidden>
          <div className="glass absolute left-1/2 top-1/2 flex w-[64%] -translate-x-1/2 -translate-y-1/2 items-center gap-4 rounded-2xl p-5" style={{ animation: 'float 7s ease-in-out infinite' }}>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-forest text-white"><Icon name={icon} size={22} /></span>
            <span className="min-w-0"><span className="block truncate text-[15px] font-semibold text-ink">{eyebrow}</span><span className="mt-1.5 block h-2 w-32 rounded-full bg-ink/10" /><span className="mt-1.5 block h-2 w-20 rounded-full bg-ink/10" /></span>
          </div>
          <span className="absolute bottom-[12%] right-[10%]"><span className="stamp"><Icon name="check" size={14} />Fixed</span></span>
        </div>
      </Container>
    </section>
  );
}

/**
 * The site's one icon chip: always a circle. Sizes: 28 inline, 36 list, 44 feature, 52 featured.
 * Colour rule: `soft` (green tint) for feature icons; `solid` (deep green) for the active or primary item;
 * `medal` for badges; a custom `color` only where colour carries meaning (status, urgency, government level).
 */
export function IconTile({ name, size = 44, tone = 'soft', color, className }: { name: string; size?: 28 | 36 | 44 | 52; tone?: 'soft' | 'solid' | 'medal'; color?: string; className?: string }) {
  const toneCls = { soft: 'bg-brand-soft text-brand', solid: 'bg-forest text-white', medal: 'bg-sun-soft text-forest ring-2 ring-sun/70 ring-offset-2 ring-offset-paper' }[tone];
  return (
    <span className={cx('icon-tile grid shrink-0 place-items-center rounded-full', !color && toneCls, className)}
      style={{ width: size, height: size, ...(color ? { background: `color-mix(in srgb, ${color} 13%, white)`, color } : {}) }}>
      <Icon name={name} size={Math.round(size * 0.45)} />
    </span>
  );
}

/**
 * Colour tile: the site's one colourful card. Soft mood background, text and icon in the mood's deeper ink,
 * a faint ring pattern fading in from the top corner and a large watermark icon. Lifts and wiggles on hover.
 */
export function ColorTile({ mood, icon, title, body, children, className, big = false, style }: {
  mood: Mood; icon: string; title?: ReactNode; body?: ReactNode; children?: ReactNode; className?: string; big?: boolean; style?: React.CSSProperties;
}) {
  const m = MOODS[mood];
  return (
    <div data-reveal style={{ ...style, background: m.bg, color: m.ink }}
      className={cx('lift wiggle-host group relative isolate flex flex-col overflow-hidden rounded-[24px] p-6 sm:p-7', className)}>
      <span className="pointer-events-none absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(circle,transparent_10px,currentColor_10.5px,currentColor_11.5px,transparent_12px)] [background-size:44px_44px] [mask-image:linear-gradient(200deg,#000,transparent_55%)]"
        style={{ color: `color-mix(in srgb, ${m.accent} 14%, transparent)` }} aria-hidden />
      <span className="pointer-events-none absolute -bottom-6 -right-6 -z-10 opacity-[.09] transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-110" style={{ color: m.accent }} aria-hidden>
        <Icon name={icon} size={big ? 220 : 130} />
      </span>
      <span className="icon-tile grid h-12 w-12 shrink-0 place-items-center rounded-full" style={{ background: `color-mix(in srgb, ${m.accent} 16%, ${m.bg})`, color: m.accent }}><Icon name={icon} size={22} /></span>
      {title && <h3 className="mt-6 text-[22px] font-normal leading-snug">{title}</h3>}
      {body && <p className="mt-2 text-[15px] leading-relaxed opacity-80">{body}</p>}
      {children}
    </div>
  );
}

/** ✓ checklist in the reference style. */
export function Checklist({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cx('space-y-2.5', className)}>
      {items.map((t) => <li key={t} className="flex gap-2.5 text-[15px] text-ink"><Icon name="check" size={17} className="mt-0.5 text-brand" />{t}</li>)}
    </ul>
  );
}

export function StatusDot({ color }: { color: string }) {
  return <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 0 3px color-mix(in srgb, ${color} 22%, transparent)` }} />;
}
