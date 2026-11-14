import type { Metadata } from 'next';
import { Icon } from '@/components/Icon';
import { CtaBand, GovPreview } from '@/components/sections';
import { Btn, Container, IconTile, PageHero, SectionHead, cx } from '@/components/ui';
import { appUrl, GOV_FEATURES } from '@/content/site';

export const metadata: Metadata = { title: 'For government', description: 'Triage, inspections, work orders and analytics for LGAs, state agencies, federal bodies and utilities.' };

const FLOW = [
  { icon: 'inbox', label: 'Triage', sub: 'Verify, de-duplicate, prioritise' },
  { icon: 'building', label: 'Assign', sub: 'Right department, auto-routed' },
  { icon: 'clipboard', label: 'Inspect', sub: 'Photos, GPS, outcome' },
  { icon: 'check', label: 'Approve', sub: 'Scope, budget, contractor' },
  { icon: 'wrench', label: 'Work order', sub: 'Schedule, progress, delays' },
  { icon: 'star', label: 'Complete', sub: 'Evidence, citizen confirmation' },
];

const REJECT = ['Duplicate', 'Insufficient information', 'Private property', 'Incorrect location', 'Not government responsibility', 'No longer exists', 'Outside jurisdiction', 'Spam'];

const AUDIT = [
  ['09:12', 'F. Adeyemi', 'verified', 'NW-LA-24817'],
  ['09:14', 'F. Adeyemi', 'assigned inspector B. Okafor to', 'NW-LA-24817'],
  ['11:40', 'B. Okafor', 'submitted inspection for', 'NW-LA-24817'],
  ['14:05', 'K. Bello', 'approved work order WO-1182 for', 'NW-LA-24817'],
];

