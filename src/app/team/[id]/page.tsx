'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRepo, useUi } from '@/lib/store';
import { FieldFrame } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { Media, EmptyState, ProgressBar, communityName, photoFor } from '@/components/civic';
import { PROGRESS_STAGES } from '@/lib/domain/statuses';
import { fmtDate, isoInDays } from '@/lib/format';

const DELAY_REASONS = ['Work rescheduled due to heavy rainfall.', 'Replacement materials are being procured.', 'Further engineering assessment is required.', 'Site access blocked by traffic management.'];

export default function TeamJobPage() {
  const { id } = useParams<{ id: string }>(); const repo = useRepo(); const ui = useUi();
  const w = repo.getWorkOrder(id); const r = w && repo.getReport(w.reportRef);
  if (!w || !r) return <FieldFrame aside="Field team"><EmptyState title="Not found" body="This job doesn't exist." /></FieldFrame>;
  const c = repo.getContractor(w.contractor);

  const delayForm = () => ui.openModal(
    <form className="stack" onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); repo.reportDelay(id, new Date(f.get('date') + 'T17:00').toISOString(), String(f.get('reason'))); ui.closeModal(); ui.toast('Delay shared with original and new dates', 'clock'); }}>
      <h2>Report a blocker</h2>
      <label className="field"><span className="label">Reason (shown to citizens)</span><select className="select" name="reason">{DELAY_REASONS.map((x) => <option key={x}>{x}</option>)}</select></label>
      <label className="field"><span className="label">New target date</span><input className="input" type="date" name="date" defaultValue={isoInDays(5)} required /></label>
      <div className="row" style={{ justifyContent: 'flex-end' }}><button type="button" className="btn btn-ghost" onClick={ui.closeModal}>Cancel</button><button className="btn btn-primary">Request extension</button></div>
    </form>,
  );
  const completeForm = () => ui.openModal(
    <form className="stack" onSubmit={(e) => { e.preventDefault(); repo.completeWork(id, String(new FormData(e.currentTarget).get('note'))); ui.closeModal(); ui.toast('Completed · residents asked to confirm the fix', 'sparkle'); }}>
      <div><h2>Mark work completed</h2><p className="small muted">Completion needs photo evidence and a short note.</p></div>
      <label className="up-tile big" style={{ cursor: 'pointer', position: 'relative' }}><input type="checkbox" name="photo" required style={{ position: 'absolute', opacity: 0 }} /><Icon name="camera" size={28} />Tap to add completion photo<span className="xs">(required)</span></label>
      <label className="field"><span className="label">Completion note</span><textarea className="textarea" name="note" required defaultValue="Potholes excavated, base compacted and resurfaced. Drain desilted." /></label>
      <label className="field"><span className="label">Date completed</span><input className="input" type="date" name="date" defaultValue={isoInDays(0)} required /></label>
      <div className="row" style={{ justifyContent: 'flex-end' }}><button type="button" className="btn btn-ghost" onClick={ui.closeModal}>Cancel</button><button className="btn btn-primary">Submit completion</button></div>
    </form>,
  );

  return (
    <FieldFrame aside="Contractor / maintenance team app">
      <header className="topbar"><Link className="icon-btn" href="/team" aria-label="Back"><Icon name="chevronL" size={20} /></Link><h1 className="grow" style={{ fontSize: 17 }}>{w.id}</h1><span className="tag">{w.status.replace('_', ' ')}</span></header>
      <div className="screen stack">
        <div style={{ borderRadius: 16, overflow: 'hidden', height: 170 }}><Media photo={photoFor(r)} /></div>
        <div><h2>{r.title}</h2><p className="small muted row" style={{ marginTop: 4 }}><Icon name="pin" size={14} />{r.street}, {communityName(r.community)}</p></div>
        <div className="card stack-sm"><span className="label">Scope</span><p className="small">{w.scope}</p>
          <dl className="kv"><dt>Team</dt><dd>{c.name}</dd><dt>Start</dt><dd>{fmtDate(w.start)}</dd><dt>Target</dt><dd>{fmtDate(w.target)}</dd></dl>
          {r.inspection?.findings && <div className="note xs"><b>Inspector:</b> {r.inspection.findings}</div>}</div>
        <button className="btn btn-secondary btn-block" onClick={() => ui.toast('Opening directions…', 'nav')}><Icon name="nav" size={18} />Directions</button>

        {w.status === 'scheduled' && <>
          <button className="btn btn-primary btn-block big-action" onClick={() => { repo.startWork(id); ui.toast('Job started · residents notified'); }}><Icon name="play" size={20} />Start job</button>
          <p className="xs faint" style={{ textAlign: 'center' }}>Citizens following this issue will see “Work has started”.</p></>}
        {w.status === 'in_progress' && <>
          <div className="card stack"><div className="row between"><b>Progress</b><span className="small muted">{w.progress}%</span></div><ProgressBar pct={w.progress} height={10} />
            <div className="chips">{PROGRESS_STAGES.slice(1).map((s) => <button key={s.key} className="chip" aria-pressed={w.progress >= s.pct} disabled={w.progress >= s.pct} onClick={() => { repo.progressUpdate(id, s.key, `${s.label}.`); ui.toast('Progress shared'); }}>{s.label}</button>)}</div>
            <p className="xs faint">Pick the stage that best describes the work. Exact percentages aren’t required.</p></div>
          <div className="up-grid"><button className="up-tile" onClick={() => ui.toast('Progress photo uploaded', 'camera')}><Icon name="camera" size={22} />Progress photo</button><button className="up-tile" onClick={delayForm}><Icon name="alert" size={22} />Blocker / extension</button></div>
          <button className="btn btn-primary btn-block big-action" onClick={completeForm}><Icon name="check" size={20} />Mark work completed</button></>}
        {w.status === 'completed' && <div className="banner banner-info"><Icon name="check" size={20} /><div><b>Completed {fmtDate(w.actual)}</b><p className="small">Residents are now being asked to confirm the fix.</p></div></div>}
        {w.updates.length > 0 && <div className="card stack-sm"><b>Updates</b>{w.updates.map((u) => <div key={u.at} className="row small"><span className="faint xs" style={{ width: 52 }}>{fmtDate(u.at)}</span><span className="grow">{u.note}</span></div>)}</div>}
      </div>
    </FieldFrame>
  );
}
