import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';
import { CountUp, HeroCopy, RouteExplainer } from '@/components/client';
import { PhoneStory } from '@/components/phone-story';
import { CategoryMarquee, CtaBand, GovPreview, StoryCard } from '@/components/sections';
import { Btn, Checklist, ColorTile, Logo, Container, IconTile, SectionHead, cx } from '@/components/ui';
import { ACCESS, appUrl, BADGES, FAQ, FOUR_QUESTIONS, QUOTES, STATS, STORIES } from '@/content/site';


export default function Home() {
  return (
    <>
      {/* ---------- Hero: headline, body and buttons first; then the phone story fades in below ---------- */}
      <section className="pt-32 sm:pt-40">
        <Container className="text-center">
          <div className="mx-auto max-w-3xl [&_p]:mx-auto">
            <HeroCopy />
            <div className="rise mt-9 flex flex-wrap justify-center gap-3 [&>*]:[animation-delay:.5s]">
              <Btn href={appUrl('/report')} size="lg" icon="arrowR">Report an issue</Btn>
              <Btn href="/how-it-works" size="lg" variant="ghost">See how it works</Btn>
            </div>
            <ul className="rise mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14px] text-ink-2 [&>*]:[animation-delay:.65s]">
              {[['check', 'Free for citizens'], ['wifi', 'Works on low data'], ['lock', 'Stay anonymous if you like']].map(([ic, t]) => (
                <li key={t} className="flex items-center gap-2"><Icon name={ic} size={15} className="text-brand" />{t}</li>
              ))}
            </ul>
          </div>
        </Container>
        <Container className="mt-14 pb-14">
          <div className="hero-phone panel-calm relative overflow-hidden rounded-[24px] px-4 pb-10 pt-12 ring-1 ring-[#D3DFD5] sm:px-8 sm:pt-16">
            <span className="absolute right-6 top-6 z-20 hidden sm:block" aria-hidden><span className="stamp stamp-green"><Icon name="shield" size={14} />Verified</span></span>
            <div className="relative mx-auto max-w-[340px]">
              <PhoneStory />
              <FloatSticker className="-left-3 top-24 sm:-left-44" r="-5deg" delay="0s" icon="users" title="+23 neighbours" sub="confirmed this issue" />
              <FloatSticker className="-right-2 top-[38%] sm:-right-48" r="4deg" delay="1.2s" icon="calendar" title="Inspection Sat" sub="16 Nov · 9am–12pm" />
              <FloatSticker className="bottom-48 -left-2 sm:-left-48" r="3deg" delay="2.1s" icon="sparkle" title="Your report helped" sub="240 residents" accent />
            </div>
          </div>
        </Container>
        <Container>
          <div className="flex flex-col gap-4 border-t border-line py-7 md:flex-row md:items-center">
            <p className="shrink-0 text-[14px] font-medium text-ink-3 md:w-52">Report anything public that&apos;s broken</p>
            <div className="min-w-0 flex-1"><CategoryMarquee /></div>
          </div>
        </Container>
      </section>

      {/* ---------- Stats row: big light numbers between hairlines ---------- */}
      <section className="pb-20 pt-6 sm:pb-28">
        <Container>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4" data-reveal>
            <h2 className="text-[30px] text-ink sm:text-[40px]">Progress you can count.</h2>
            <Link href="/impact#limits" className="text-[14px] font-medium text-ink-2 underline decoration-line underline-offset-4 hover:text-ink">How we count, and what the numbers can&apos;t tell you →</Link>
          </div>
          <div className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
            {STATS.map((s, i) => (
              <div key={s.label} className="border-b border-line py-7 pr-4 even:border-l even:pl-4 sm:pr-6 sm:even:pl-6 lg:pl-6 lg:even:border-l-0 lg:[&:not(:first-child)]:border-l lg:first:pl-0" data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
                <div className="display text-[40px] leading-none font-normal tracking-tight text-ink sm:text-[60px]"><CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} /></div>
                <div className="mt-4 text-[15px] font-medium text-ink">{s.label}</div>
                <p className="mt-1 text-[14px] leading-snug text-ink-2">{s.context}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- Four promises: object illustration + hairline grid ---------- */}
      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center" data-reveal>
            <PromiseObject />
            <div>
              <h2 className="text-[36px] leading-[1.04] text-ink sm:text-[52px]">Four questions. Always answered.</h2>
              <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-2">A report should never disappear into a void. Every report on NaijaWorks answers these four things, in plain language.</p>
            </div>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FOUR_QUESTIONS.map((f, i) => (
              <ColorTile key={f.q} mood={f.mood} icon={f.icon} title={f.q} body={f.a} className="min-h-[280px] [&>h3]:mt-auto [&>h3]:pt-10" style={{ ['--d' as string]: `${i * 70}ms` }} />
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- How it works: alternating feature rows ---------- */}
      <section className="pb-8">
        <Container>
          <div className="border-t border-line pt-14"><SectionHead eyebrow={<><Icon name="layers" size={14} />How it works</>} title={<>Snap. We route. <em>You track.</em></>} body="The whole report takes about two minutes. The tracking lasts until the problem is actually fixed." /></div>
        </Container>
      </section>
      <FeatureRow n="01" icon="camera" title="Snap it" body="Pick what's wrong from big friendly icons, add a photo, and confirm the pin on the map. AI helps you describe it, no formal letter needed." sky="panel-sun">
        <div className="glass w-full max-w-[360px] rounded-2xl p-4">
          <div className="grid grid-cols-3 gap-2">
            {[['road', 'Road'], ['lamp', 'Streetlight'], ['waves', 'Drainage'], ['droplet', 'Water'], ['trash', 'Waste'], ['bolt', 'Power']].map(([ic, l], k) => (
              <div key={l} className={cx('flex flex-col items-center gap-1.5 rounded-xl p-3 text-[12px] font-medium', k === 0 ? 'bg-forest text-white' : 'bg-white text-ink-2 ring-1 ring-line')}><Icon name={ic} size={20} />{l}</div>
            ))}
          </div>
        </div>
      </FeatureRow>
      <FeatureRow n="02" icon="building" title="We find who fixes it" body="Our routing engine checks the category, location, road ownership and service areas, then sends it to the right LGA, state agency, federal body or utility." sky="panel-green" flip>
        <div className="w-full max-w-[360px] space-y-2 text-[13px]">
          <div className="glass flex items-center gap-3 rounded-2xl p-3.5 text-ink-3"><Icon name="building" size={18} /><div className="min-w-0"><div className="font-medium line-through">Surulere LGA</div><div className="text-[11px]">Checked</div></div></div>
          <div className="glass flex items-center gap-3 rounded-2xl p-3.5 text-ink"><span className="grid h-8 w-8 place-items-center rounded-full bg-forest text-white"><Icon name="building" size={16} /></span><div className="min-w-0"><div className="font-semibold">Lagos State Public Works</div><div className="text-[11px] text-ink-2">Assigned · road is state-managed</div></div><Icon name="check" size={18} className="ml-auto text-brand" /></div>
        </div>
      </FeatureRow>
      <FeatureRow n="03" icon="eye" title="Track every step" body="Verified, inspected, scheduled, in progress, fixed. Each step has a date, who did it, and what happens next. Delays must come with a reason." sky="panel-indigo">
        <ol className="glass w-full max-w-[360px] space-y-3 rounded-2xl p-5 text-[13px]">
          {[['Inspection complete', '18 Nov', true], ['Repair scheduled', '27 Nov', true], ['Work in progress', 'Now', 'now'], ['Fixed', 'Target 2 Dec', false]].map(([t, d, s]) => (
            <li key={t as string} className="flex items-center gap-3">
              <span className={cx('grid h-6 w-6 shrink-0 place-items-center rounded-full', s === true ? 'bg-brand text-white' : s === 'now' ? 'pulse bg-sun text-ink' : 'bg-ink/10')}>{s === true && <Icon name="check" size={13} />}{s === 'now' && <Icon name="hammer" size={12} />}</span>
              <span className={cx('flex-1 font-medium', s === false ? 'text-ink-3' : 'text-ink')}>{t}</span><span className="text-ink-3">{d}</span>
            </li>
          ))}
        </ol>
      </FeatureRow>

      {/* ---------- Who fixes this ---------- */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-14">
            <SectionHead eyebrow={<><Icon name="book" size={14} />Civic 101, made simple</>} title="Who actually fixes this?" body="Tap a problem. We'll tell you who usually handles it, in plain words." />
            <Btn href="/who-handles-what" variant="ghost" icon="arrowR">Federal, state, LGA explained</Btn>
          </div>
          <RouteExplainer />
        </Container>
      </section>

      {/* ---------- Before / after ---------- */}
      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-14">
            <SectionHead tone="sun" eyebrow={<><Icon name="star" size={14} />Fixed, with proof</>} title="Drag the slider. See the difference." body="Work can't be marked complete without photos. Then the neighbours who reported it confirm it's really fixed." />
            <Btn href="/impact" variant="ghost" icon="arrowR">More transformations</Btn>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {STORIES.slice(0, 2).map((s) => <StoryCard key={s.place} s={s} big />)}
          </div>
        </Container>
      </section>

      {/* ---------- Community, not popularity ---------- */}
      <section className="pb-20 sm:pb-28">
        <Container className="grid items-center gap-12 border-t border-line pt-14 lg:grid-cols-2 lg:gap-16">
          <div className="panel-sun relative order-2 overflow-hidden rounded-[24px] px-5 py-10 sm:px-10 lg:order-1" data-reveal>
            <div className="glass mx-auto max-w-[420px] rounded-2xl p-5">
              <div className="flex items-center gap-2 text-[13px] font-medium text-[#8A5A00]"><Icon name="info" size={16} />This issue may already have been reported</div>
              <div className="mt-3 flex gap-3 rounded-xl bg-white p-3 ring-1 ring-line">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sky-soft text-sky"><Icon name="waves" size={22} /></span>
                <div className="min-w-0"><div className="font-semibold text-ink">Blocked drain, Ogunlana Drive</div><div className="text-[13px] text-ink-2">80 m away · Inspection scheduled</div><div className="mt-1 text-[13px] font-medium text-brand">48 people have confirmed this</div></div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[13px] font-medium">
                <span className="rounded-full bg-forest px-3 py-2.5 text-center text-white">Yes, I&apos;m affected too</span>
                <span className="rounded-full bg-white px-3 py-2.5 text-center text-ink ring-1 ring-line">Add a photo</span>
                <span className="rounded-full bg-white px-3 py-2.5 text-center text-ink ring-1 ring-line">Follow this issue</span>
                <span className="rounded-full bg-white px-3 py-2.5 text-center text-ink-2 ring-1 ring-line">It&apos;s a different problem</span>
              </div>
            </div>
            <div className="glass mx-auto mt-4 flex w-fit items-center gap-3 rounded-2xl p-3 pr-5" style={{ transform: 'rotate(-2deg)' }}>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-clay text-white"><Icon name="alert" size={18} /></span><div><div className="text-[12px] text-ink-2">2 reports · Urgent safety risk</div><div className="text-[14px] font-semibold text-ink">Open manhole jumps the queue</div></div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <SectionHead eyebrow={<><Icon name="users" size={14} />Stronger together</>} title="One problem. One report. Many voices." body="When you spot something already reported, add your weight instead of a duplicate. Confirmations show how many people are affected, but they're not votes: a dangerous open manhole with two reports still outranks a faded zebra crossing with two hundred." />
            <Checklist className="mt-8" items={['Duplicates strengthen the original report', 'Severity and safety come before popularity', 'Structured contributions, no comment wars']} />
          </div>
        </Container>
      </section>

      {/* ---------- Badges ---------- */}
      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="border-t border-line pt-14">
            <SectionHead tone="sun" eyebrow={<><Icon name="heart" size={14} />Your civic footprint</>} title="Earn respect, not points for noise." body="Badges reward useful help, like verified reports, good evidence and confirming real repairs. Never for volume. No leaderboards of complaints." />
          </div>
          <div className="mt-12 grid grid-cols-2 border-t border-line sm:grid-cols-3 lg:grid-cols-5">
            {BADGES.map((b, i) => (
              <div key={b.name} className={cx('wiggle-host border-b border-line py-7 pr-4', i > 0 && 'lg:border-l lg:pl-6')} data-reveal style={{ ['--d' as string]: `${i * 70}ms` }}>
                <IconTile name={b.icon} size={44} tone="medal" />
                <div className="mt-4 text-[15px] font-medium text-ink">{b.name}</div>
                <div className="mt-1 text-[13px] leading-snug text-ink-2">{b.how}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-[20px] bg-paper-2 p-6 sm:p-8">
            <div className="text-[13px] text-ink-2">Example impact dashboard · &ldquo;Your reports helped improve your community.&rdquo;</div>
            <div className="mt-5 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[['8', 'verified reports'], ['5', 'resolved'], ['3', 'communities helped'], ['1,840', 'people potentially impacted']].map(([n, l]) => (
                <div key={l}><div className="display text-[40px] leading-none text-ink">{n}</div><div className="mt-2 text-[14px] text-ink-2">{l}</div></div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- For government ---------- */}
      <section className="pb-20 sm:pb-28">
        <Container className="border-t border-line pt-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead eyebrow={<><Icon name="building" size={14} />For government teams</>} title="Operational tools, not a complaint inbox." body="Triage, inspections, work orders, contractors and analytics in one place. Every action updates the public timeline automatically, so transparency is built into the work, not extra work." />
            <div className="flex flex-wrap gap-3" data-reveal><Btn href="/for-government" icon="arrowR">Explore the portal</Btn><Btn href={appUrl('/gov')} variant="ghost">Try the demo</Btn></div>
          </div>
          {/* Wide, landscape dashboard so it reads like the real desktop portal */}
          <div className="panel-green mt-12 overflow-hidden rounded-[24px] px-4 pt-6 sm:px-12 sm:pt-12" data-reveal>
            <div className="mx-auto max-w-[1040px] translate-y-px [&>div]:rounded-b-none"><GovPreview /></div>
          </div>
        </Container>
      </section>

      {/* ---------- Inclusion ---------- */}
      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="border-t border-line pt-14"><SectionHead eyebrow={<><Icon name="globe" size={14} />Made for every Nigerian</>} title="For grandma’s old phone and your new one." body="Designed for older users, first-time reporters, patchy networks and expensive data." /></div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ACCESS.map((a, i) => (
              <ColorTile key={a.title} mood={a.mood} icon={a.icon} title={a.title} body={a.body} style={{ ['--d' as string]: `${i * 80}ms` }} />
            ))}
          </div>
          <div className="panel-indigo mt-8 grid items-center gap-6 overflow-hidden rounded-[24px] p-6 sm:p-10 md:grid-cols-[1fr_auto]" data-reveal>
            {/* An iOS-style notification, in Pidgin */}
            <div className="glass max-w-xl rounded-[20px] p-4">
              <div className="flex items-center gap-2 text-[12px] text-ink-2"><Logo size={20} /><span className="font-medium uppercase tracking-wide">NaijaWorks</span><span className="ml-auto">now</span></div>
              <div className="mt-1.5 text-[16px] font-semibold text-ink">&ldquo;Good news! Work don start for the streetlight wey you report.&rdquo;</div>
              <div className="mt-1 text-[14px] text-ink-2">Friendly notifications, in the language you choose. Try the toggle at the top.</div>
            </div>
            <span className="glass inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium text-ink"><Icon name="bell" size={16} />Coming soon: WhatsApp, SMS &amp; USSD</span>
          </div>
        </Container>
      </section>

      {/* ---------- Quotes ---------- */}
      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="border-t border-line pt-14"><SectionHead eyebrow="Voices" title="It feels like someone is listening." /></div>
          <div className="mt-12 grid border-t border-line lg:grid-cols-3">
            {QUOTES.map((q, i) => (
              <figure key={q.name} className={cx('flex flex-col border-b border-line py-8 lg:pr-8', i > 0 && 'lg:border-l lg:pl-8')} data-reveal style={{ ['--d' as string]: `${i * 90}ms` }}>
                <blockquote className="flex-1 text-[19px] leading-relaxed text-ink">&ldquo;{q.text}&rdquo;</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className={cx('grid h-10 w-10 place-items-center rounded-full text-[15px] font-semibold', ['bg-sun-soft text-[#8A5A00]', 'bg-brand-soft text-brand', 'bg-sky-soft text-sky'][i])}>{q.name[0]}</span>
                  <span><b className="block font-medium text-ink">{q.name}</b><span className="text-[13px] text-ink-2">{q.area}</span></span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="scroll-mt-24 pb-4">
        <Container className="grid gap-12 border-t border-line pt-14 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHead eyebrow="FAQ" title="Questions people ask us." body="Still unsure? The app explains every status in plain words as you go." />
            <p className="mt-6 flex items-start gap-2 text-[14px] text-ink-2" data-reveal><Icon name="alert" size={17} className="mt-0.5 shrink-0 text-clay" /><span><b className="font-medium text-ink">Emergency?</b> If someone&apos;s life is in immediate danger, contact emergency services (112) first.</span></p>
          </div>
          <div className="border-t border-line" data-reveal>
            {FAQ.map((f, i) => (
              <details key={f.q} className="group border-b border-line" open={i === 0}>
                <summary className="flex items-center justify-between gap-4 py-5 text-[18px] font-medium text-ink">
                  {f.q}<span className="faq-plus grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 ring-line transition-all duration-300"><Icon name="plus" size={16} /></span>
                </summary>
                <p className="-mt-1 pb-6 pr-12 text-[16px] leading-relaxed text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}

function FeatureRow({ n, icon, title, body, sky, flip = false, children }: { n: string; icon: string; title: string; body: string; sky: string; flip?: boolean; children: ReactNode }) {
  return (
    <section className="py-8 sm:py-10">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={cx(flip && 'lg:order-2')} data-reveal>
          <div className="flex items-center gap-2 text-[14px] font-medium text-ink"><IconTile name={icon} size={28} /><span className="tabular-nums text-ink-3">{n}</span></div>
          <h3 className="mt-5 text-[34px] leading-[1.05] font-medium text-ink sm:text-[44px]">{title}</h3>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ink-2">{body}</p>
          <div className="mt-7"><Btn href="/how-it-works" variant="ghost" icon="arrowR">See how it works</Btn></div>
        </div>
        <div className={cx(sky, 'flex min-h-[320px] items-center justify-center overflow-hidden rounded-[24px] p-6 sm:min-h-[380px] sm:p-10', flip && 'lg:order-1')} data-reveal><div className="bob flex w-full justify-center">{children}</div></div>
      </Container>
    </section>
  );
}

/** A small "object" illustration: a stack of report cards, like a playful product still life. */
function PromiseObject() {
  return (
    <div className="relative h-[104px] w-[132px] shrink-0" aria-hidden>
      <span className="absolute left-2 top-4 h-[78px] w-[104px] -rotate-12 rounded-xl bg-sun shadow-pop" />
      <span className="absolute left-6 top-2 grid h-[78px] w-[104px] rotate-3 place-items-center rounded-xl bg-paper shadow-pop ring-1 ring-line"><Icon name="clipboard" size={28} className="text-ink" /></span>
      <span className="absolute -right-4 bottom-0"><span className="stamp !text-[10px]">Fixed</span></span>
    </div>
  );
}

function FloatSticker({ className, r, delay, icon, title, sub, accent = false }: { className: string; r: string; delay: string; icon: string; title: string; sub: string; accent?: boolean }) {
  return (
    <div className={cx('glass absolute z-10 hidden animate-float items-center gap-3 rounded-2xl py-2.5 pl-2.5 pr-4 sm:flex', className)} style={{ ['--r' as string]: r, animationDelay: delay }} aria-hidden>
      <span className={cx('grid h-9 w-9 place-items-center rounded-full', accent ? 'bg-sun text-ink' : 'bg-forest text-white')}><Icon name={icon} size={17} /></span>
      <span><b className="block text-[14px] font-semibold leading-tight text-ink">{title}</b><span className="text-[12px] text-ink-2">{sub}</span></span>
    </div>
  );
}
