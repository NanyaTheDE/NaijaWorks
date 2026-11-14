import type { Metadata } from 'next';
import { Icon } from '@/components/Icon';
import { CtaBand } from '@/components/sections';
import { Btn, Container, IconTile, PageHero, SectionHead, cx } from '@/components/ui';
import { APP_URL, GROUP_COLOR, JOURNEY, PRINCIPLES, STATUSES } from '@/content/site';

export const metadata: Metadata = { title: 'How it works', description: 'From a photo of a pothole to a confirmed repair: every step of a NaijaWorks report.' };

const ROLES = [
  { icon: 'user', color: '#C77700', name: 'You, the citizen', does: ['Report in about two minutes', 'Confirm issues others reported', 'Follow progress and get updates', 'Say whether it is really fixed'] },
  { icon: 'building', color: '#0B7A4B', name: 'Government officer', does: ['Verify and prioritise reports', 'Assign the right department', 'Approve work and set dates', 'Post public updates'] },
  { icon: 'clipboard', color: '#8B5CF6', name: 'Field inspector', does: ['Visit the site', 'Capture photos, GPS and time', 'Assess severity and scope', 'Recommend the action'] },
  { icon: 'hammer', color: '#0284C7', name: 'Contractor or works team', does: ['See assigned jobs', 'Share progress photos', 'Report blockers honestly', 'Complete with evidence'] },
];

