'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from './Icon';
import { Scene } from './Scene';
import { Btn, Wordmark, cx } from './ui';
import { APP_URL, HERO, JOURNEY, LEVELS, NAV, ROUTES, type Lang } from '@/content/site';

/* ---------------- Language (English / Naija Pidgin) ---------------- */
const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'en', setLang: () => {} });
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  useEffect(() => { try { const s = localStorage.getItem('nw-lang'); if (s === 'en' || s === 'pcm') setLangState(s); } catch {} }, []);
  const setLang = (l: Lang) => { setLangState(l); try { localStorage.setItem('nw-lang', l); } catch {} };
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}
export const useLang = () => useContext(LangCtx);

export function LangToggle({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div role="group" aria-label="Language" className={cx('flex rounded-full p-1 text-[13px] font-semibold', dark ? 'bg-white/10' : 'bg-forest/[.06]')}>
      {(['en', 'pcm'] as const).map((l) => (
        <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
          className={cx('rounded-full px-3 py-1.5 transition-colors', lang === l ? (dark ? 'bg-white text-forest' : 'bg-white text-forest shadow-sm') : dark ? 'text-white/70 hover:text-white' : 'text-ink-2 hover:text-forest')}>
          {l === 'en' ? 'English' : 'Pidgin'}
        </button>
      ))}
    </div>
  );
}

export function HeroCopy() {
  const { lang } = useLang();
  const h = HERO[lang];
  return (
    <div key={lang} className="pop-in">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/80 py-1.5 pl-2 pr-4 text-[13px] font-semibold text-forest ring-1 ring-forest/10 backdrop-blur">
        <span className="relative grid h-5 w-5 place-items-center rounded-full bg-sun"><span className="h-2 w-2 rounded-full bg-forest" /><span className="pulse absolute inset-0 rounded-full" /></span>
        {h.kicker}
      </div>
      <h1 className="mt-6 text-[52px] leading-[.95] font-extrabold text-forest sm:text-7xl lg:text-[86px]">
        <span className="block">{h.title[0]}</span>
        <span className="block text-brand">{h.title[1]}</span>
        <span className="relative inline-block">
          {h.title[2]}
          <svg className="absolute -bottom-3 left-0 h-4 w-full text-sun" viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden><path d="M3 11c60-8 140-10 294-3" stroke="currentColor" strokeWidth="7" strokeLinecap="round" fill="none" /></svg>
        </span>
      </h1>
      <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-2 sm:text-xl">{h.body}</p>
    </div>
  );
}

