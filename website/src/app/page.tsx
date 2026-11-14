import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { CountUp, HeroCopy, RouteExplainer, TrackerDemo } from '@/components/client';
import { CategoryMarquee, CtaBand, GovPreview, StoryCard } from '@/components/sections';
import { Btn, Container, IconTile, SectionHead, cx } from '@/components/ui';
import { ACCESS, APP_URL, BADGES, FAQ, FOUR_QUESTIONS, QUOTES, STATS, STORIES } from '@/content/site';

const TONE: Record<string, { bg: string; fg: string; ring: string }> = {
  sun: { bg: 'bg-sun', fg: 'text-forest', ring: 'bg-white/40' },
  brand: { bg: 'bg-brand', fg: 'text-white', ring: 'bg-white/15' },
  sky: { bg: 'bg-sky-soft', fg: 'text-forest', ring: 'bg-white' },
  clay: { bg: 'bg-clay-soft', fg: 'text-forest', ring: 'bg-white' },
};

export default function Home() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden pt-28 sm:pt-32">
        <div className="adire-ink absolute inset-0 opacity-60" aria-hidden />
        <div className="absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-sun/30 blur-3xl" aria-hidden />
        <div className="absolute -left-40 top-80 h-[420px] w-[420px] rounded-full bg-brand/15 blur-3xl" aria-hidden />
        <Container className="relative grid items-center gap-14 pb-16 lg:grid-cols-[1.15fr_1fr] lg:pb-24">
          <div>
            <HeroCopy />
            <div className="mt-9 flex flex-wrap gap-3">
              <Btn href={`${APP_URL}/report`} size="lg" icon="arrowR">Report an issue</Btn>
              <Btn href="/how-it-works" size="lg" variant="ghost">See how it works</Btn>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[14px] font-medium text-ink-2">
              {[['check', 'Free for citizens'], ['wifi', 'Works on low data'], ['lock', 'Stay anonymous if you like']].map(([ic, t]) => (
                <li key={t} className="flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-full bg-brand-soft text-brand"><Icon name={ic} size={13} /></span>{t}</li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <TrackerDemo />
            <FloatSticker className="-left-2 top-16 sm:-left-10" r="-6deg" delay="0s" icon="users" tone="bg-white text-forest" title="+23 neighbours" sub="confirmed this issue" />
            <FloatSticker className="-right-1 top-[46%] sm:-right-8" r="5deg" delay="1.2s" icon="calendar" tone="bg-forest text-white" title="Inspection Sat" sub="16 Nov · 9am–12pm" dark />
            <FloatSticker className="bottom-24 -left-1 sm:-left-14" r="4deg" delay="2.1s" icon="sparkle" tone="bg-sun text-forest" title="Your report helped" sub="240 residents" />
          </div>
        </Container>
        <div className="relative pb-12">
          <p className="mb-4 text-center text-[12px] font-bold uppercase tracking-[.14em] text-ink-3">Report anything public that&apos;s broken</p>
          <CategoryMarquee />
        </div>
      </section>

      {/* ---------- Stats: label on top, big number below (stat-card pattern) ---------- */}
      <section className="border-y border-line bg-white py-14 sm:py-16">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4" data-reveal>
            <h2 className="text-3xl font-extrabold text-forest sm:text-4xl">Progress you can count.</h2>
            <Link href="/impact#limits" className="text-[14px] font-semibold text-brand hover:underline">How we count, and what the numbers can&apos;t tell you →</Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <div key={s.label} className={cx('flex min-h-[210px] flex-col rounded-[24px] p-5 sm:p-6', i === 1 ? 'bg-forest text-white' : 'bg-paper')} data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
                <div className={cx('text-[13px] font-bold uppercase tracking-wider', i === 1 ? 'text-sun' : 'text-ink-3')}>{s.label}</div>
                <p className={cx('mt-2 text-[14px] leading-snug', i === 1 ? 'text-white/70' : 'text-ink-2')}>{s.context}</p>
                <div className={cx('display mt-auto pt-6 text-5xl font-extrabold sm:text-6xl', i === 1 ? 'text-white' : 'text-forest')}><CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} /></div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- Four questions ---------- */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHead eyebrow={<><Icon name="sparkle" size={14} />The NaijaWorks promise</>} title={<>Four questions. Always answered.</>} body="A report should never disappear into a void. Every report on NaijaWorks answers these four things, in plain language." />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {FOUR_QUESTIONS.map((f, i) => {
              const t = TONE[f.tone];
              return (
                <div key={f.q} className={cx('group relative flex min-h-[260px] flex-col overflow-hidden rounded-[28px] p-6 transition-transform duration-300 hover:-translate-y-1', t.bg, t.fg)} data-reveal style={{ ['--d' as string]: `${i * 90}ms` }}>
                  <span className="display text-[64px] leading-none font-extrabold opacity-20">0{i + 1}</span>
                  <span className={cx('absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-2xl transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110', t.ring)}><Icon name={f.icon} size={22} /></span>
                  <h3 className="mt-auto text-2xl font-extrabold">{f.q}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed opacity-80">{f.a}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ---------- 3 steps ---------- */}
      <section className="relative overflow-hidden bg-forest py-20 text-white sm:py-28 grain">
        <div className="adire absolute inset-0" aria-hidden />
        <Container className="relative">
          <SectionHead light eyebrow="How it works" title={<>Snap. We route. <span className="text-sun">You track.</span></>} body="The whole report takes about two minutes. The tracking lasts until the problem is actually fixed." />
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            <StepCard n={1} title="Snap it" body="Pick what's wrong from big friendly icons, add a photo, and confirm the pin on the map. AI helps you describe it, no formal letter needed.">
              <div className="grid grid-cols-3 gap-2">
                {[['road', 'Road'], ['lamp', 'Streetlight'], ['waves', 'Drainage'], ['droplet', 'Water'], ['trash', 'Waste'], ['bolt', 'Power']].map(([ic, l], k) => (
                  <div key={l} className={cx('flex flex-col items-center gap-1.5 rounded-2xl p-3 text-[12px] font-semibold', k === 0 ? 'bg-sun text-forest' : 'bg-white/10 text-white/80')}><Icon name={ic} size={20} />{l}</div>
                ))}
              </div>
            </StepCard>
            <StepCard n={2} title="We find who fixes it" body="Our routing engine checks the category, location, road ownership and service areas, then sends it to the right LGA, state agency, federal body or utility.">
              <div className="space-y-2 text-[13px]">
                {[['Surulere LGA', 'Checked', false], ['Lagos State Public Works', 'Assigned · road is state-managed', true]].map(([a, s, on]) => (
                  <div key={a as string} className={cx('flex items-center gap-3 rounded-2xl p-3', on ? 'bg-white text-forest' : 'bg-white/10 text-white/60 line-through decoration-white/30')}>
                    <Icon name="building" size={18} /><div className="min-w-0"><div className="font-bold">{a}</div><div className="text-[11px] no-underline opacity-75">{s}</div></div>{on && <Icon name="check" size={18} className="ml-auto text-brand" />}
                  </div>
                ))}
              </div>
            </StepCard>
            <StepCard n={3} title="Track every step" body="Verified, inspected, scheduled, in progress, fixed. Each step has a date, who did it, and what happens next. Delays must come with a reason.">
              <ol className="space-y-2.5 text-[13px]">
                {[['Inspection complete', '18 Nov', true], ['Repair scheduled', '27 Nov', true], ['Work in progress', 'Now', 'now'], ['Fixed', 'Target 2 Dec', false]].map(([t, d, s]) => (
                  <li key={t as string} className="flex items-center gap-3">
                    <span className={cx('grid h-6 w-6 shrink-0 place-items-center rounded-full', s === true ? 'bg-brand-2 text-white' : s === 'now' ? 'pulse bg-sun text-forest' : 'bg-white/15')}>{s === true && <Icon name="check" size={13} />}{s === 'now' && <Icon name="hammer" size={12} />}</span>
                    <span className={cx('flex-1 font-semibold', s === false && 'text-white/50')}>{t}</span><span className="text-white/50">{d}</span>
                  </li>
                ))}
              </ol>
            </StepCard>
          </div>
        </Container>
      </section>

      {/* ---------- Who fixes this ---------- */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <SectionHead eyebrow={<><Icon name="book" size={14} />Civic 101, made simple</>} title="Who actually fixes this?" body="Tap a problem. We'll tell you who usually handles it, in plain words." />
            <Btn href="/who-handles-what" variant="ghost" icon="arrowR">Federal, state, LGA explained</Btn>
          </div>
          <RouteExplainer />
        </Container>
      </section>

      {/* ---------- Before / after ---------- */}
      <section className="bg-paper-2 py-20 sm:py-28">
        <Container>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <SectionHead tone="sun" eyebrow={<><Icon name="star" size={14} />Fixed, with proof</>} title="Drag the slider. See the difference." body="Work can't be marked complete without photos. Then the neighbours who reported it confirm it's really fixed." />
            <Btn href="/impact" variant="ghost" icon="arrowR">More transformations</Btn>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {STORIES.slice(0, 2).map((s) => <StoryCard key={s.place} s={s} big />)}
          </div>
        </Container>
      </section>

      {/* ---------- Community, not popularity ---------- */}
      <section className="py-20 sm:py-28">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1" data-reveal>
            <div className="absolute -inset-6 rounded-[40px] bg-brand-soft" aria-hidden />
            <div className="relative space-y-3">
              <div className="rounded-[24px] bg-white p-5 shadow-soft ring-1 ring-line">
                <div className="flex items-center gap-2 text-[13px] font-bold text-[#8A5A00]"><Icon name="info" size={16} />This issue may already have been reported</div>
                <div className="mt-3 flex gap-3 rounded-2xl bg-paper p-3">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-sky-soft text-sky"><Icon name="waves" size={24} /></span>
                  <div className="min-w-0"><div className="font-bold text-forest">Blocked drain, Ogunlana Drive</div><div className="text-[13px] text-ink-2">80 m away · Inspection scheduled</div><div className="mt-1 text-[13px] font-semibold text-brand">48 people have confirmed this</div></div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[14px] font-semibold">
                  <span className="rounded-xl bg-forest px-3 py-3 text-center text-white">Yes, I&apos;m affected too</span>
                  <span className="rounded-xl px-3 py-3 text-center text-forest ring-1 ring-line">Add a photo</span>
                  <span className="rounded-xl px-3 py-3 text-center text-forest ring-1 ring-line">Follow this issue</span>
                  <span className="rounded-xl px-3 py-3 text-center text-ink-2 ring-1 ring-line">It&apos;s a different problem</span>
                </div>
              </div>
              <div className="ml-auto flex w-fit items-center gap-3 rounded-2xl bg-clay p-4 pr-5 text-white shadow-pop" style={{ transform: 'rotate(-2deg)' }}>
                <Icon name="alert" size={22} /><div><div className="text-[13px] opacity-80">2 reports · Urgent safety risk</div><div className="font-bold">Open manhole jumps the queue</div></div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <SectionHead eyebrow={<><Icon name="users" size={14} />Stronger together</>} title="One problem. One report. Many voices." body="When you spot something already reported, add your weight instead of a duplicate. Confirmations show how many people are affected, but they're not votes: a dangerous open manhole with two reports still outranks a faded zebra crossing with two hundred." />
            <ul className="mt-8 space-y-3" data-reveal>
              {['Duplicates strengthen the original report', 'Severity and safety come before popularity', 'Structured contributions, no comment wars'].map((t) => (
                <li key={t} className="flex items-center gap-3 text-[16px] font-medium text-forest"><span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-white"><Icon name="check" size={15} /></span>{t}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ---------- Badges ---------- */}
      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="overflow-hidden rounded-[36px] bg-white p-6 shadow-soft ring-1 ring-line sm:p-12">
            <div>
              <SectionHead tone="sun" eyebrow={<><Icon name="heart" size={14} />Your civic footprint</>} title="Earn respect, not points for noise." body="Badges reward useful help, like verified reports, good evidence and confirming real repairs. Never for volume. No leaderboards of complaints." />
              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
                {BADGES.map((b, i) => (
                  <div key={b.name} className="rounded-3xl bg-paper p-4 text-center transition-transform duration-300 hover:-translate-y-1 hover:rotate-[-2deg]" data-reveal style={{ ['--d' as string]: `${i * 70}ms` }}>
                    <span className={cx('mx-auto grid h-16 w-16 place-items-center rounded-full ring-4 ring-white', ['bg-sun text-forest', 'bg-brand text-white', 'bg-sky text-white', 'bg-violet text-white', 'bg-clay text-white'][i])}><Icon name={b.icon} size={26} /></span>
                    <div className="mt-3 text-[14px] font-bold text-forest">{b.name}</div>
                    <div className="mt-1 text-[12px] leading-snug text-ink-2">{b.how}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-3xl bg-forest p-5 text-white sm:grid-cols-4 sm:p-6">
              <div className="col-span-2 -mb-1 text-[13px] font-semibold text-white/60 sm:col-span-4">Example impact dashboard · &ldquo;Your reports helped improve your community.&rdquo;</div>
              {[['8', 'verified reports'], ['5', 'resolved'], ['3', 'communities helped'], ['1,840', 'people potentially impacted']].map(([n, l]) => (
                <div key={l}><div className="display text-3xl font-extrabold text-sun">{n}</div><div className="text-[14px] text-white/70">{l}</div></div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- For government teaser ---------- */}
      <section className="relative overflow-hidden bg-forest-2 py-20 text-white sm:py-28">
        <div className="absolute right-0 top-0 h-[480px] w-[480px] rounded-full bg-brand/30 blur-3xl" aria-hidden />
        <Container className="relative grid items-center gap-14 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHead light eyebrow={<><Icon name="building" size={14} />For government teams</>} title="Operational tools, not a complaint inbox." body="Triage, inspections, work orders, contractors and analytics in one place. Every action updates the public timeline automatically, so transparency is built into the work, not extra work." />
            <div className="mt-8 flex flex-wrap gap-3" data-reveal><Btn href="/for-government" variant="sun" icon="arrowR">Explore the portal</Btn><Btn href={`${APP_URL}/gov`} variant="outline-light">Try the demo</Btn></div>
          </div>
          <div data-reveal><GovPreview /></div>
        </Container>
      </section>

      {/* ---------- Inclusion ---------- */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHead center eyebrow={<><Icon name="globe" size={14} />Made for every Nigerian</>} title="For grandma’s old phone and your new one." body="Designed for older users, first-time reporters, patchy networks and expensive data." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ACCESS.map((a, i) => (
              <div key={a.title} className="rounded-[28px] bg-white p-6 ring-1 ring-line" data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
                <IconTile name={a.icon} color={['#0B7A4B', '#C77700', '#0284C7', '#8B5CF6'][i]} />
                <h3 className="mt-5 text-lg font-bold text-forest">{a.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{a.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[28px] bg-sun-soft p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8" data-reveal>
            <div>
              <div className="display text-2xl font-extrabold text-forest">&ldquo;Good news! Work don start for the streetlight wey you report.&rdquo;</div>
              <div className="mt-1 text-[14px] text-[#8A5A00]">Friendly notifications, in the language you choose. Try the toggle at the top.</div>
            </div>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-forest sm:mt-0"><Icon name="bell" size={16} />Coming soon: WhatsApp, SMS & USSD</span>
          </div>
        </Container>
      </section>

      {/* ---------- Quotes ---------- */}
      <section className="bg-paper-2 py-20 sm:py-28">
        <Container>
          <SectionHead center eyebrow="Voices" title="It feels like someone is listening." />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {QUOTES.map((q, i) => (
              <figure key={q.name} className={cx('flex flex-col rounded-[28px] p-7', i === 1 ? 'bg-forest text-white' : 'bg-white ring-1 ring-line')} data-reveal style={{ ['--d' as string]: `${i * 90}ms` }}>
                <span className={cx('display text-6xl leading-none', i === 1 ? 'text-sun' : 'text-brand')}>&ldquo;</span>
                <blockquote className={cx('mt-1 flex-1 text-[17px] leading-relaxed', i === 1 ? 'text-white/90' : 'text-ink')}>{q.text}</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className={cx('grid h-11 w-11 place-items-center rounded-full font-bold', i === 1 ? 'bg-sun text-forest' : 'bg-brand-soft text-brand')}>{q.name[0]}</span>
                  <span><b className="block">{q.name}</b><span className={cx('text-[13px]', i === 1 ? 'text-white/60' : 'text-ink-2')}>{q.area}</span></span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-6 text-center text-[13px] text-ink-3">Illustrative quotes for this demo.</p>
        </Container>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="scroll-mt-24 py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHead eyebrow="FAQ" title="Questions people ask us." body="Still unsure? The app explains every status in plain words as you go." />
            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-clay-soft p-4 text-[14px] text-[#7A2A10]" data-reveal><Icon name="alert" size={18} className="mt-0.5 shrink-0" /><span><b>Emergency?</b> If someone&apos;s life is in immediate danger, contact emergency services (112) first.</span></div>
          </div>
          <div className="space-y-3" data-reveal>
            {FAQ.map((f, i) => (
              <details key={f.q} className="group rounded-3xl bg-white ring-1 ring-line open:shadow-soft" open={i === 0}>
                <summary className="flex items-center justify-between gap-4 p-5 text-[17px] font-semibold text-forest sm:p-6">
                  {f.q}<span className="faq-plus grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper text-forest transition-all duration-300"><Icon name="plus" size={18} /></span>
                </summary>
                <p className="-mt-1 px-5 pb-6 text-[16px] leading-relaxed text-ink-2 sm:px-6">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}

function FloatSticker({ className, r, delay, icon, tone, title, sub, dark = false }: { className: string; r: string; delay: string; icon: string; tone: string; title: string; sub: string; dark?: boolean }) {
  return (
    <div className={cx('absolute z-10 hidden animate-float items-center gap-3 rounded-2xl py-3 pl-3 pr-4 shadow-pop sm:flex', tone, className)} style={{ ['--r' as string]: r, animationDelay: delay }} aria-hidden>
      <span className={cx('grid h-9 w-9 place-items-center rounded-xl', dark ? 'bg-white/15' : 'bg-forest/10')}><Icon name={icon} size={18} /></span>
      <span><b className="block text-[14px] leading-tight">{title}</b><span className="text-[12px] opacity-75">{sub}</span></span>
    </div>
  );
}

function StepCard({ n, title, body, children }: { n: number; title: string; body: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-[28px] bg-white/[.06] p-6 ring-1 ring-white/10 backdrop-blur sm:p-7" data-reveal style={{ ['--d' as string]: `${n * 100}ms` }}>
      <div className="flex items-center gap-3"><span className="display grid h-11 w-11 place-items-center rounded-full bg-sun text-xl font-extrabold text-forest">{n}</span><h3 className="text-2xl font-extrabold">{title}</h3></div>
      <p className="mt-4 text-[15px] leading-relaxed text-white/70">{body}</p>
      <div className="mt-6 flex-1 rounded-3xl bg-black/20 p-4">{children}</div>
    </div>
  );
}
