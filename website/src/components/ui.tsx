import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from './Icon';

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="#F5B301" />
      <path d="M11 29V12l18 17V12" stroke="#063D27" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <Logo />
      <span className={cx('display text-[19px] font-semibold tracking-tight', light ? 'text-white' : 'text-ink')}>NaijaWorks</span>
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
  const cls = cx('group inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all duration-200 active:scale-[.98]', v, s, className);
  const inner = (
    <>
      {children}
      {icon && <Icon name={icon} size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />}
    </>
  );
  return external ? <a className={cls} href={href}>{inner}</a> : <Link className={cls} href={href}>{inner}</Link>;
}

/** Small "icon chip + label" line above headings. */
export function Eyebrow({ children, tone = 'brand' }: { children: ReactNode; tone?: 'brand' | 'sun' | 'light' }) {
  // The caller's icon (first child svg) is drawn as a small tinted chip.
  const chip = { brand: '[&>svg]:bg-brand-soft [&>svg]:text-brand', sun: '[&>svg]:bg-sun-soft [&>svg]:text-[#8A5A00]', light: '[&>svg]:bg-white/15 [&>svg]:text-white' }[tone];
  return (
    <span className={cx('inline-flex items-center gap-2 text-[14px] font-medium [&>svg]:box-content [&>svg]:rounded-md [&>svg]:p-[5px]', chip, tone === 'light' ? 'text-white' : 'text-ink')}>
      {children}
    </span>
  );
}

export function SectionHead({ eyebrow, title, body, center = false, light = false, tone }: { eyebrow?: ReactNode; title: ReactNode; body?: ReactNode; center?: boolean; light?: boolean; tone?: 'brand' | 'sun' | 'light' }) {
  return (
    <div className={cx('max-w-2xl', center && 'mx-auto text-center')} data-reveal>
      {eyebrow && <div className="mb-5"><Eyebrow tone={tone ?? (light ? 'light' : 'brand')}>{eyebrow}</Eyebrow></div>}
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
        <div className="pop-in">
          <span className="inline-flex items-center gap-2 text-[14px] font-medium text-ink">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-brand-soft text-brand"><Icon name={icon} size={13} /></span>{eyebrow}
          </span>
          <h1 className="mt-6 text-[46px] leading-[1.02] text-ink sm:text-6xl lg:text-[72px] [&_.text-sun]:italic [&_.text-sun]:text-brand">{title}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">{body}</p>
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
        <div className="panel-indigo relative hidden aspect-[5/4] overflow-hidden rounded-[22px] lg:block" aria-hidden>
          <div className="glass absolute left-1/2 top-1/2 flex w-[64%] -translate-x-1/2 -translate-y-1/2 items-center gap-4 rounded-2xl p-5" style={{ animation: 'float 7s ease-in-out infinite' }}>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-forest text-white"><Icon name={icon} size={22} /></span>
            <span className="min-w-0"><span className="block truncate text-[15px] font-semibold text-ink">{eyebrow}</span><span className="mt-1.5 block h-2 w-32 rounded-full bg-ink/10" /><span className="mt-1.5 block h-2 w-20 rounded-full bg-ink/10" /></span>
          </div>
          <span className="absolute bottom-[12%] right-[10%] rounded-lg bg-paper/90 p-1"><span className="stamp"><Icon name="check" size={14} />Fixed</span></span>
        </div>
      </Container>
    </section>
  );
}

export function IconTile({ name, color, size = 44 }: { name: string; color: string; size?: number }) {
  return (
    <span className="grid shrink-0 place-items-center rounded-xl" style={{ width: size, height: size, background: `color-mix(in srgb, ${color} 12%, white)`, color }}>
      <Icon name={name} size={Math.round(size * 0.46)} />
    </span>
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
