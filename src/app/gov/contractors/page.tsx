'use client';
import Link from 'next/link';
import { useRepo, useUi } from '@/lib/store';
import { PTop } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/civic';
import { Field, Select, FormModal } from '@/components/gov/ActionForms';
import { fmtDate } from '@/lib/format';
import type { Contractor, WorkOrder } from '@/lib/domain/types';

// Contractors and internal maintenance teams, with live workload and delivery record from their work orders.
export default function ContractorsPage() {
  const repo = useRepo(); const ui = useUi();
  const orders = repo.listWorkOrders();
  const stats = (c: Contractor) => {
    const mine = orders.filter((w) => w.contractor === c.id);
    const done = mine.filter((w) => w.status === 'completed');
    const onTime = done.filter((w) => w.actual && new Date(w.actual) <= new Date(w.originalTarget ?? w.target)).length;
    return { mine, active: mine.filter((w) => ['scheduled', 'in_progress', 'paused'].includes(w.status)), done, delayed: mine.filter((w) => !!w.originalTarget), onTime };
  };
  return <>
    <PTop title="Contractors & teams" sub="Workload and delivery record, from their work orders on NaijaWorks.">
      <button className="btn btn-primary" onClick={() => ui.openModal(<AddContractorForm />)}><Icon name="plus" size={17} />Add contractor or team</button>
    </PTop>
    <div className="pgrid" style={{ marginTop: 0 }}>{repo.listContractors().map((c) => {
      const s = stats(c);
      return (
        <div key={c.id} className="card span-6 stack">
          <div className="row gap-12">
            <span style={{ width: 44, height: 44, borderRadius: 14, display: 'grid', placeItems: 'center', background: c.kind === 'internal' ? 'var(--brand-soft)' : 'var(--sun-soft)', color: c.kind === 'internal' ? 'var(--brand)' : '#8A6400' }}><Icon name={c.kind === 'internal' ? 'building' : 'hammer'} size={20} /></span>
            <div className="grow"><h3>{c.name}</h3><div className="xs muted">{c.speciality} · {c.kind === 'internal' ? 'Internal maintenance team' : 'Contractor'}</div></div>
          </div>
          <div className="stat-pair" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            <div className="stat"><div className="n tnum">{s.active.length}</div><div className="l">active jobs</div></div>
            <div className="stat"><div className="n tnum">{s.done.length}</div><div className="l">completed</div></div>
            <div className="stat"><div className="n tnum" style={s.delayed.length ? { color: 'var(--st-planned)' } : undefined}>{s.delayed.length}</div><div className="l">rescheduled</div></div>
            <div className="stat"><div className="n tnum">{s.done.length ? `${Math.round((s.onTime / s.done.length) * 100)}%` : '—'}</div><div className="l">on time</div></div>
          </div>
          {s.mine.length ? <div className="stack-sm">{s.mine.slice(0, 3).map((w) => <JobRow key={w.id} w={w} />)}</div> : <p className="small muted">No work orders yet.</p>}
        </div>);
    })}</div>
  </>;
}

function JobRow({ w }: { w: WorkOrder }) {
  return (
    <Link href={`/gov/work-orders/${w.id}`} className="row gap-12 card-hover" style={{ padding: '8px 10px', borderRadius: 12, border: '1px solid var(--line)' }}>
      <div className="grow stack-sm" style={{ minWidth: 0 }}>
        <div className="row between xs"><b className="tnum">{w.id}</b><span className="faint">{w.status.replace('_', ' ')} · due {fmtDate(w.target)}{w.originalTarget ? ` (was ${fmtDate(w.originalTarget)})` : ''}</span></div>
        <div className="small ellipsis">{w.scope}</div>
        <ProgressBar pct={w.progress} />
      </div>
    </Link>
  );
}

function AddContractorForm() {
  const repo = useRepo(); const ui = useUi();
  return (
    <FormModal title="Add contractor or team" sub="They will appear in the team list when you approve work." submit="Add"
      onSubmit={(f) => { repo.addContractor({ name: f.name.trim(), kind: f.kind as Contractor['kind'], speciality: f.speciality.trim() }); ui.toast(`${f.name} added`); }}>
      <Field label="Name"><input className="input" name="name" required placeholder="e.g. Adebayo & Sons Civil Works" /></Field>
      <Field label="Type"><Select name="kind" value="contractor" options={[['contractor', 'Contractor'], ['internal', 'Internal maintenance team']]} /></Field>
      <Field label="Speciality"><input className="input" name="speciality" required placeholder="e.g. Drainage & desilting" /></Field>
    </FormModal>
  );
}
