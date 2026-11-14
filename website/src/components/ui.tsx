import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from './Icon';

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="12" fill="#F5B301" />
      <path d="M11 29V12l18 17V12" stroke="#063D27" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <Logo />
      <span className={cx('display text-[21px] font-extrabold tracking-tight', light ? 'text-white' : 'text-forest')}>NaijaWorks</span>
    </span>
  );
}

type BtnProps = { href: string; children: ReactNode; variant?: 'primary' | 'sun' | 'ghost' | 'light' | 'outline-light'; size?: 'md' | 'lg'; icon?: string; className?: string };
export function Btn({ href, children, variant = 'primary', size = 'md', icon, className }: BtnProps) {
  const v = {
    primary: 'bg-forest text-white hover:bg-brand shadow-[0_8px_24px_-8px_rgb(6_61_39/.55)]',
    sun: 'bg-sun text-forest hover:bg-[#FFC21A] shadow-[0_8px_24px_-8px_rgb(245_179_1/.7)]',
    ghost: 'text-forest hover:bg-forest/5 ring-1 ring-inset ring-forest/15',
    light: 'bg-white text-forest hover:bg-sun-soft',
    'outline-light': 'text-white ring-1 ring-inset ring-white/30 hover:bg-white/10',
  }[variant];
  const s = size === 'lg' ? 'h-14 px-7 text-[16px] rounded-2xl' : 'h-11 px-5 text-[15px] rounded-xl';
  const external = href.startsWith('http');
  const cls = cx('group inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap transition-all duration-200 active:scale-[.98]', v, s, className);
  const inner = (
    <>
      {children}
      {icon && <Icon name={icon} size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />}
    </>
  );
  return external ? <a className={cls} href={href}>{inner}</a> : <Link className={cls} href={href}>{inner}</Link>;
}

export function Eyebrow({ children, tone = 'brand' }: { children: ReactNode; tone?: 'brand' | 'sun' | 'light' }) {
  const t = { brand: 'bg-brand-soft text-brand', sun: 'bg-sun-soft text-[#8A5A00]', light: 'bg-white/10 text-sun' }[tone];
  return <span className={cx('inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold', t)}>{children}</span>;
}

export function SectionHead({ eyebrow, title, body, center = false, light = false, tone }: { eyebrow?: ReactNode; title: ReactNode; body?: ReactNode; center?: boolean; light?: boolean; tone?: 'brand' | 'sun' | 'light' }) {
  return (
    <div className={cx('max-w-2xl', center && 'mx-auto text-center')} data-reveal>
      {eyebrow && <div className="mb-4"><Eyebrow tone={tone ?? (light ? 'light' : 'brand')}>{eyebrow}</Eyebrow></div>}
      <h2 className={cx('text-[34px] leading-[1.05] font-extrabold sm:text-5xl', light ? 'text-white' : 'text-forest')}>{title}</h2>
      {body && <p className={cx('mt-4 text-[17px] leading-relaxed', light ? 'text-white/70' : 'text-ink-2')}>{body}</p>}
    </div>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8', className)}>{children}</div>;
}

/** Hero for inner pages. */
export function PageHero({ eyebrow, title, body, children, icon }: { eyebrow: string; title: ReactNode; body: ReactNode; children?: ReactNode; icon?: string }) {
  return (
    <section className="relative overflow-hidden bg-forest text-white grain">
      <div className="adire absolute inset-0" aria-hidden />
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-sun/25 blur-3xl" aria-hidden />
      <div className="absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-brand-2/40 blur-3xl" aria-hidden />
      <Container className="relative pb-20 pt-32 sm:pb-24 sm:pt-40">
        <div className="pop-in max-w-3xl">
          <Eyebrow tone="light">{icon && <Icon name={icon} size={15} />}{eyebrow}</Eyebrow>
          <h1 className="mt-5 text-[42px] leading-[1] font-extrabold sm:text-6xl lg:text-7xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">{body}</p>
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </Container>
    </section>
  );
}

export function IconTile({ name, color, size = 48 }: { name: string; color: string; size?: number }) {
  return (
    <span className="grid shrink-0 place-items-center rounded-2xl" style={{ width: size, height: size, background: `color-mix(in srgb, ${color} 14%, white)`, color }}>
      <Icon name={name} size={Math.round(size * 0.48)} />
    </span>
  );
}

export function StatusDot({ color }: { color: string }) {
  return <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 0 3px color-mix(in srgb, ${color} 22%, transparent)` }} />;
}
