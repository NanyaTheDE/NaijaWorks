'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from './Icon';
import { Scene } from './Scene';
import { Confetti, StatusBar } from './client';
import { cx } from './ui';
import { disableSound, enableSound, play, type Sfx } from './sfx';

/** One scene of the story: what the phone shows, how long it stays, and when each sound plays (ms). */
type Step = { label: string; ms: number; sounds: [number, Sfx][]; screen: ReactNode };

const Card = ({ children, className }: { children: ReactNode; className?: string }) => <div className={cx('rounded-2xl bg-white p-3.5 ring-1 ring-line', className)}>{children}</div>;
const Photo = ({ name = 'road', className }: { name?: string; className?: string }) => (
  <div className={cx('overflow-hidden rounded-2xl [&_.scene]:h-full [&_.scene]:w-full', className)}><Scene name={name} label="" /></div>
);

const STEPS: Step[] = [
  {
    label: 'Snap it', ms: 2800, sounds: [[900, 'shutter']],
    screen: (
      <div className="relative h-full">
        <Photo className="absolute inset-x-3 bottom-[92px] top-0" />
        {/* viewfinder corners */}
        {['left-6 top-3 border-l-2 border-t-2', 'right-6 top-3 border-r-2 border-t-2', 'left-6 bottom-[104px] border-b-2 border-l-2', 'right-6 bottom-[104px] border-b-2 border-r-2'].map((c) => <span key={c} className={cx('absolute h-6 w-6 rounded-[6px] border-white/90', c)} />)}
        <span className="story-flash pointer-events-none absolute inset-0 bg-white" />
        <span className="absolute inset-x-0 bottom-6 mx-auto grid h-16 w-16 place-items-center rounded-full ring-4 ring-white/80">
          <span className="story-press h-12 w-12 rounded-full bg-white shadow-md" />
        </span>
      </div>
    ),
  },
  {
    label: 'What is wrong?', ms: 2800, sounds: [[800, 'tap']],
    screen: (
      <div className="px-4">
        <div className="display text-[22px] text-ink">What is wrong?</div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[['road', 'Road'], ['lamp', 'Streetlight'], ['waves', 'Drainage'], ['droplet', 'Water'], ['trash', 'Waste'], ['bolt', 'Power']].map(([ic, l], k) => (
            <div key={l} className={cx('relative flex flex-col items-center gap-1.5 overflow-hidden rounded-2xl bg-white p-3 text-[12px] font-medium text-ink-2 ring-1 ring-line', k === 0 && 'story-pick')}>
              <Icon name={ic} size={22} />{l}
              {k === 0 && <span className="story-ripple pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/25" />}
            </div>
          ))}
        </div>
        <Card className="story-fade mt-4 flex items-center gap-3 [animation-delay:1.1s]"><Photo className="h-12 w-16 shrink-0 rounded-xl" /><div className="text-[13px] font-medium text-ink">Pothole · Adeola Street, Surulere</div></Card>
      </div>
    ),
  },
  {
    label: 'Where is it?', ms: 2800, sounds: [[760, 'plop']],
    screen: (
      <div className="px-4">
        <div className="display text-[22px] text-ink">Where is it?</div>
        <div className="relative mt-4 h-[300px] overflow-hidden rounded-3xl bg-[#E8EFE6] ring-1 ring-line">
          <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full" aria-hidden>
            <path d="M-10 210 C 80 190, 160 230, 310 170" stroke="#fff" strokeWidth="18" fill="none" strokeLinecap="round" />
            <path d="M120 -10 C 130 90, 110 180, 140 310" stroke="#fff" strokeWidth="12" fill="none" strokeLinecap="round" />
            <path d="M-10 80 C 90 100, 200 60, 310 90" stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" />
            <circle cx="230" cy="250" r="26" fill="#D6E6D3" /><circle cx="50" cy="40" r="20" fill="#D6E6D3" />
          </svg>
          <span className="story-ring absolute left-[46%] top-[62%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay/20" />
          <span className="story-drop absolute left-[46%] top-[62%] grid h-11 w-11 -translate-x-1/2 -translate-y-full place-items-center rounded-full bg-clay text-white shadow-lg ring-4 ring-white"><Icon name="pin" size={20} /></span>
        </div>
        <Card className="story-fade mt-3 flex items-center gap-2 text-[13px] font-medium text-ink [animation-delay:1.1s]"><Icon name="pin" size={16} className="text-clay" />Adeola Street, Surulere</Card>
      </div>
    ),
  },
  {
    label: 'Reported', ms: 3000, sounds: [[500, 'tap'], [650, 'whoosh']],
    screen: (
      <div className="relative h-full px-4">
        <div className="story-flyout">
          <Card><Photo className="h-36" /><div className="mt-3 text-[13px] font-medium text-ink">Pothole · Adeola Street, Surulere</div></Card>
          <div className="story-press-btn mt-3 flex h-12 items-center justify-center gap-2 rounded-full bg-forest text-[15px] font-medium text-white"><Icon name="send" size={16} />Send report</div>
        </div>
        <div className="story-fade absolute inset-x-4 top-12 text-center [animation-delay:1.2s]">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand text-white shadow-lg"><Icon name="check" size={30} /></span>
          <div className="display mt-4 text-[22px] text-ink">Report sent</div>
          <Card className="mt-4 text-left text-[13px]">
            <div className="flex justify-between"><span className="text-ink-3">Reference</span><b className="font-semibold text-ink">NW-LA-24817</b></div>
            <div className="mt-2 flex justify-between gap-3"><span className="text-ink-3">Next expected update</span><b className="text-right font-semibold text-ink">Within 3 working days</b></div>
          </Card>
        </div>
      </div>
    ),
  },
  {
    label: 'Verified', ms: 2800, sounds: [[720, 'stamp']],
    screen: (
      <div className="px-4">
        <Card className="relative"><Photo className="h-40" /><div className="mt-3 text-[13px] font-medium text-ink">Pothole · Adeola Street, Surulere</div>
          <span className="story-stamp absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2"><span className="stamp !text-[16px] !opacity-100 ![animation:none]"><Icon name="shield" size={18} />Verified</span></span>
        </Card>
        <Card className="story-fade mt-3 flex items-center gap-3 [animation-delay:1.2s]"><span className="grid h-9 w-9 place-items-center rounded-full bg-forest text-white"><Icon name="users" size={16} /></span><span className="text-[13px]"><b className="block font-semibold text-ink">+23 neighbours</b><span className="text-ink-2">confirmed this issue</span></span></Card>
      </div>
    ),
  },
  {
    label: 'Assigned', ms: 2800, sounds: [[900, 'ding']],
    screen: (
      <div className="px-4">
        <div className="display text-[22px] text-ink">Usually handled by</div>
        <div className="mt-4 space-y-2">
          {[['Surulere LGA', false], ['Lagos State Public Works', true], ['Federal Roads Maintenance Agency', false]].map(([n, on]) => (
            <Card key={n as string} className={cx('flex items-center gap-3 text-[13px] font-medium', on ? 'story-route-on' : 'story-route-off')}>
              <span className={cx('grid h-9 w-9 place-items-center rounded-full', on ? 'bg-forest text-white' : 'bg-paper-2 text-ink-2')}><Icon name="building" size={16} /></span>
              <span className="flex-1 text-ink">{n}</span>{on && <span className="story-fade text-brand [animation-delay:.9s]"><Icon name="check" size={18} /></span>}
            </Card>
          ))}
        </div>
        <div className="story-fade mt-4 rounded-2xl bg-brand-soft p-3 text-[12px] text-brand [animation-delay:1.1s]">Assigned · road is state-managed</div>
      </div>
    ),
  },
  {
    label: 'Inspected', ms: 3000, sounds: [[700, 'tick'], [1100, 'tick'], [1500, 'tick']],
    screen: (
      <div className="px-4">
        <Photo name="road" className="h-36" />
        <div className="mt-3 space-y-2">
          {['Photos taken', 'GPS recorded', 'Repair required'].map((t, k) => (
            <Card key={t} className="flex items-center gap-3 text-[13px] font-medium text-ink">
              <span className="relative grid h-6 w-6 place-items-center rounded-full ring-2 ring-line">
                <span className="story-check absolute inset-0 grid place-items-center rounded-full bg-brand text-white" style={{ animationDelay: `${0.7 + k * 0.4}s` }}><Icon name="check" size={13} /></span>
              </span>{t}
            </Card>
          ))}
        </div>
      </div>
    ),
  },
  {
    label: 'Work in progress', ms: 3000, sounds: [[400, 'tok'], [760, 'tok'], [1120, 'tok'], [1480, 'tok']],
    screen: (
      <div className="px-4">
        <Photo name="road-work" className="h-48" />
        <Card className="mt-3">
          <div className="flex items-center gap-2 text-[13px] font-medium text-ink"><Icon name="hammer" size={15} />Work has started. Crew uploaded 3 progress photos.</div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-paper-2"><div className="story-fill h-full rounded-full bg-sky" /></div>
        </Card>
      </div>
    ),
  },
  {
    label: 'Fixed', ms: 4200, sounds: [[500, 'chime']],
    screen: (
      <div className="px-4">
        <div className="relative"><Photo name="road-fixed" className="h-52" />
          <span className="story-stamp absolute bottom-4 right-4"><span className="stamp !text-[15px] !opacity-100 ![animation:none]"><Icon name="check" size={16} />Fixed</span></span>
        </div>
        <Card className="story-fade mt-3 [animation-delay:.9s]">
          <div className="display text-[20px] text-ink">2 December</div>
          <div className="mt-1 text-[13px] text-ink-2">Completed with photo evidence. 41 residents confirmed it is fixed.</div>
        </Card>
      </div>
    ),
  },
];

