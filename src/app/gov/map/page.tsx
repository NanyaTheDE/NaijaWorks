'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRepo } from '@/lib/store';
import { PTop } from '@/components/shells';
import { MapBase, MapPin, CatIcon, StatusBadge } from '@/components/civic';
import { GROUPS } from '@/lib/domain/statuses';

export default function GovMapPage() {
  const repo = useRepo(); const [sel, setSel] = useState<string | null>(null);
  const R = repo.allReportsInternal().filter((r) => !r.mergedInto && r.status !== 'unable');
  const s = sel ? repo.getReport(sel) : undefined;
  return <>
    <PTop title="Map" sub="All open and recent reports across your jurisdiction." />
    <div className="card" style={{ padding: 12 }}>
      <div className="map" style={{ height: 'calc(100vh - 220px)', minHeight: 460 }} onClick={() => setSel(null)}>
        <MapBase />{R.map((r) => <MapPin key={r.ref} report={r} selected={r.ref === sel} onSelect={setSel} />)}
        {s && <div className="map-sheet" style={{ maxWidth: 420 }}><Link className="card row gap-12" href={`/gov/reports/${s.ref}`} style={{ boxShadow: 'var(--shadow)' }}><CatIcon category={s.category} size={36} /><div className="grow"><b className="small">{s.title}</b><div className="xs muted">{s.ref}</div></div><StatusBadge status={s.status} /></Link></div>}
      </div>
      <div className="map-legend" style={{ marginTop: 10 }}>{Object.values(GROUPS).map((g) => <span key={g.label}><i style={{ background: g.color }} />{g.label}</span>)}</div>
    </div>
  </>;
}
