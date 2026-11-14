import { Btn, Container } from '@/components/ui';

export default function NotFound() {
  return (
    <section className="adire-ink pb-24 pt-40">
      <Container className="text-center">
        <div className="display text-8xl font-extrabold text-sun">404</div>
        <h1 className="mt-4 text-4xl font-extrabold text-forest">This road leads nowhere.</h1>
        <p className="mx-auto mt-3 max-w-md text-lg text-ink-2">The page you wanted isn&apos;t here. Unlike potholes, this one we can fix quickly.</p>
        <div className="mt-8"><Btn href="/" icon="arrowR">Back to home</Btn></div>
      </Container>
    </section>
  );
}
