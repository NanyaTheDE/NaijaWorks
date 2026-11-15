'use client';
import { useRef, type ReactNode } from 'react';
import { Icon } from './Icon';
import { Scene } from './Scene';
import { cx } from './ui';
import { GROUP_COLOR, STATUSES } from '@/content/site';

/* Small overlay pieces, in the style of app UI laid over a photo. */
const Chip = ({ icon, children, className, tone = 'ink' }: { icon: string; children?: ReactNode; className?: string; tone?: 'ink' | 'clay' | 'brand' }) => (
  <span className={cx('glass absolute inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium text-ink', className)}>
    <span className={cx('grid h-7 w-7 place-items-center rounded-xl text-white', tone === 'clay' ? 'bg-clay' : tone === 'brand' ? 'bg-brand' : 'bg-forest')}><Icon name={icon} size={15} /></span>
    {children}
  </span>
);
/** Selection frame with corner handles, like a crop tool. */
const Frame = ({ className }: { className: string }) => (
  <span className={cx('absolute border-[1.5px] border-white/90', className)} aria-hidden>
    {['-left-1 -top-1', '-right-1 -top-1', '-left-1 -bottom-1', '-right-1 -bottom-1'].map((p) => <span key={p} className={cx('absolute h-2 w-2 border border-forest bg-white', p)} />)}
  </span>
);

const ART: Record<string, { scene: string; overlay: ReactNode }> = {
  'Reported': { scene: 'road', overlay: <><Frame className="inset-x-[16%] bottom-[14%] top-[54%]" /><Chip icon="camera" className="left-4 top-4">NW-LA-24817</Chip></> },
  'Under review': {
    scene: 'drainage', overlay: <>
      <span className="absolute left-1/2 top-[58%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white shadow-[0_8px_30px_rgb(0_0_0/.25),inset_0_0_0_999px_rgb(255_255_255/.12)]" aria-hidden />
      <span className="absolute left-[calc(50%+38px)] top-[calc(58%+38px)] h-12 w-3 -rotate-45 rounded-full bg-white shadow" aria-hidden />
      <Chip icon="search" className="left-4 top-4" />
    </>,
  },
  'Verified': { scene: 'road', overlay: <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"><span className="stamp !text-[16px]"><Icon name="shield" size={18} />Verified</span></span> },
  'Assigned': { scene: 'streetlight', overlay: <Chip icon="building" className="inset-x-4 bottom-4">Lagos State Public Works</Chip> },
  'Inspection scheduled': { scene: 'drainage', overlay: <Chip icon="calendar" className="left-4 top-4">16 Nov · 9am–12pm</Chip> },
  'Inspected': {
    scene: 'road', overlay: <>
      <span className="absolute left-[34%] top-[60%] grid h-10 w-10 -translate-x-1/2 -translate-y-full place-items-center rounded-full bg-clay text-white shadow-lg ring-4 ring-white/70"><Icon name="pin" size={18} /></span>
      <Chip icon="clipboard" className="bottom-4 left-4">6.5059, 3.3524</Chip>
    </>,
  },
  'Work planned': {
    scene: 'road-work', overlay: <span className="glass absolute inset-x-4 bottom-4 rounded-xl p-3 text-[12px] text-ink">
      <span className="block font-semibold">Work order WO-1182</span>
      <span className="mt-1 block text-ink-2">Resurface Adeola St.</span>
    </span>,
  },
  'Scheduled': { scene: 'road-work', overlay: <Chip icon="calendar" className="right-4 top-4">30 Nov</Chip> },
  'In progress': {
    scene: 'road-work', overlay: <span className="glass absolute inset-x-4 bottom-4 rounded-xl p-3">
      <span className="flex items-center gap-2 text-[12px] font-medium text-ink"><Icon name="hammer" size={14} />About 75% · on track</span>
      <span className="mt-2 grid grid-cols-4 gap-1">{[1, 1, 1, 0].map((on, i) => <span key={i} className={cx('h-1.5 rounded-full', on ? 'bg-sky' : 'bg-ink/10')} />)}</span>
    </span>,
  },
  'Completed': {
    scene: 'road', overlay: <>
      <span className="absolute inset-y-0 left-1/2 right-0 overflow-hidden" aria-hidden><span className="absolute inset-y-0 right-0 block w-[200%]"><Scene name="road-fixed" label="" /></span></span>
      <span className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-white shadow" aria-hidden />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"><span className="stamp"><Icon name="check" size={14} />Fixed</span></span>
    </>,
  },
  'Monitoring': { scene: 'streetlight-fixed', overlay: <Chip icon="eye" className="left-4 top-4" tone="brand" /> },
  'Reopened': { scene: 'waste', overlay: <Chip icon="refresh" className="inset-x-4 bottom-4" tone="clay">No, the problem remains</Chip> },
  'Unable to proceed': { scene: 'flooding', overlay: <Chip icon="pause" className="inset-x-4 bottom-4" tone="clay">heavy rain, resume Sat</Chip> },
};

export function StatusCards() {
  const row = useRef<HTMLDivElement>(null);
  const nudge = (dir: 1 | -1) => row.current?.scrollBy({ left: dir * (row.current.clientWidth * 0.8), behavior: 'smooth' });
  return (
    <div className="relative">
      <div className="mb-6 flex justify-end gap-2">
        {([-1, 1] as const).map((d) => (
          <button key={d} onClick={() => nudge(d)} aria-label={d < 0 ? 'Previous statuses' : 'More statuses'}
            className="grid h-10 w-10 place-items-center rounded-full text-ink ring-1 ring-line transition-colors hover:bg-paper-2">
            <Icon name={d < 0 ? 'arrowL' : 'arrowR'} size={18} />
          </button>
        ))}
      </div>
      <div ref={row} className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:-mx-8 lg:scroll-px-8 lg:px-8 [&::-webkit-scrollbar]:hidden" role="list" aria-label="Report statuses">
        {STATUSES.map((s) => {
          const art = ART[s.name];
          const c = GROUP_COLOR[s.group];
          return (
            <article key={s.name} role="listitem" className="group w-[272px] shrink-0 snap-start sm:w-[300px]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-paper-2 transition-transform duration-500 ease-out group-hover:-translate-y-1.5 [&_.scene]:transition-transform [&_.scene]:duration-700 group-hover:[&_.scene]:scale-105">
                <span className="absolute inset-0 [&_.scene]:h-full [&_.scene]:w-full" aria-hidden><Scene name={art?.scene ?? 'road'} label="" /></span>
                {art?.overlay}
              </div>
              <div className="mt-5 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: c }} aria-hidden />
                <h3 className="text-[22px] font-normal text-ink">{s.name}</h3>
              </div>
              <p className="mt-1.5 text-[15px] leading-snug text-ink-2">{s.meaning}</p>
              <p className="mt-2 text-[13px] text-ink-3"><span className="font-medium text-ink-2">Next</span> · {s.next}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
