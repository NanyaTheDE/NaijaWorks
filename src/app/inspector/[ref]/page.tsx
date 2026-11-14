'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRepo, useUi } from '@/lib/store';
import { FieldFrame } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { Media, MapBase, MapPin, SeverityBadge, EmptyState, communityName, photoFor } from '@/components/civic';
import { SEVERITY, INSPECTION_OUTCOMES } from '@/lib/domain/statuses';
import type { InspectionOutcome, Severity } from '@/lib/domain/types';

export default function InspectionPage() {
  const { ref } = useParams<{ ref: string }>(); const repo = useRepo(); const ui = useUi(); const router = useRouter();
  const r = repo.getReport(ref);
  const [s, setS] = useState({ photos: 0, confirmed: null as boolean | null, severity: (r?.severity ?? 'moderate') as Severity, outcome: 'repair' as InspectionOutcome, notes: '', scope: '' });
  if (!r?.inspection) return <FieldFrame aside="Field Inspector app"><EmptyState title="Not found" body="This inspection doesn't exist." /></FieldFrame>;
  const i = r.inspection; const set = (p: Partial<typeof s>) => setS((x) => ({ ...x, ...p }));
  const submit = () => {
    if (!s.notes.trim()) { ui.toast('Add a short finding before submitting', 'alert'); return; }
    repo.submitInspection(ref, { outcome: s.confirmed === false ? 'none' : s.outcome, findings: s.notes, assessedSeverity: s.severity, scope: s.scope, photos: s.photos });
    ui.toast('Inspection submitted · officer notified'); router.push('/inspector');
  };
  return (
    <FieldFrame aside="Field Inspector app">
      <header className="topbar"><Link className="icon-btn" href="/inspector" aria-label="Back"><Icon name="chevronL" size={20} /></Link><h1 className="grow ellipsis" style={{ fontSize: 17 }}>Inspection · {r.ref}</h1></header>
      <div className="screen stack">
        <div className="map" style={{ height: 170 }}><MapBase /><MapPin report={r} selected /><div className="mypos" style={{ left: `${r.pos.x - 8}%`, top: `${r.pos.y + 10}%` }} /></div>
        <div><h2>{r.title}</h2><p className="small muted row" style={{ marginTop: 4 }}><Icon name="pin" size={14} />{r.street}{r.landmark ? ' · ' + r.landmark : ''}, {communityName(r.community)}</p></div>
        <button className="btn btn-secondary btn-block" onClick={() => ui.toast('Opening directions in Maps…', 'nav')}><Icon name="nav" size={18} />Navigate · 2.1 km, 9 min</button>
        <div className="stat-pair" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
          <div className="stat"><div className="l">Reported</div><SeverityBadge severity={r.severity} /></div>
          <div className="stat"><div className="n tnum" style={{ fontSize: 20 }}>{r.affected}</div><div className="l">confirmations</div></div>
          <div className="stat"><div className="n tnum" style={{ fontSize: 20 }}>{r.photos.length}</div><div className="l">citizen photos</div></div>
        </div>
        {i.instructions && <div className="note"><b>Instructions:</b> {i.instructions}</div>}
        <div className="stack-sm"><span className="label">Citizen evidence</span>
          <div className="hscroll">{r.photos.filter((p) => p.phase === 'before').map((p, k) => <div key={k} style={{ width: 200, height: 140, borderRadius: 14, overflow: 'hidden' }}><Media photo={p} /></div>)}</div>
          <p className="small">{r.description}</p></div>

        {i.completedAt ? <div className="banner banner-info"><Icon name="check" size={20} /><div><b>Inspection submitted</b><p className="small">{INSPECTION_OUTCOMES[i.outcome ?? 'none'].label} · {i.findings}</p></div></div>
          : !i.startedAt ? <>
            <button className="btn btn-primary btn-block big-action" onClick={() => { repo.startInspection(ref, '6.4968° N, 3.3541° E ±8 m'); ui.toast('Inspection started · GPS and time recorded', 'target'); }}><Icon name="play" size={20} />Start inspection</button>
            <p className="xs faint" style={{ textAlign: 'center' }}>Your GPS position and the time are recorded when you start.</p></>
          : <>
            <div className="banner banner-sun"><Icon name="target" size={18} /><p className="small">On site since {new Date(i.startedAt).toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' })} · GPS {i.gps}</p></div>
            <div className="card stack">
              <div className="stack-sm"><span className="label">Inspection photos &amp; video</span>
                <div className="up-grid"><button className="up-tile" onClick={() => { set({ photos: s.photos + 1 }); ui.toast('Photo saved with GPS + timestamp', 'camera'); }}><Icon name="camera" size={22} />Take photo</button><button className="up-tile" onClick={() => ui.toast('Video recorded (0:15)', 'video')}><Icon name="video" size={22} />Add video</button></div>
                {s.photos > 0 && <div className="thumbs">{Array.from({ length: s.photos }, (_, k) => <div key={k} className="t"><Media photo={photoFor(r)} /></div>)}</div>}</div>
              <div className="stack-sm"><span className="label">Is the problem confirmed?</span>
                <div className="seg"><button aria-selected={s.confirmed === true} onClick={() => set({ confirmed: true })}>Yes, confirmed</button><button aria-selected={s.confirmed === false} onClick={() => set({ confirmed: false, outcome: 'none' })}>No / invalid</button></div></div>
              {s.confirmed !== false && <>
                <div className="stack-sm"><span className="label">Assessed severity</span><div className="chips">{(Object.keys(SEVERITY) as Severity[]).map((k) => <button key={k} className="chip" aria-pressed={s.severity === k} onClick={() => set({ severity: k })}>{SEVERITY[k].label}</button>)}</div></div>
                <label className="field"><span className="label">Recommended action</span><select className="select" value={s.outcome} onChange={(e) => set({ outcome: e.target.value as InspectionOutcome })}>{Object.entries(INSPECTION_OUTCOMES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></label>
                <label className="field"><span className="label">Estimated scope of work</span><input className="input" value={s.scope} onChange={(e) => set({ scope: e.target.value })} placeholder="e.g. Patch 3 potholes ≈ 9 m², desilt 40 m drain" /></label>
              </>}
              <label className="field"><span className="label">Findings (plain language — citizens see a summary)</span><textarea className="textarea" value={s.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="What you found on site" /></label>
            </div>
            <button className="btn btn-primary btn-block big-action" disabled={s.confirmed === null} onClick={submit}><Icon name="check" size={20} />Complete inspection</button>
          </>}
      </div>
    </FieldFrame>
  );
}