export default function ForGovernment() {
  return (
    <>
      <PageHero icon="building" eyebrow="For LGAs, state agencies, federal bodies & utilities" title={<>Run the work. <span className="text-sun">Show the work.</span></>}
        body="NaijaWorks gives public works teams a practical system for triage, inspection, scheduling and repair, and turns every action into a clear public update automatically.">
        <Btn href={appUrl('/gov')} variant="sun" size="lg" icon="arrowR">Try the portal demo</Btn>
        <Btn href={appUrl('/inspector')} variant="outline-light" size="lg">Inspector app demo</Btn>
      </PageHero>

      <section className="relative -mt-10 pb-20 sm:pb-28">
        <Container><div className="mx-auto max-w-5xl" data-reveal><GovPreview /></div></Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <SectionHead center eyebrow={<><Icon name="layers" size={14} />One workflow</>} title="From report to proof of repair." body="Each stage has a clear owner and a clear next step, and each step writes to the citizen timeline." />
          <ol className="mt-12 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {FLOW.map((f, i) => (
              <li key={f.label} className="relative rounded-[24px] bg-white p-5 ring-1 ring-line" data-reveal style={{ ['--d' as string]: `${i * 70}ms` }}>
                <div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest text-sun"><Icon name={f.icon} size={20} /></span><span className="display text-3xl font-extrabold text-forest/10">0{i + 1}</span></div>
                <div className="mt-4 text-lg font-bold text-forest">{f.label}</div>
                <div className="mt-1 text-[13px] leading-snug text-ink-2">{f.sub}</div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-paper-2 py-20 sm:py-28">
        <Container>
          <SectionHead eyebrow={<><Icon name="tools" size={14} />What's inside</>} title="Built for operations." />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {GOV_FEATURES.map((f, i) => {
              const color = ['#0B7A4B', '#8B5CF6', '#C77700', '#0284C7', '#4F46E5', '#D9481F'][i];
              const lead = i === 0;
              return (
                <div key={f.title} className={cx('rounded-[28px] p-6 ring-1 sm:p-7', lead ? 'grid items-end gap-6 bg-forest text-white ring-forest md:col-span-2 md:grid-cols-[1fr_1.2fr] lg:row-span-2' : 'bg-white ring-line', i === GOV_FEATURES.length - 1 && 'md:col-span-2 lg:col-span-1')} data-reveal style={{ ['--d' as string]: `${(i % 3) * 80}ms` }}>
                  <div>
                    {lead ? <span className="grid h-[52px] w-[52px] place-items-center rounded-2xl bg-sun text-forest"><Icon name={f.icon} size={24} /></span> : <IconTile name={f.icon} color={color} size={52} />}
                    <h3 className={cx('mt-5 font-bold', lead ? 'text-2xl' : 'text-xl text-forest')}>{f.title}</h3>
                    <p className={cx('mt-2 text-[15px] leading-relaxed', lead ? 'text-white/70' : 'text-ink-2')}>{f.body}</p>
                  </div>
                  {lead && <TriageMock />}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Field apps */}
      <section className="relative overflow-hidden bg-forest py-20 text-white sm:py-28 grain">
        <div className="adire absolute inset-0" aria-hidden />
        <Container className="relative grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHead light eyebrow={<><Icon name="phone" size={14} />In the field</>} title="Big buttons. Works offline. Proof built in." body="Inspectors and maintenance crews get a mobile app made for sun, rain and patchy network. Photos are stamped with GPS and time automatically, and everything syncs when signal returns." />
            <ul className="mt-8 space-y-3" data-reveal>
              {['Today’s inspections, sorted by urgency', 'Navigate, start, photograph, assess, recommend', 'Progress updates without fake percentages', 'Report blockers and request extensions with a reason'].map((t) => (
                <li key={t} className="flex items-center gap-3 text-[16px]"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sun text-forest"><Icon name="check" size={15} /></span>{t}</li>
              ))}
            </ul>
          </div>
          <div className="mx-auto flex w-full max-w-md gap-4" data-reveal>
            <div className="flex-1 rounded-[32px] bg-white p-4 text-ink shadow-pop" style={{ transform: 'rotate(-3deg)' }}>
              <div className="text-[11px] font-bold uppercase tracking-wider text-ink-3">Inspection</div>
              <div className="mt-1 font-bold text-forest">Blocked drain, Ogunlana Dr.</div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-xl bg-paper p-2"><Icon name="pin" size={14} className="text-brand" /><div className="mt-1 font-semibold">6.5059, 3.3524</div></div>
                <div className="rounded-xl bg-paper p-2"><Icon name="clock" size={14} className="text-brand" /><div className="mt-1 font-semibold">11:40 · 18 Nov</div></div>
              </div>
              <div className="mt-3 text-[12px] font-semibold text-ink-2">Outcome</div>
              <div className="mt-1.5 space-y-1.5 text-[12px] font-semibold">
                {['Maintenance required', 'Repair required', 'Major project'].map((o, i) => <div key={o} className={cx('rounded-xl px-3 py-2', i === 1 ? 'bg-forest text-white' : 'bg-paper text-ink-2')}>{o}</div>)}
              </div>
              <div className="mt-3 rounded-xl bg-sun py-2.5 text-center text-[13px] font-bold text-forest">Submit inspection</div>
            </div>
            <div className="mt-10 flex-1 rounded-[32px] bg-white p-4 text-ink shadow-pop" style={{ transform: 'rotate(3deg)' }}>
              <div className="text-[11px] font-bold uppercase tracking-wider text-ink-3">Work order WO-1182</div>
              <div className="mt-1 font-bold text-forest">Resurface Adeola St.</div>
              <div className="mt-3 text-[12px] font-semibold text-ink-2">Progress</div>
              <div className="mt-1.5 grid grid-cols-4 gap-1">{[1, 1, 1, 0].map((on, i) => <span key={i} className={cx('h-2 rounded-full', on ? 'bg-sky' : 'bg-paper-2')} />)}</div>
              <div className="mt-1 text-[11px] text-ink-2">About 75% · on track</div>
              <div className="mt-3 rounded-xl bg-clay-soft p-2.5 text-[12px] text-clay"><b>Blocker:</b> heavy rain, resume Sat</div>
              <div className="mt-3 rounded-xl bg-brand py-2.5 text-center text-[13px] font-bold text-white">Mark complete</div>
              <div className="mt-1.5 text-center text-[10px] text-ink-3">Needs photos, date, note</div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] bg-white p-7 ring-1 ring-line sm:p-9" data-reveal>
            <IconTile name="x" color="#D9481F" size={52} />
            <h3 className="mt-5 text-2xl font-extrabold text-forest">Rejecting needs a reason.</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">Officers pick a reason, and the citizen gets a friendly explanation, never a silent &ldquo;closed&rdquo;.</p>
            <div className="mt-5 flex flex-wrap gap-2">{REJECT.map((r) => <span key={r} className="rounded-full bg-paper px-3 py-1.5 text-[13px] font-semibold text-ink-2">{r}</span>)}</div>
            <div className="mt-5 rounded-2xl bg-sky-soft p-4 text-[14px] text-forest">&ldquo;Thanks for reporting! This gate is on private property, so a public authority can&apos;t repair it. You could raise it with the estate management.&rdquo;</div>
          </div>
          <div className="rounded-[32px] bg-forest-2 p-7 text-white sm:p-9" data-reveal>
            <span className="grid h-[52px] w-[52px] place-items-center rounded-2xl bg-white/10 text-sun"><Icon name="shield" size={24} /></span>
            <h3 className="mt-5 text-2xl font-extrabold">Every action is on the record.</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-white/70">An audit log tracks each verification, assignment, approval and closure. Internal notes and budgets stay private; the public sees what matters.</p>
            <ul className="mt-5 space-y-2 font-mono text-[12px]">
              {AUDIT.map(([t, who, what, ref]) => <li key={t} className="flex gap-3 rounded-xl bg-white/5 px-3 py-2"><span className="text-sun">{t}</span><span className="text-white/85"><b>{who}</b> {what} <span className="text-white/50">{ref}</span></span></li>)}
            </ul>
          </div>
        </Container>
      </section>

      <section className="pb-4">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 rounded-[32px] bg-white p-7 ring-1 ring-line sm:p-10 lg:flex-row lg:items-center" data-reveal>
            <div>
              <h2 className="text-2xl font-extrabold text-forest sm:text-3xl">Ready to onboard your agency?</h2>
              <p className="mt-2 max-w-2xl text-[16px] text-ink-2">We set up jurisdictions, departments, routing rules and accounts for LGAs, state ministries, federal agencies, utilities and contractors. Integrations with your existing systems come through open APIs.</p>
            </div>
            <Btn href={appUrl('/gov')} size="lg" icon="arrowR">See the portal</Btn>
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}

/** Mini triage queue: ranked by safety and people affected, not by confirmations alone. */
function TriageMock() {
  const rows = [
    { icon: 'alert', title: 'Open manhole, Bode Thomas St.', meta: '2 reports · urgent safety', badge: 'Urgent', tone: 'bg-clay text-white' },
    { icon: 'waves', title: 'Blocked drain, Ogunlana Dr.', meta: '48 confirmations · 320 affected', badge: 'High', tone: 'bg-sun text-forest' },
    { icon: 'lamp', title: '9 streetlights out, Allen Ave.', meta: '63 confirmations · night safety', badge: 'High', tone: 'bg-sun text-forest' },
    { icon: 'road', title: 'Faded zebra crossing, Adeniran Ogunsanya', meta: '200 confirmations · low risk', badge: 'Normal', tone: 'bg-white/15 text-white' },
  ];
  return (
    <div className="rounded-[22px] bg-white/[.06] p-3 ring-1 ring-white/10" aria-label="Example triage queue" role="img">
      <div className="flex items-center justify-between px-2 pb-2 text-[12px] font-semibold text-white/60"><span>Triage queue · sorted by risk &amp; impact</span><span>4 of 42</span></div>
      <ul className="space-y-1.5">
        {rows.map((r) => (
          <li key={r.title} className="flex items-center gap-3 rounded-2xl bg-white/[.06] p-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-sun"><Icon name={r.icon} size={17} /></span>
            <span className="min-w-0 flex-1"><b className="block truncate text-[13px]">{r.title}</b><span className="block truncate text-[11px] text-white/55">{r.meta}</span></span>
            <span className={cx('shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold', r.tone)}>{r.badge}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
