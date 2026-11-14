import type { Metadata } from 'next';
import { Icon } from '@/components/Icon';
import { Btn, Container } from '@/components/ui';

export const metadata: Metadata = { title: 'The app is launching soon', description: 'The NaijaWorks reporting app is on its way.', robots: { index: false } };

const NEXT = [
  { icon: 'camera', title: 'Report in two minutes', body: 'Pick what is wrong, add a photo and drop a pin.' },
  { icon: 'eye', title: 'Track every step', body: 'Verified, inspected, scheduled, fixed: each with a date.' },
  { icon: 'check', title: 'Confirm the fix', body: 'Tell officials whether the problem is really gone.' },
];

export default function Launching() {
  return (
    <section className="adire-ink relative overflow-hidden pb-24 pt-36 sm:pt-44">
      <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-sun/30 blur-3xl" aria-hidden />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-sun-soft px-3.5 py-1.5 text-[13px] font-semibold text-[#8A5A00]"><Icon name="sparkle" size={14} />Almost here</span>
          <h1 className="mt-5 text-[44px] leading-[1] font-extrabold text-forest sm:text-6xl">The NaijaWorks app is launching soon.</h1>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-ink-2">
            Reporting, tracking and the government portal are being prepared for launch. Until then, see how it will work and who handles what in your area.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Btn href="/how-it-works" size="lg" icon="arrowR">See how it works</Btn>
            <Btn href="/who-handles-what" size="lg" variant="ghost">Who handles what</Btn>
          </div>
        </div>
        <div className="mx-auto mt-14 grid max-w-3xl gap-3 sm:grid-cols-3">
          {NEXT.map((n) => (
            <div key={n.title} className="rounded-[24px] bg-white p-5 ring-1 ring-line">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-brand"><Icon name={n.icon} size={20} /></span>
              <div className="mt-4 font-bold text-forest">{n.title}</div>
              <p className="mt-1 text-[14px] text-ink-2">{n.body}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 flex max-w-md items-start justify-center gap-2 text-center text-[14px] text-ink-2"><Icon name="alert" size={16} className="mt-0.5 shrink-0 text-clay" />If someone&apos;s life is in danger right now, call 112.</p>
      </Container>
    </section>
  );
}