export default function HowItWorks() {
  return (
    <>
      <PageHero icon="layers" eyebrow="How it works" title={<>From &ldquo;see am&rdquo; to <span className="text-sun">&ldquo;e don fix&rdquo;</span>.</>}
        body="Every report has a visible journey, like tracking a parcel. Here is what happens after you tap Submit, who is responsible at each step, and what comes next.">
        <Btn href={`${APP_URL}/report`} variant="sun" size="lg" icon="arrowR">Report an issue</Btn>
        <Btn href="#statuses" variant="outline-light" size="lg">What each status means</Btn>
      </PageHero>

      {/* Journey timeline */}
      <section className="py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead eyebrow={<><Icon name="clock" size={14} />A real-looking timeline</>} title="One pothole, twenty days, total visibility." body="This is what a resolved report on Adeola Street looks like. Each government action adds a dated entry, so you always know what has happened and what should happen next." />
            <div className="mt-8 rounded-[28px] bg-white p-6 shadow-soft ring-1 ring-line" data-reveal>
              <div className="text-[13px] font-semibold text-ink-3">After you submit, you&apos;ll see</div>
              <dl className="mt-4 space-y-3 text-[15px]">
                {[['Reference', 'NW-LA-24817'], ['Likely responsible', 'Lagos State Public Works'], ['Next expected update', 'Within 3 working days']].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0"><dt className="text-ink-2">{k}</dt><dd className="text-right font-bold text-forest">{v}</dd></div>
                ))}
              </dl>
            </div>
          </div>
          <ol className="relative">
            <span className="absolute bottom-6 left-[27px] top-6 w-1 rounded-full bg-gradient-to-b from-brand via-sun to-brand" aria-hidden />
            {JOURNEY.map((j, i) => (
              <li key={j.key} className="relative flex gap-5 pb-6 last:pb-0" data-reveal style={{ ['--d' as string]: `${i * 60}ms` }}>
                <span className={cx('relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl ring-4 ring-paper', i === JOURNEY.length - 1 ? 'bg-brand text-white' : 'bg-white text-forest shadow-soft')}><Icon name={j.icon} size={22} /></span>
                <div className="flex-1 rounded-[24px] bg-white p-5 ring-1 ring-line">
                  <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-lg font-bold text-forest">{j.label}</h3><span className="rounded-full bg-paper px-3 py-1 text-[13px] font-semibold text-ink-2">{j.date}</span></div>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{j.text}</p>
                  <div className="mt-2 text-[13px] font-semibold text-ink-3">{j.who}</div>
                  {i === 4 && (
                    <div className="mt-4 rounded-2xl bg-sun-soft p-4 text-[14px] text-[#5C4100]">
                      <div className="flex items-center gap-2 font-bold"><Icon name="cloudrain" size={16} />Rescheduled</div>
                      <div className="mt-2 grid grid-cols-2 gap-3"><div><div className="text-[12px] opacity-70">Original date</div><div className="font-semibold line-through">25 Nov</div></div><div><div className="text-[12px] opacity-70">New date</div><div className="font-semibold">30 Nov</div></div></div>
                      <div className="mt-2">Reason: heavy rainfall made asphalt work unsafe.</div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Roles */}
      <section className="bg-paper-2 py-20 sm:py-28">
        <Container>
          <SectionHead center eyebrow={<><Icon name="users" size={14} />Who does what</>} title="Four people, one journey." body="NaijaWorks connects the people who spot problems with the people who fix them. Everyone sees the part they need." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROLES.map((r, i) => (
              <div key={r.name} className="rounded-[28px] bg-white p-6 ring-1 ring-line" data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
                <IconTile name={r.icon} color={r.color} size={54} />
                <h3 className="mt-5 text-xl font-bold text-forest">{r.name}</h3>
                <ul className="mt-4 space-y-2.5">
                  {r.does.map((d) => <li key={d} className="flex gap-2.5 text-[15px] text-ink-2"><Icon name="check" size={18} className="mt-0.5 text-brand" />{d}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Statuses */}
      <section id="statuses" className="scroll-mt-24 py-20 sm:py-28">
        <Container>
          <SectionHead eyebrow={<><Icon name="info" size={14} />No vague &ldquo;Pending&rdquo;</>} title="Every status says what it means and what's next." body="Statuses are colour-coded, but always come with an icon and words, so they work for everyone." />
          <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {STATUSES.map((s, i) => {
              const c = GROUP_COLOR[s.group];
              return (
                <div key={s.name} className="relative overflow-hidden rounded-[24px] bg-white p-5 ring-1 ring-line" data-reveal style={{ ['--d' as string]: `${(i % 3) * 70}ms` }}>
                  <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: c }} aria-hidden />
                  <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-bold" style={{ background: `color-mix(in srgb, ${c} 12%, white)`, color: c }}><span className="h-2 w-2 rounded-full" style={{ background: c }} />{s.name}</span>
                  <p className="mt-3 text-[15px] font-medium text-forest">{s.meaning}</p>
                  <div className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[13px]"><span className="text-ink-3">Who</span><span className="text-ink-2">{s.who}</span><span className="text-ink-3">Next</span><span className="text-ink-2">{s.next}</span></div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Confirmation */}
      <section className="relative overflow-hidden bg-forest py-20 text-white sm:py-28 grain">
        <div className="adire absolute inset-0" aria-hidden />
        <Container className="relative grid items-center gap-12 lg:grid-cols-2">
          <SectionHead light eyebrow={<><Icon name="check" size={14} />The final word is yours</>} title="“Has this actually been fixed?”" body="When officials mark work complete with photos, people nearby are asked to confirm. If several credible residents say the problem remains, the report moves to Resolution under review and goes back to the department." />
          <div className="mx-auto w-full max-w-md rounded-[32px] bg-white p-6 text-ink shadow-pop" data-reveal>
            <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-brand"><Icon name="lamp" size={22} /></span><div><div className="font-bold text-forest">Streetlights, Allen Avenue</div><div className="text-[13px] text-ink-2">Marked complete 14 Nov · 3 photos</div></div></div>
            <div className="mt-5 space-y-2">
              {[['Yes, it is fixed', 'bg-brand text-white', 'check'], ['Partially fixed', 'bg-sun-soft text-[#5C4100]', 'dots'], ['No, the problem remains', 'bg-clay-soft text-clay', 'x'], ['I cannot confirm', 'bg-paper text-ink-2', 'eye']].map(([t, c, ic]) => (
                <div key={t} className={cx('flex items-center gap-3 rounded-2xl px-4 py-3.5 font-semibold', c)}><Icon name={ic} size={18} />{t}</div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Privacy */}
      <section id="privacy" className="scroll-mt-24 py-20 sm:py-28">
        <Container>
          <SectionHead center eyebrow={<><Icon name="lock" size={14} />Trust & safety</>} title="Safe to speak up." body="An infrastructure platform, not a political battleground. Moderation blocks harassment, doxxing, false accusations and campaigning." />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <div key={p.title} className="flex gap-5 rounded-[28px] bg-white p-6 ring-1 ring-line sm:p-7" data-reveal style={{ ['--d' as string]: `${(i % 2) * 80}ms` }}>
                <IconTile name={p.icon} color={['#0B7A4B', '#D9481F', '#0284C7', '#8B5CF6'][i]} size={52} />
                <div><h3 className="text-xl font-bold text-forest">{p.title}</h3><p className="mt-2 text-[15px] leading-relaxed text-ink-2">{p.body}</p></div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 rounded-[28px] bg-white p-6 ring-1 ring-line sm:grid-cols-3 sm:p-7" data-reveal>
            <div className="text-[13px] font-bold uppercase tracking-wider text-ink-3 sm:col-span-3">How you appear on public reports</div>
            {[['Show my first name', '“Reported by Amaka”'], ['Show as community member', '“Reported by a Surulere resident”'], ['Keep me private', '“Reported by a citizen”']].map(([a, b], i) => (
              <div key={a} className={cx('rounded-2xl p-4', i === 1 ? 'bg-forest text-white' : 'bg-paper')}><div className="font-bold">{a}</div><div className={cx('mt-1 text-[14px]', i === 1 ? 'text-white/70' : 'text-ink-2')}>{b}</div></div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
