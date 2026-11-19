import type { Metadata } from 'next';
import { Icon } from '@/components/Icon';
import { RouteExplainer } from '@/components/client';
import { CtaBand } from '@/components/sections';
import { Btn, Container, PageHero, SectionHead, cx } from '@/components/ui';
import { appUrl, LEVELS } from '@/content/site';

export const metadata: Metadata = { title: 'Who handles what', description: 'Federal, state, Local Government and utilities: who usually fixes what in Nigeria, explained simply.' };

const TRANSFER = [
  { date: '14 Nov', text: 'Initially sent to Ikeja LGA.', icon: 'building', tone: 'bg-paper-2 text-ink-2' },
  { date: '15 Nov', text: 'Transferred to Lagos State Public Works because Obafemi Awolowo Way is state-managed.', icon: 'refresh', tone: 'bg-sun-soft text-[#5C4100]' },
  { date: '15 Nov', text: 'Accepted by Lagos State Public Works. Inspection to be scheduled.', icon: 'check', tone: 'bg-brand-soft text-brand' },
];

export default function WhoHandlesWhat() {
  return (
    <>
      <PageHero icon="book" eyebrow="Civic 101" title={<>Who fixes what, <span className="text-sun">in plain words</span>.</>}
        body="Nigeria has federal, state and local government, plus utilities and regulators. You don't need to memorise any of it to report a problem. But if you're curious, here is the simple version.">
        <Btn href="#explainer" variant="sun" size="lg" icon="arrowR">Try &ldquo;Who fixes this?&rdquo;</Btn>
      </PageHero>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHead eyebrow={<><Icon name="layers" size={14} />The four layers</>} title="Closest to furthest." body="Generally, the bigger and busier the infrastructure, the higher the level of government that owns it. There are local exceptions, which is why NaijaWorks checks each location." />
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[...LEVELS].reverse().map((l, i) => (
              <div key={l.key} className="lift group flex flex-col overflow-hidden rounded-[20px] bg-white ring-1 ring-line" data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
                <div className="tint-card relative border-b border-line p-6" style={{ ['--tint' as string]: l.color }}>
                  <span className="grid h-11 w-11 place-items-center rounded-full text-white transition-transform duration-300 group-hover:rotate-[-8deg]" style={{ background: l.color }}><Icon name={l.icon} size={22} /></span>
                  <h3 className="mt-5 text-[26px] font-medium text-ink">{l.name}</h3>
                  <p className="mt-1 text-[15px] text-ink-2">{l.blurb}</p>
                </div>
                <ul className="flex-1 space-y-3 p-6">
                  {l.items.map((it) => <li key={it} className="flex gap-2.5 text-[15px] text-ink"><span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ background: l.color }} />{it}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="explainer" className="scroll-mt-24 bg-paper-2 py-20 sm:py-28">
        <Container>
          <div className="mb-12"><SectionHead eyebrow={<><Icon name="sparkle" size={14} />Interactive</>} title="Who fixes this?" body="Pick a common problem to see who usually handles it and why." /></div>
          <RouteExplainer />
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow={<><Icon name="refresh" size={14} />Routing, in the open</>} title="Sent to the wrong office? You'll see the fix." body="Our routing engine uses the issue type, exact location, road ownership, LGA, state and utility service areas. When it isn't sure, a person reviews it. Every transfer is shown with a reason." />
            <div className="mt-8 grid grid-cols-2 gap-3" data-reveal>
              {[['Automatically assigned', 'bg-brand-soft text-brand'], ['Needs routing review', 'bg-sun-soft text-[#5C4100]'], ['Transferred', 'bg-sky-soft text-sky'], ['Joint responsibility', 'bg-[#EEE9FE] text-violet']].map(([t, c]) => (
                <div key={t} className={cx('rounded-2xl px-4 py-3 text-[14px] font-bold', c)}>{t}</div>
              ))}
            </div>
          </div>
          <ol className="space-y-3 rounded-[20px] bg-white p-5 shadow-soft ring-1 ring-line sm:p-7" data-reveal>
            <li className="mb-2 text-[13px] font-semibold text-ink-3">Report NW-LA-31002 · Collapsed kerb, Obafemi Awolowo Way</li>
            {TRANSFER.map((t) => (
              <li key={t.text} className={cx('flex gap-4 rounded-2xl p-4', t.tone)}>
                <Icon name={t.icon} size={20} className="mt-0.5" />
                <div><div className="text-[12px] font-bold uppercase tracking-wider opacity-70">{t.date}</div><div className="mt-0.5 text-[15px] font-semibold">{t.text}</div></div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="pb-4">
        <Container>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="panel-sun rounded-[24px] p-7 sm:p-9" data-reveal>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-forest text-white"><Icon name="crane" size={24} /></span>
              <h3 className="mt-5 text-2xl font-medium text-ink">Abandoned or stalled project?</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-ink-2">There is a special report type for public projects that have stopped: how long work appears paused, its condition now, and how it affects your community.</p>
              <div className="mt-6"><Btn href={appUrl('/report')} variant="sun" icon="arrowR">Report a stalled project</Btn></div>
            </div>
            <div className="rounded-[24px] bg-clay-soft p-7 sm:p-9" data-reveal>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-clay text-white"><Icon name="bolt" size={24} /></span>
              <h3 className="mt-5 text-2xl font-medium text-ink">Electricity is tricky. We handle it.</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-ink-2">A fallen pole goes to your distribution company, a dark streetlight to whoever owns the road, a billing complaint to the regulator. NaijaWorks works out which. For exposed live wires, keep away and call 112.</p>
            </div>
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
