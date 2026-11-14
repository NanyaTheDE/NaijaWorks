'use client';
import Link from 'next/link';
import { useRepo, useUi } from '@/lib/store';
import { CitizenShell, BackBar } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { BeforeAfter, communityName, photoFor } from '@/components/civic';

const TILES: [string, string, number][] = [['road', 'Roads repaired', 14], ['lamp', 'Streetlights restored', 63], ['droplet', 'Water issues resolved', 9], ['waves', 'Drains cleared', 11], ['users', 'Communities reached', 27], ['check', 'Reports completed', 142]];

export default function ImpactPage() {
  const repo = useRepo(); const ui = useUi();
  const fixed = repo.listReports().filter((r) => ['completed', 'monitoring'].includes(r.status));
  return (
    <CitizenShell nav="home">
      <BackBar title="Impact" />
      <div className="screen stack">
        <div className="hero"><div className="xs" style={{ opacity: 0.8, fontWeight: 700, letterSpacing: '.06em' }}>NOVEMBER 2026 · LAGOS</div>
          <h2 style={{ color: '#fff', fontSize: 24, marginTop: 6 }}>142 fixes your neighbours can see.</h2>
          <p className="small" style={{ opacity: 0.85, marginTop: 6 }}>Every number below was completed with photos and checked by residents.</p></div>
        <div className="stat-pair" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>{TILES.map(([ic, l, n]) => <div key={l} className="stat"><span style={{ color: 'var(--brand)' }}><Icon name={ic} size={20} /></span><div className="n tnum" style={{ marginTop: 6 }}>{n}</div><div className="l">{l}</div></div>)}</div>
        <div className="section-head"><h2>Before → After</h2><span className="xs faint">drag to compare</span></div>
        {fixed.map((r) => (
          <div key={r.ref} className="card card-flush"><BeforeAfter before={photoFor(r, 'before').scene} after={photoFor(r, 'after').scene} />
            <div style={{ padding: '12px 14px' }} className="row between">
              <Link href={`/issue/${r.ref}`} className="grow"><b>{r.title}</b><div className="xs muted">{r.street}, {communityName(r.community)} · {r.confirmations?.yes ?? 0} residents confirmed</div></Link>
              <button className="btn btn-soft btn-sm" onClick={() => ui.confetti()}><Icon name="heart" size={15} />Celebrate</button>
            </div></div>))}
        <div className="card stack-sm"><h3>About these numbers</h3><p className="small muted">Counts come from reports completed on NaijaWorks with evidence. They don’t include work done outside the platform. <Link className="link" href="/data">See public data</Link></p></div>
      </div>
    </CitizenShell>
  );
}
