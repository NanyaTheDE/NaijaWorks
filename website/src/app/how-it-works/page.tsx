import type { Metadata } from 'next';
import { Icon } from '@/components/Icon';
import { CtaBand } from '@/components/sections';
import { StatusCards } from '@/components/status-cards';
import { JourneyTimeline } from '@/components/journey';
import { Btn, Container, IconTile, PageHero, SectionHead, cx } from '@/components/ui';
import { appUrl, PRINCIPLES } from '@/content/site';

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
        <Btn href={appUrl('/report')} variant="sun" size="lg" icon="arrowR">Report an issue</Btn>
        <Btn href="#statuses" variant="ghost" size="lg">What each status means</Btn>
      </PageHero>

      {/* Journey timeline */}
      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHead eyebrow={<><Icon name="clock" size={14} />A real-looking timeline</>} title="One pothole, twenty days, total visibility." body="This is what a resolved report on Adeola Street looks like. Each government action adds a dated entry, so you always know what has happened and what should happen next." />
            <div className="mt-8 rounded-[20px] bg-white p-6 shadow-soft ring-1 ring-line" data-reveal>
              <div className="text-[13px] font-semibold text-ink-3">After you submit, you&apos;ll see</div>
              <dl className="mt-4 space-y-3 text-[15px]">
                {[['Reference', 'NW-LA-24817'], ['Likely responsible', 'Lagos State Public Works'], ['Next expected update', 'Within 3 working days']].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0"><dt className="text-ink-2">{k}</dt><dd className="text-right font-medium text-ink">{v}</dd></div>
                ))}
              </dl>
            </div>
          </div>
          <JourneyTimeline extra={{
            4: (
              <div className="mt-5 rounded-2xl bg-sun-soft p-4 text-[14px] text-[#5C4100]">
                <div className="flex items-center gap-2 font-semibold"><Icon name="cloudrain" size={16} />Rescheduled</div>
                <div className="mt-2 grid grid-cols-2 gap-3"><div><div className="text-[12px] opacity-70">Original date</div><div className="font-medium line-through">25 Nov</div></div><div><div className="text-[12px] opacity-70">New date</div><div className="font-medium">30 Nov</div></div></div>
                <div className="mt-2">Reason: heavy rainfall made asphalt work unsafe.</div>
              </div>
            ),
          }} />
        </Container>
      </section>

      {/* Roles */}
      <section className="bg-paper-2 py-20 sm:py-28">
        <Container>
          <SectionHead center eyebrow={<><Icon name="users" size={14} />Who does what</>} title="Four people, one journey." body="NaijaWorks connects the people who spot problems with the people who fix them. Everyone sees the part they need." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROLES.map((r, i) => (
              <div key={r.name} className="lift rounded-[20px] bg-white p-6 ring-1 ring-line" data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
                <IconTile name={r.icon} color={r.color} size={54} />
                <h3 className="mt-5 text-xl font-medium text-ink">{r.name}</h3>
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
          <div className="mt-10"><StatusCards /></div>
        </Container>
      </section>

      {/* Confirmation */}
      <section className="py-20 sm:py-28">
        <Container className="grid items-center gap-12 border-t border-line pt-14 lg:grid-cols-2">
          <SectionHead eyebrow={<><Icon name="check" size={14} />The final word is yours</>} title="“Has this actually been fixed?”" body="When officials mark work complete with photos, people nearby are asked to confirm. If several credible residents say the problem remains, the report moves to Resolution under review and goes back to the department." />
          <div className="panel-indigo rounded-[24px] p-6 sm:p-10" data-reveal><div className="glass mx-auto w-full max-w-md rounded-2xl p-6 text-ink">
            <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-brand"><Icon name="lamp" size={22} /></span><div><div className="font-medium text-ink">Streetlights, Allen Avenue</div><div className="text-[13px] text-ink-2">Marked complete 14 Nov · 3 photos</div></div></div>
            <div className="mt-5 space-y-2">
              {[['Yes, it is fixed', 'bg-forest text-white', 'check'], ['Partially fixed', 'bg-white text-ink ring-1 ring-line', 'dots'], ['No, the problem remains', 'bg-white text-clay ring-1 ring-line', 'x'], ['I cannot confirm', 'bg-white text-ink-2 ring-1 ring-line', 'eye']].map(([t, c, ic]) => (
                <div key={t} className={cx('flex items-center gap-3 rounded-full px-4 py-3 font-medium', c)}><Icon name={ic} size={18} />{t}</div>
              ))}
            </div>
          </div></div>
        </Container>
      </section>

      {/* Privacy */}
      <section id="privacy" className="scroll-mt-24 py-20 sm:py-28">
        <Container>
          <SectionHead center eyebrow={<><Icon name="lock" size={14} />Trust & safety</>} title="Safe to speak up." body="An infrastructure platform, not a political battleground. Moderation blocks harassment, doxxing, false accusations and campaigning." />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <div key={p.title} className="flex gap-5 rounded-[20px] bg-white p-6 ring-1 ring-line sm:p-7" data-reveal style={{ ['--d' as string]: `${(i % 2) * 80}ms` }}>
                <IconTile name={p.icon} color={['#0B7A4B', '#D9481F', '#0284C7', '#8B5CF6'][i]} size={52} />
                <div><h3 className="text-xl font-medium text-ink">{p.title}</h3><p className="mt-2 text-[15px] leading-relaxed text-ink-2">{p.body}</p></div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 rounded-[20px] bg-white p-6 ring-1 ring-line sm:grid-cols-3 sm:p-7" data-reveal>
            <div className="text-[13px] font-bold uppercase tracking-wider text-ink-3 sm:col-span-3">How you appear on public reports</div>
            {[['Show my first name', '“Reported by Amaka”'], ['Show as community member', '“Reported by a Surulere resident”'], ['Keep me private', '“Reported by a citizen”']].map(([a, b], i) => (
              <div key={a} className={cx('rounded-2xl p-4', i === 1 ? 'bg-forest text-white' : 'bg-paper-2')}><div className="font-bold">{a}</div><div className={cx('mt-1 text-[14px]', i === 1 ? 'text-white/70' : 'text-ink-2')}>{b}</div></div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