/** The hero's phone: plays a report's journey, from snapping a pothole to it being fixed, with optional sound. */
export function PhoneStory() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [sound, setSound] = useState(false);
  const [visible, setVisible] = useState(false);
  const [burst, setBurst] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce.current) setPlaying(false);
    const el = root.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el); return () => io.disconnect();
  }, []);

  // Play the current scene's sounds, then move on.
  useEffect(() => {
    const cur = STEPS[step];
    const timers: number[] = [];
    if (visible && sound) cur.sounds.forEach(([at, s]) => timers.push(window.setTimeout(() => play(s), at)));
    if (step === STEPS.length - 1 && visible) timers.push(window.setTimeout(() => setBurst((b) => b + 1), 500));
    if (playing && visible) timers.push(window.setTimeout(() => setStep((s) => (s + 1) % STEPS.length), cur.ms));
    return () => timers.forEach(clearTimeout);
  }, [step, playing, visible, sound]);

  const toggleSound = () => {
    if (sound) { disableSound(); setSound(false); return; }
    if (enableSound()) { setSound(true); setStep(0); setPlaying(true); }
  };

  return (
    <div ref={root} className="relative mx-auto w-full max-w-[340px]">
      <div className="relative">
        <span className="phone-btn left-[-3px] top-[104px] h-[26px] rounded-l-[3px]" aria-hidden />
        <span className="phone-btn left-[-3px] top-[150px] h-[48px] rounded-l-[3px]" aria-hidden />
        <span className="phone-btn left-[-3px] top-[208px] h-[48px] rounded-l-[3px]" aria-hidden />
        <span className="phone-btn right-[-3px] top-[168px] h-[78px] rounded-r-[3px]" aria-hidden />
        <div className="phone-band relative rounded-[58px] p-[3px] shadow-pop">
          <div className="rounded-[55px] bg-black p-[11px]">
            <div className="relative h-[640px] overflow-hidden rounded-[45px] bg-paper-2">
              <Confetti burst={burst} />
              <div className="pointer-events-none absolute inset-0 z-30 rounded-[45px] bg-[linear-gradient(115deg,rgb(255_255_255/.14)_0%,rgb(255_255_255/0)_38%)]" aria-hidden />
              <span className="absolute left-1/2 top-[11px] z-20 h-[30px] w-[96px] -translate-x-1/2 rounded-full bg-black" aria-hidden />
              <StatusBar />
              <div key={step} className="story-scene absolute inset-x-0 bottom-8 top-[56px] flex flex-col justify-center" aria-live="polite">
                <span className="sr-only">{STEPS[step].label}</span>
                {STEPS[step].screen}
              </div>
              <div className="absolute inset-x-0 bottom-2 flex justify-center" aria-hidden><span className="h-[5px] w-[118px] rounded-full bg-ink/85" /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Caption, progress and controls */}
      <div className="mt-6 text-center">
        <div key={step} className="story-caption display text-[24px] text-ink">{STEPS[step].label}</div>
        <div className="mt-3 flex justify-center gap-1.5" role="tablist" aria-label="Report journey steps">
          {STEPS.map((s, i) => (
            <button key={s.label} role="tab" aria-selected={i === step} aria-label={s.label} onClick={() => { setStep(i); setPlaying(false); }}
              className={cx('h-2 rounded-full transition-all duration-500', i === step ? 'w-7 bg-forest' : i < step ? 'w-2 bg-brand/50' : 'w-2 bg-ink/15 hover:bg-ink/30')} />
          ))}
        </div>
        <div className="mt-5 flex items-center justify-center gap-2">
          <button onClick={toggleSound} aria-pressed={sound}
            className={cx('inline-flex h-10 items-center gap-2 rounded-full px-4 text-[14px] font-medium transition-all duration-300 hover:-translate-y-0.5', sound ? 'bg-forest text-white' : 'bg-white text-ink ring-1 ring-line')}>
            <Icon name={sound ? 'volume' : 'mute'} size={17} />{sound ? 'Sound on' : 'Play with sound'}
          </button>
          <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause story' : 'Play story'}
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink ring-1 ring-line transition-all hover:-translate-y-0.5">
            <Icon name={playing ? 'pause' : 'play'} size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
