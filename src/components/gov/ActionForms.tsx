'use client';
// Officer action forms, shown in the modal. Each writes through the repository (timeline + audit log).
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useRepo, useUi } from '@/lib/store';
import { INSPECTORS } from './queues';
import { AGENCIES } from '@/lib/domain/routing';
import { SEVERITY, REJECT_REASONS, INSPECTION_OUTCOMES } from '@/lib/domain/statuses';
import { isoInDays } from '@/lib/format';
import type { Report, Severity, Priority, RejectReason } from '@/lib/domain/types';

const PRIORITIES: [Priority, string][] = [['urgent', 'Urgent'], ['high', 'High'], ['medium', 'Medium'], ['low', 'Low']];

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="field"><span className="label">{label}</span>{children}</label>;
}
export function Select({ name, options, value }: { name: string; options: [string, string][]; value?: string }) {
  return <select className="select" name={name} defaultValue={value} required>{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>;
}
export function FormModal({ title, sub, submit, onSubmit, children }: { title: string; sub?: string; submit: string; onSubmit: (f: Record<string, string>) => void | false; children: ReactNode }) {
  const ui = useUi();
  return (
    <form className="stack" onSubmit={(e) => { e.preventDefault(); if (onSubmit(Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>) !== false) ui.closeModal(); }}>
      <div><h2>{title}</h2>{sub && <p className="small muted" style={{ marginTop: 4 }}>{sub}</p>}</div>
      {children}
      <div className="row" style={{ justifyContent: 'flex-end' }}><button type="button" className="btn btn-ghost" onClick={ui.closeModal}>Cancel</button><button className="btn btn-primary">{submit}</button></div>
    </form>
  );
}

export function VerifyForm({ r }: { r: Report }) {
  const repo = useRepo(); const ui = useUi();
  return (
    <FormModal title="Verify report" sub="Confirm this is a genuine public infrastructure issue." submit="Verify"
      onSubmit={(f) => { repo.verify(r.ref, { severity: f.severity as Severity, priority: f.priority as Priority }); ui.toast('Verified · citizen notified'); }}>
      <Field label="Validated severity"><Select name="severity" value={r.severity} options={Object.entries(SEVERITY).map(([k, v]) => [k, v.label])} /></Field>
      <Field label="Priority"><Select name="priority" value={r.priority} options={PRIORITIES} /></Field>
      <p className="xs muted">Priority is based on severity and impact, not only on how many people confirmed it ({r.affected}).</p>
    </FormModal>
  );
}

export function AssignForm({ r }: { r: Report }) {
  const repo = useRepo(); const ui = useUi();
  return (
    <FormModal title="Assign responsible authority" sub="Transfers are shown transparently on the public timeline." submit="Assign"
      onSubmit={(f) => { repo.assign(r.ref, f.agency, f.reason); ui.toast('Assignment saved'); }}>
      <Field label="Authority"><Select name="agency" value={r.agency} options={Object.values(AGENCIES).filter((a) => a.id !== 'triage').map((a) => [a.id, `${a.name} (${a.level})`])} /></Field>
      <Field label="Public reason (shown to citizens)"><input className="input" name="reason" placeholder="e.g. This road is state-managed" /></Field>
    </FormModal>
  );
}

export function ScheduleForm({ r }: { r: Report }) {
  const repo = useRepo(); const ui = useUi();
  return (
    <FormModal title="Schedule inspection" sub="The citizen will see the inspection date." submit="Schedule"
      onSubmit={(f) => { repo.scheduleInspection(r.ref, { inspector: f.inspector, date: new Date(f.date + 'T10:00').toISOString(), window: f.window, instructions: f.instructions, priority: f.priority as Priority }); ui.toast('Inspection scheduled · citizen notified', 'calendar'); }}>
      <Field label="Inspector"><Select name="inspector" options={INSPECTORS.map((p) => [p.id, `${p.name} — ${AGENCIES[p.agency!].short}`])} /></Field>
      <div className="row gap-12">
        <Field label="Date"><input className="input" type="date" name="date" defaultValue={isoInDays(r.urgent ? 0 : 2)} required /></Field>
        <Field label="Time window"><Select name="window" value="10am – 1pm" options={[['8am – 11am', '8am – 11am'], ['10am – 1pm', '10am – 1pm'], ['1pm – 4pm', '1pm – 4pm']]} /></Field>
      </div>
      <Field label="Priority"><Select name="priority" value={r.priority} options={PRIORITIES} /></Field>
      <Field label="Instructions for inspector"><textarea className="textarea" name="instructions" placeholder="What to check on site" /></Field>
    </FormModal>
  );
}

export function RejectForm({ r }: { r: Report }) {
  const repo = useRepo(); const ui = useUi(); const router = useRouter();
  return (
    <FormModal title="Reject report" submit="Reject report" onSubmit={(f) => { repo.reject(r.ref, f.reason as RejectReason, f.note); ui.toast('Report closed with explanation'); router.push('/gov/reports'); }}>
      <Field label="Reason (required)"><Select name="reason" value="insufficient" options={Object.entries(REJECT_REASONS).map(([k, v]) => [k, v.label])} /></Field>
      <Field label="Note to citizen (optional)"><textarea className="textarea" name="note" /></Field>
      <div className="note">The citizen receives a friendly explanation for the reason you pick.</div>
    </FormModal>
  );
}

export function MergeForm({ r }: { r: Report }) {
  const repo = useRepo(); const ui = useUi(); const router = useRouter();
  const cands = repo.allReportsInternal().filter((x) => x.ref !== r.ref && !x.mergedInto && x.category === r.category);
  return (
    <FormModal title="Merge duplicate" submit="Merge" onSubmit={(f) => { repo.merge(r.ref, f.into); ui.toast('Merged'); router.push(`/gov/reports/${f.into}`); }}>
      {cands.length ? <><Field label="Merge this report into"><Select name="into" options={cands.map((c) => [c.ref, `${c.ref} — ${c.title}`])} /></Field><p className="xs muted">Confirmations and followers move to the main report.</p></> : <p className="muted">No similar reports found.</p>}
    </FormModal>
  );
}

export function UpdateForm({ r, mode }: { r: Report; mode: 'public' | 'info' | 'note' }) {
  const repo = useRepo(); const ui = useUi();
  const cfg = {
    public: { title: 'Add public update', sub: 'Avoid vague words like “processing”. Say what is happening and when.', label: 'Update (plain language)', submit: 'Publish update', def: '' },
    info: { title: 'Request more information', sub: '', label: 'What do you need?', submit: 'Send request', def: 'Could you add a photo showing the nearest landmark? It will help our inspector find the exact spot.' },
    note: { title: 'Internal note', sub: '', label: 'Note (never public)', submit: 'Save note', def: '' },
  }[mode];
  return (
    <FormModal title={cfg.title} sub={cfg.sub} submit={cfg.submit}
      onSubmit={(f) => { if (mode === 'note') repo.internalNote(r.ref, f.text); else repo.publicUpdate(r.ref, f.text); ui.toast(mode === 'note' ? 'Note saved' : 'Update published'); }}>
      <Field label={cfg.label}><textarea className="textarea" name="text" required defaultValue={cfg.def} /></Field>
    </FormModal>
  );
}

export function ApproveForm({ r }: { r: Report }) {
  const repo = useRepo(); const ui = useUi(); const i = r.inspection!;
  return (
    <FormModal title="Approve work" sub="Citizens see the work type and dates. Budget and funding stay internal." submit="Approve & create work order"
      onSubmit={(f) => {
        const id = repo.approveWork(r.ref, { scope: f.scope, contractor: f.contractor, workType: f.workType, funding: f.funding, estimate: +f.estimate, start: new Date(f.start + 'T08:00').toISOString(), target: new Date(f.target + 'T17:00').toISOString() });
        ui.toast(`${id} created · citizens notified`, 'wrench');
      }}>
      <div className="note"><b>Inspector recommends:</b> {INSPECTION_OUTCOMES[i.outcome ?? 'repair'].label}. {i.findings}</div>
      <Field label="Type of work (public)"><Select name="workType" value={i.outcome === 'replacement' ? 'Replacement' : 'Repair'} options={[['Repair', 'Repair'], ['Maintenance', 'Maintenance'], ['Replacement', 'Replacement'], ['Emergency work', 'Emergency work']]} /></Field>
      <Field label="Scope"><textarea className="textarea" name="scope" required defaultValue={i.scope || i.findings || ''} /></Field>
      <Field label="Contractor / maintenance team"><Select name="contractor" value="c-2" options={repo.listContractors().map((c) => [c.id, `${c.name} — ${c.speciality}`])} /></Field>
      <div className="row gap-12">
        <Field label="Start date"><input className="input" type="date" name="start" defaultValue={isoInDays(3)} required /></Field>
        <Field label="Target completion"><input className="input" type="date" name="target" defaultValue={isoInDays(10)} required /></Field>
      </div>
      <div className="row gap-12">
        <Field label="Estimated budget (₦) · internal"><input className="input" type="number" name="estimate" defaultValue={1500000} /></Field>
        <Field label="Funding source · internal"><Select name="funding" options={[['LGA maintenance budget 2026', 'LGA maintenance 2026'], ['State works budget 2026', 'State works 2026'], ['Emergency fund', 'Emergency fund']]} /></Field>
      </div>
    </FormModal>
  );
}