/* ---------------- Header ---------------- */
export function Header() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const darkTop = path !== '/';
  useEffect(() => { const f = () => setScrolled(window.scrollY > 24); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  useEffect(() => setOpen(false), [path]);
  const onDark = darkTop && !scrolled && !open;
  return (
    <header className={cx('fixed inset-x-0 top-0 z-50 transition-all duration-300', scrolled || open ? 'bg-paper/85 shadow-[0_1px_0_rgb(16_32_26/.08)] backdrop-blur-xl' : 'bg-transparent')}>
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="NaijaWorks home"><Wordmark light={onDark} /></Link>
        <nav aria-label="Main" className="ml-2 hidden items-center gap-0.5 xl:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={path === n.href ? 'page' : undefined}
              className={cx('whitespace-nowrap rounded-full px-4 py-2 text-[15px] font-medium transition-colors', onDark ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-ink-2 hover:bg-forest/5 hover:text-forest', path === n.href && (onDark ? 'bg-white/10 text-white' : 'bg-forest/[.06] text-forest'))}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-3 sm:flex">
          <LangToggle dark={onDark} />
          <Btn href={`${APP_URL}/report`} variant="sun" icon="plus">Report an issue</Btn>
        </div>
        <button className={cx('ml-auto grid h-11 w-11 place-items-center rounded-xl xl:hidden sm:ml-0', onDark ? 'text-white hover:bg-white/10' : 'text-forest hover:bg-forest/5')}
          onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}>
          <Icon name={open ? 'x' : 'list'} size={24} />
        </button>
      </div>
      {open && (
        <div id="mobile-menu" className="pop-in border-t border-line px-4 pb-6 pt-2 xl:hidden">
          <nav aria-label="Mobile" className="flex flex-col">
            {[{ href: '/', label: 'Home' }, ...NAV].map((n) => (
              <Link key={n.href} href={n.href} className="flex items-center justify-between border-b border-line py-4 text-lg font-semibold text-forest">{n.label}<Icon name="chevronR" size={18} /></Link>
            ))}
          </nav>
          <div className="mt-5 flex items-center justify-between gap-3"><LangToggle /><Btn href={`${APP_URL}/report`} variant="sun" icon="plus">Report an issue</Btn></div>
        </div>
      )}
    </header>
  );
}

/* ---------------- Scroll reveal ---------------- */
export function RevealObserver() {
  const path = usePathname();
  useEffect(() => {
    document.documentElement.classList.add('js');
    const pending = () => document.querySelectorAll<HTMLElement>('[data-reveal]:not(.in)');
    if (!('IntersectionObserver' in window)) { pending().forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    const watch = () => pending().forEach((e) => io.observe(e));
    watch();
    // Pick up elements added later (client navigation, streamed content).
    const mo = new MutationObserver(watch);
    mo.observe(document.getElementById('main') ?? document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [path]);
  return null;
}

/* ---------------- Count up ---------------- */
export function CountUp({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setN(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const start = performance.now(); const dur = 1400;
      const tick = (t: number) => { const p = Math.min(1, (t - start) / dur); setN(value * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, [value]);
  const shown = decimals ? n.toFixed(decimals) : Math.round(n).toLocaleString('en-NG');
  return <span ref={ref} className="tabular-nums">{shown}{suffix}</span>;
}

/* ---------------- Confetti (only for positive, non-emergency moments) ---------------- */
function Confetti({ burst }: { burst: number }) {
  if (!burst) return null;
  const colors = ['#F5B301', '#0B7A4B', '#D9481F', '#0284C7', '#8B5CF6', '#ffffff'];
  return (
    <div key={burst} className="pointer-events-none absolute inset-x-0 top-10 z-20 h-0" aria-hidden>
      {Array.from({ length: 34 }, (_, i) => (
        <span key={i} className="confetti-bit" style={{ left: `${10 + ((i * 37) % 80)}%`, background: colors[i % colors.length], animationDelay: `${(i % 7) * 40}ms`,
          ['--dx' as string]: `${((i * 53) % 120) - 60}px`, ['--rot' as string]: `${(i * 97) % 720}deg` }} />
      ))}
    </div>
  );
}

/* ---------------- Hero tracker demo: a report's parcel-style journey ---------------- */
export function TrackerDemo() {
  const [step, setStep] = useState(3);
  const [auto, setAuto] = useState(true);
  const [burst, setBurst] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const last = JOURNEY.length - 1;
  // Keep the active stage chip in view without scrolling the page.
  useEffect(() => {
    const box = tabsRef.current; const el = box?.querySelector<HTMLElement>(`[data-step="${step}"]`);
    if (box && el) box.scrollTo({ left: el.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2, behavior: 'smooth' });
  }, [step]);
  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setTimeout(() => setStep((s) => (s >= last ? 0 : s + 1)), step === last ? 3600 : 2200);
    return () => clearTimeout(id);
  }, [step, auto, last]);
  useEffect(() => { if (step === last) setBurst((b) => b + 1); }, [step, last]);
  const cur = JOURNEY[step];
  const fixed = step === last;
  const stops = [0, 1, 3, 5, 6];
  const scene = fixed ? 'road-fixed' : step >= 5 ? 'road-work' : 'road';

  return (
    <div className="relative mx-auto w-full max-w-[360px]">
      <div className="relative overflow-hidden rounded-[44px] bg-[#0E1512] p-2.5 shadow-pop ring-1 ring-black/10">
        <div className="relative overflow-hidden rounded-[36px] bg-paper">
          <Confetti burst={burst} />
          <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[11px] font-semibold text-ink"><span>9:41</span><span className="h-5 w-20 rounded-full bg-[#0E1512]" /><span className="flex items-center gap-1"><Icon name="wifi" size={12} />4G</span></div>
          <div className="relative mx-3 mt-1 h-[150px] overflow-hidden rounded-3xl">
            <Scene name={scene} label="Report photo" />
            <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">NW-LA-24817</span>
          </div>
          <div className="px-4 pb-4 pt-3">
            <div className="text-[12px] font-semibold text-ink-3">Pothole · Adeola Street, Surulere</div>
            <div key={step} className="pop-in mt-2 rounded-3xl bg-white p-4 shadow-soft ring-1 ring-line">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-ink-3">{fixed ? 'Fixed on' : 'Latest · ' + cur.date}</div>
                  <div className="display mt-0.5 text-[22px] leading-tight font-extrabold text-forest">{fixed ? '2 December' : cur.label}</div>
                </div>
                <span className={cx('shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold', fixed ? 'bg-brand text-white' : 'bg-brand-soft text-brand')}>{fixed ? 'Fixed ✓' : 'On track'}</span>
              </div>
              <div className="mt-4 flex items-center">
                {stops.map((s, i) => {
                  const done = step >= s; const now = step >= s && (i === stops.length - 1 || step < stops[i + 1]);
                  return (
                    <div key={s} className="flex flex-1 items-center last:flex-none">
                      <span className={cx('grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-500', done ? 'bg-brand text-white' : 'bg-paper-2 text-ink-3', now && !fixed && 'ring-4 ring-sun/50')}>
                        <Icon name={JOURNEY[s].icon} size={15} />
                      </span>
                      {i < stops.length - 1 && <span className="mx-1 h-1 flex-1 overflow-hidden rounded-full bg-paper-2"><span className="block h-full rounded-full bg-brand transition-all duration-700" style={{ width: step >= stops[i + 1] ? '100%' : step > s ? '50%' : '0%' }} /></span>}
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-[13px] leading-snug text-ink-2">{cur.text}</p>
              <div className="mt-2 text-[11px] font-semibold text-ink-3">By {cur.who}</div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
              <div className="rounded-2xl bg-white p-3 ring-1 ring-line"><div className="text-ink-3">Handled by</div><div className="font-bold text-forest">Lagos State Works</div></div>
              <div className="rounded-2xl bg-white p-3 ring-1 ring-line"><div className="text-ink-3">Affected</div><div className="font-bold text-forest">240 residents</div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 text-center text-[12px] font-bold uppercase tracking-[.14em] text-ink-3">Live demo · tap a stage</div>
      <div className="mt-2 flex items-center gap-2">
        <div className="marquee-mask flex min-w-0 flex-1 gap-1.5 overflow-x-auto px-3 py-1 [scrollbar-width:none]" role="tablist" aria-label="Report journey steps" ref={tabsRef}>
          {JOURNEY.map((j, i) => (
            <button key={j.key} role="tab" aria-selected={i === step} data-step={i} onClick={() => { setAuto(false); setStep(i); }}
              className={cx('flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold whitespace-nowrap transition-colors', i === step ? 'bg-forest text-white' : i < step ? 'bg-brand-soft text-brand' : 'bg-white text-ink-2 ring-1 ring-line hover:text-forest')}>
              <Icon name={j.icon} size={13} />{j.label}
            </button>
          ))}
        </div>
        <button onClick={() => setAuto((a) => !a)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-2 hover:bg-forest/5" aria-label={auto ? 'Pause demo' : 'Play demo'}><Icon name={auto ? 'pause' : 'play'} size={16} /></button>
      </div>
    </div>
  );
}

/* ---------------- Before / after slider ---------------- */
export function BeforeAfter({ before, after, className }: { before: string; after: string; className?: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className={cx('ba aspect-[16/11] bg-paper-2', className)} style={{ ['--pos' as string]: `${pos}%` }}>
      <div className="layer"><Scene name={before} label="Before" /></div>
      <div className="layer after"><Scene name={after} label="After" /></div>
      <span className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">Before</span>
      <span className="absolute right-3 top-3 rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">After</span>
      <div className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-white shadow-[0_0_12px_rgb(0_0_0/.35)]" style={{ left: `${pos}%` }}>
        <span className="knob absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-forest shadow-soft">
          <span className="flex"><Icon name="chevronL" size={16} /><Icon name="chevronR" size={16} /></span>
        </span>
      </div>
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(+e.target.value)} aria-label="Drag to compare before and after" />
    </div>
  );
}

/* ---------------- "Who fixes this?" explainer ---------------- */
export function RouteExplainer({ compact = false }: { compact?: boolean }) {
  const [i, setI] = useState(0);
  const r = ROUTES[i];
  const level = LEVELS.find((l) => l.key === r.level)!;
  return (
    <div className={cx('grid gap-6', !compact && 'lg:grid-cols-[1.1fr_1fr]')}>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Pick a problem">
        {ROUTES.map((x, k) => (
          <button key={x.label} role="radio" aria-checked={k === i} onClick={() => setI(k)}
            className={cx('flex items-center gap-2 rounded-2xl px-4 py-3 text-left text-[14px] font-semibold transition-all', k === i ? 'bg-forest text-white shadow-pop' : 'bg-white text-forest ring-1 ring-line hover:-translate-y-0.5 hover:ring-forest/30')}>
            <Icon name={x.icon} size={18} />{x.label}
          </button>
        ))}
      </div>
      <div key={i} className="pop-in relative overflow-hidden rounded-[28px] bg-white p-6 shadow-soft ring-1 ring-line sm:p-8" aria-live="polite">
        <div className="absolute right-0 top-0 h-full w-2" style={{ background: level.color }} aria-hidden />
        <div className="text-[13px] font-semibold text-ink-3">Usually handled by</div>
        <div className="mt-2 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl text-white" style={{ background: level.color }}><Icon name={level.icon} size={22} /></span>
          <div><div className="display text-2xl font-extrabold text-forest">{level.name}</div><div className="text-[14px] text-ink-2">e.g. {r.example}</div></div>
        </div>
        <p className="mt-5 text-[16px] leading-relaxed text-ink">{r.why}</p>
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-sun-soft p-4 text-[14px] text-[#5C4100]">
          <Icon name="sparkle" size={18} className="mt-0.5" />
          <span>You don&apos;t need to know this. NaijaWorks routes it for you, and shows any transfer, like <b>&ldquo;Transferred to State Works because the road is state-managed.&rdquo;</b></span>
        </div>
      </div>
    </div>
  );
}
