'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from './Icon';
import { Scene } from './Scene';
import { cx } from './ui';
import { JOURNEY, MOODS, WHO_MOOD } from '@/content/site';

/* ---------- Mini illustrations, drawn in the site palette ---------- */
const C = { brand: '#0B7A4B', brandSoft: '#DDF1E6', forest: '#0F3B2A', sun: '#F5B301', sunSoft: '#FFF2C7', sky: '#0284C7', skySoft: '#DCEFFA', clay: '#D9481F', claySoft: '#FDE4DA', line: '#E6DECD' };

function Art({ i }: { i: number }) {
  switch (i) {
    case 0: // Reported: a snapped photo with a camera badge
      return (
        <div className="relative h-[88px] w-[132px]">
          <div className="absolute inset-0 overflow-hidden rounded-xl ring-1 ring-line [&_.scene]:h-full [&_.scene]:w-full"><Scene name="road" label="" /></div>
          <span className="absolute -bottom-2 -right-3 grid h-9 w-9 place-items-center rounded-full bg-forest text-white shadow-md ring-4 ring-white"><Icon name="camera" size={16} /></span>
        </div>
      );
    case 1: // Verified: neighbours confirming, joined to a shield
      return (
        <svg width="150" height="88" viewBox="0 0 150 88" aria-hidden>
          {[[22, 22, C.sunSoft], [22, 66, C.skySoft], [52, 44, C.claySoft]].map(([x, y, f], k) => <g key={k}><path d={`M${Number(x) + 12} ${y} C 80 ${y}, 80 44, 104 44`} stroke={C.line} strokeWidth="2.5" fill="none" /><circle cx={Number(x)} cy={Number(y)} r="13" fill={String(f)} /><circle cx={Number(x)} cy={Number(y) - 3} r="4" fill={C.forest} opacity=".55" /><path d={`M${Number(x) - 6} ${Number(y) + 8} q6 -7 12 0`} stroke={C.forest} strokeWidth="2" fill="none" opacity=".55" /></g>)}
          <rect x="104" y="22" width="44" height="44" rx="12" fill={C.brand} /><path d="M126 32l-10 4v8c0 6 4 10 10 12 6-2 10-6 10-12v-8z" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" /><path d="M121 44l4 4 6-7" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 2: // Assigned: one report routed to the right authority
      return (
        <svg width="160" height="88" viewBox="0 0 160 88" aria-hidden>
          <rect x="2" y="30" width="58" height="28" rx="14" fill={C.brand} /><circle cx="46" cy="44" r="10" fill="#fff" />
          <path d="M60 44 C 90 44, 92 14, 122 14" stroke={C.skySoft} strokeWidth="3" fill="none" /><path d="M60 44 H 122" stroke={C.brand} strokeWidth="3" /><path d="M60 44 C 90 44, 92 74, 122 74" stroke={C.claySoft} strokeWidth="3" fill="none" />
          <rect x="122" y="2" width="26" height="24" rx="7" fill={C.skySoft} /><rect x="122" y="32" width="26" height="24" rx="7" fill={C.brand} /><rect x="122" y="62" width="26" height="24" rx="7" fill={C.claySoft} />
        </svg>
      );
    case 3: // Inspected: a pin dropped on the site map
      return (
        <svg width="150" height="88" viewBox="0 0 150 88" aria-hidden>
          <rect x="1" y="1" width="148" height="86" rx="14" fill={C.brandSoft} stroke={C.line} />
          {[30, 60, 90, 120].map((x) => <path key={x} d={`M${x} 1V87`} stroke="#fff" strokeWidth="2" />)}{[29, 58].map((y) => <path key={y} d={`M1 ${y}H149`} stroke="#fff" strokeWidth="2" />)}
          <path d="M1 70 C 40 60, 70 76, 149 50" stroke={C.sun} strokeWidth="6" fill="none" opacity=".7" />
          <circle cx="76" cy="58" r="16" fill={C.clay} opacity=".15" /><path d="M76 60c-9-9-13-14-13-20a13 13 0 0 1 26 0c0 6-4 11-13 20z" fill={C.clay} /><circle cx="76" cy="40" r="4.5" fill="#fff" />
        </svg>
      );
    case 4: // Repair scheduled: a calendar, one date moved
      return (
        <svg width="150" height="88" viewBox="0 0 150 88" aria-hidden>
          {Array.from({ length: 21 }, (_, k) => {
            const x = 4 + (k % 7) * 20.5, y = 6 + Math.floor(k / 7) * 27;
            const moved = k === 10, picked = k === 15;
            return <g key={k}><rect x={x} y={y} width="16" height="20" rx="5" fill={picked ? C.brand : moved ? C.claySoft : C.line} opacity={picked || moved ? 1 : .55} />{moved && <path d={`M${x + 3} ${y + 17}l10 -14`} stroke={C.clay} strokeWidth="2" />}</g>;
          })}
          <path d="M71 38 C 80 50, 90 52, 105 52" stroke={C.forest} strokeWidth="1.8" strokeDasharray="3 3" fill="none" markerEnd="url(#ah)" />
          <defs><marker id="ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3 0 6z" fill={C.forest} /></marker></defs>
        </svg>
      );
    case 5: // Work in progress: progress climbing
      return (
        <svg width="150" height="88" viewBox="0 0 150 88" aria-hidden>
          <defs><linearGradient id="jg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.brand} stopOpacity=".28" /><stop offset="1" stopColor={C.brand} stopOpacity="0" /></linearGradient></defs>
          <path d="M2 66 C 50 62, 90 48, 132 22 V 88 H 2 Z" fill="url(#jg)" />
          <rect x="4" y="60" width="22" height="26" rx="6" fill={C.skySoft} /><rect x="52" y="46" width="22" height="40" rx="6" fill={C.brand} opacity=".55" /><rect x="100" y="30" width="22" height="56" rx="6" fill={C.sun} opacity=".6" />
          <path d="M2 66 C 50 62, 90 48, 132 22" stroke={C.forest} strokeWidth="2.2" fill="none" /><circle cx="132" cy="22" r="5" fill="#fff" stroke={C.forest} strokeWidth="2.2" />
        </svg>
      );
    default: // Fixed: the stamp
      return (
        <div className="relative flex h-[88px] w-[150px] items-center">
          <span className="absolute left-2 top-3 h-16 w-16 rounded-full bg-brand-soft" aria-hidden />
          <span className="relative ml-6"><span className="stamp !text-[15px]"><Icon name="check" size={16} />Fixed</span></span>
        </div>
      );
  }
}

/** Scroll-driven timeline: a line fills as you scroll and each step comes into focus. */
export function JourneyTimeline({ extra }: { extra?: Record<number, ReactNode> }) {
  const list = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const track = useRef<HTMLSpanElement>(null);
  const markers = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(JOURNEY.length - 1); // all visible before JS / with reduced motion

  useEffect(() => {
    const ol = list.current; if (!ol) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const update = () => {
      const box = ol.getBoundingClientRect();
      const centers = markers.current.map((m) => (m ? m.getBoundingClientRect().top - box.top + m.offsetHeight / 2 : 0));
      const first = centers[0], last = centers[centers.length - 1];
      if (track.current) { track.current.style.top = `${first}px`; track.current.style.height = `${last - first}px`; }
      // The "reading line" sits a little above the middle of the screen.
      const reach = reduce ? last : Math.min(last, Math.max(first, window.innerHeight * 0.55 - box.top));
      if (fill.current) fill.current.style.height = `${reach - first}px`;
      let idx = 0; centers.forEach((c, k) => { if (c <= reach + 1) idx = k; });
      setActive(idx);
    };
    const onScroll = () => update(); // scroll events already arrive at most once per frame
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  return (
    <ol ref={list} className="relative">
      <span ref={track} className="absolute left-[19px] w-[3px] rounded-full bg-line sm:left-[23px]" aria-hidden>
        <span ref={fill} className="absolute inset-x-0 top-0 block rounded-full bg-brand transition-[height] duration-150 ease-out" />
      </span>
      {JOURNEY.map((j, i) => {
        const on = i <= active;
        return (
          <li key={j.key} className="relative flex items-start gap-4 pb-6 last:pb-0 sm:gap-7">
            <span ref={(el) => { markers.current[i] = el; }}
              className={cx('relative z-10 mt-[46px] grid h-10 w-10 shrink-0 place-items-center rounded-full text-[13px] font-semibold tabular-nums transition-all duration-500 sm:h-12 sm:w-12',
                on ? 'bg-brand text-white shadow-[0_0_0_6px_var(--color-paper)]' : 'bg-paper text-ink-3 ring-1 ring-line shadow-[0_0_0_6px_var(--color-paper)]')}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className={cx('flex-1 rounded-[20px] bg-white p-6 ring-1 ring-line transition-all duration-500 ease-out sm:p-7', on ? 'opacity-100 shadow-soft' : 'translate-y-3 opacity-45')}>
              <Art i={i} />
              <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-[22px] font-normal text-ink">{j.label}</h3>
                <span className="rounded-full bg-paper-2 px-3 py-1 text-[13px] font-medium text-ink-2">{j.date}</span>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{j.text}</p>
              {(() => { const m = MOODS[WHO_MOOD[j.who] ?? 'green']; return (
                <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium" style={{ background: m.bg, color: m.ink }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.accent }} />{j.who}
                </span>
              ); })()}
              {extra?.[i]}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
