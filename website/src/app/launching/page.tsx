import type { Metadata } from 'next';
import { Icon } from '@/components/Icon';
import { Btn, ColorTile, Container } from '@/components/ui';

export const metadata: Metadata = { title: 'The app is launching soon', description: 'The NaijaWorks reporting app is on its way.', robots: { index: false } };

const NEXT = [
  { icon: 'camera', mood: 'sun' as const, title: 'Report in two minutes', body: 'Pick what is wrong, add a photo and drop a pin.' },
  { icon: 'eye', mood: 'sky' as const, title: 'Track every step', body: 'Verified, inspected, scheduled, fixed: each with a date.' },
  { icon: 'check', mood: 'green' as const, title: 'Confirm the fix', body: 'Tell officials whether the problem is really gone.' },
];

export default function Launching() {
  return (
    <section className="relative overflow-hidden pb-24 pt-36 sm:pt-44">
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-[44px] leading-[1] font-medium text-ink sm:text-6xl">The NaijaWorks app is launching soon.</h1>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-ink-2">
            Reporting, tracking and the government portal are being prepared for launch. Until then, see how it will work and who handles what in your area.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Btn href="/how-it-works" size="lg" icon="arrowR">See how it works</Btn>
            <Btn href="/who-handles-what" size="lg" variant="ghost">Who handles what</Btn>
          </div>
        </div>
        <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3">
          {NEXT.map((n, i) => <ColorTile key={n.title} mood={n.mood} icon={n.icon} title={n.title} body={n.body} style={{ ['--d' as string]: `${i * 80}ms` }} />)}
        </div>
        <p className="mx-auto mt-10 flex max-w-md items-start justify-center gap-2 text-center text-[14px] text-ink-2"><Icon name="alert" size={16} className="mt-0.5 shrink-0 text-clay" />If someone&apos;s life is in danger right now, call 112.</p>
      </Container>
    </section>
  );
}
