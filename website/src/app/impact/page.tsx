import type { Metadata } from 'next';
import { Icon } from '@/components/Icon';
import { Scene } from '@/components/Scene';
import { CountUp } from '@/components/client';
import { CtaBand, StoryCard } from '@/components/sections';
import { Btn, ColorTile, Container, PageHero, SectionHead, cx } from '@/components/ui';
import { appUrl, IMPACT_TILES, STORIES } from '@/content/site';

export const metadata: Metadata = { title: 'Impact', description: 'Roads repaired, streetlights restored, drains cleared: see what Nigerian communities have fixed with NaijaWorks.' };

const FUNNEL = [
  { label: 'Reported', value: 12480, color: '#5B6B7F' },
  { label: 'Acknowledged', value: 11902, color: '#4F46E5' },
  { label: 'Inspected', value: 9870, color: '#8B5CF6' },
  { label: 'Scheduled', value: 8640, color: '#C77700' },
  { label: 'In progress', value: 7940, color: '#0284C7' },
  { label: 'Resolved & confirmed', value: 7215, color: '#15803D' },
];

const SCORE = [
  { label: 'Roads', v: 72 }, { label: 'Water', v: 58 }, { label: 'Electricity', v: 64 }, { label: 'Drainage', v: 49 }, { label: 'Streetlights', v: 81 }, { label: 'Waste', v: 70 },
];

export default function Impact() {
  const top = FUNNEL[0].value;
  return (
    <>
      <PageHero icon="star" eyebrow="Community impact" title={<>Small reports. <span className="text-sun">Visible change.</span></>}
        body="Every number here started with one person taking a photo. Celebrate the fixes, and see honestly where things are still stuck.">
        <Btn href={appUrl('/data')} variant="sun" size="lg" icon="arrowR">Open the public data</Btn>
      </PageHero>

      <section className="py-20 sm:py-24">
        <Container>
          {/* Bento: one hero tile with the repaired road, five colour-coded tiles around it */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:grid-rows-3">
            {IMPACT_TILES.map((t, i) => {
              const hero = i === 0;
              return (
                <ColorTile key={t.label} mood={t.mood} icon={t.icon} big={hero} style={{ ['--d' as string]: `${(i % 3) * 80}ms` }}
                  className={cx(hero && 'col-span-2 lg:row-span-2', i === IMPACT_TILES.length - 1 && 'col-span-2 lg:col-span-1')}>
                  <div className={cx('display mt-auto pt-8 font-normal leading-none tracking-tight', hero ? 'text-[64px] sm:text-[96px]' : 'text-[44px] sm:text-[56px]')}><CountUp value={t.value} /></div>
                  <div className={cx('mt-2 font-medium opacity-80', hero ? 'text-[18px]' : 'text-[15px]')}>{t.label}</div>
                  {hero && (
                    <div className="relative mt-6 hidden h-44 overflow-hidden rounded-2xl ring-1 ring-black/5 sm:block [&_.scene]:h-full [&_.scene]:w-full">
                      <Scene name="road-fixed" label="" />
                      <span className="absolute bottom-4 right-4"><span className="stamp"><Icon name="check" size={14} />Fixed</span></span>
                    </div>
                  )}
                </ColorTile>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-paper-2 py-20 sm:py-28">
        <Container>
          <SectionHead tone="sun" eyebrow={<><Icon name="eye" size={14} />Before → After</>} title="Drag to see the transformation." body="Citizen photo on the left, the completion photo from the works team on the right." />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {STORIES.map((s) => <StoryCard key={s.place} s={s} />)}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow={<><Icon name="chart" size={14} />Transparency</>} title="Where reports are on the journey." body="Not every report gets fixed quickly. Showing every stage keeps everyone honest, including us." />
            <div className="mt-8 space-y-3" data-reveal>
              {FUNNEL.map((f) => (
                <div key={f.label}>
                  <div className="mb-1.5 flex justify-between text-[14px]"><span className="font-semibold text-ink">{f.label}</span><span className="tabular-nums text-ink-2">{f.value.toLocaleString('en-NG')} · {Math.round((f.value / top) * 100)}%</span></div>
                  <div className="h-4 overflow-hidden rounded-full bg-paper-2"><div className="h-full rounded-full" style={{ width: `${(f.value / top) * 100}%`, background: f.color }} /></div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center" data-reveal>
              {[['1.4 days', 'to acknowledge'], ['6 days', 'to inspect'], ['19 days', 'to resolve']].map(([v, l]) => (
                <div key={l} className="rounded-2xl bg-white p-4 ring-1 ring-line"><div className="display text-2xl font-medium text-ink">{v}</div><div className="text-[12px] text-ink-2">median {l}</div></div>
              ))}
            </div>
          </div>
          <div className="rounded-[24px] bg-forest p-6 text-white sm:p-8" data-reveal>
            <div className="flex items-start justify-between gap-4">
              <div><div className="text-[13px] font-semibold text-white/60">Community page</div><h3 className="mt-1 text-3xl font-medium">Surulere</h3><div className="text-[14px] text-white/60">Lagos · 41 open · 12 being worked on</div></div>
              <div className="relative grid h-24 w-24 shrink-0 place-items-center">
                <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden><circle cx="18" cy="18" r="15.5" fill="none" stroke="rgb(255 255 255 / .12)" strokeWidth="4" /><circle cx="18" cy="18" r="15.5" fill="none" stroke="#F5B301" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${0.67 * 97.4} 97.4`} /></svg>
                <div className="text-center"><div className="display text-2xl font-medium">67</div><div className="text-[10px] text-white/60">score</div></div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
              {SCORE.map((s) => (
                <div key={s.label}><div className="flex justify-between text-[13px]"><span className="text-white/75">{s.label}</span><span className="font-bold">{s.v}</span></div><div className="mt-1 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-sun" style={{ width: `${s.v}%` }} /></div></div>
              ))}
            </div>
            <p className="mt-6 flex gap-2 rounded-2xl bg-white/5 p-4 text-[13px] leading-relaxed text-white/75"><Icon name="info" size={16} className="mt-0.5 shrink-0 text-sun" />The community score reflects reports and platform data only. It is not an absolute measure of government performance.</p>
          </div>
        </Container>
      </section>

      <section id="limits" className="scroll-mt-24 pb-4">
        <Container>
          <div className="grid gap-6 rounded-[24px] bg-sun-soft p-7 sm:p-10 lg:grid-cols-[auto_1fr]" data-reveal>
            <span className="grid h-14 w-14 place-items-center rounded-full bg-sun text-ink"><Icon name="alert" size={26} /></span>
            <div>
              <h2 className="text-2xl font-medium text-ink sm:text-3xl">About our data, honestly.</h2>
              <ul className="mt-4 grid gap-3 text-[15px] leading-relaxed text-[#5C4100] md:grid-cols-3">
                <li>Areas where more people use NaijaWorks will show more reports. That doesn&apos;t mean they have more problems.</li>
                <li>We don&apos;t rank states, LGAs or officials against each other. Different reporting levels make that unfair.</li>
                <li>&ldquo;Resolved&rdquo; needs completion evidence and community confirmation. Disputed fixes are reviewed again.</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
