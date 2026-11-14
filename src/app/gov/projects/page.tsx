'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRepo, useUi } from '@/lib/store';
import { PTop } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { EmptyState, communityName } from '@/components/civic';
import { Field, Select, FormModal } from '@/components/gov/ActionForms';
import { AGENCIES } from '@/lib/domain/routing';
import { fmtDate, timeAgo } from '@/lib/format';
import type { Project } from '@/lib/domain/types';

type Filter = 'all' | 'on_track' | 'behind' | 'done';
const isDone = (p: Project) => p.stage >= p.milestones.length - 1;
const isBehind = (p: Project) => !isDone(p) && (!!p.stalled || new Date(p.expected) < new Date());

// Larger infrastructure work tracked by milestone. Updates here show on the public project page.
export default function ProjectsPage() {
  const repo = useRepo(); const ui = useUi(); const [filter, setFilter] = useState<Filter>('all');
  const all = repo.listProjects();
  const counts: Record<Filter, number> = { all: all.length, on_track: all.filter((p) => !isDone(p) && !isBehind(p)).length, behind: all.filter(isBehind).length, done: all.filter(isDone).length };
  const list = all.filter((p) => filter === 'all' || (filter === 'done' ? isDone(p) : filter === 'behind' ? isBehind(p) : !isDone(p) && !isBehind(p)));

  return <>
    <PTop title="Projects" sub="Larger infrastructure work, tracked by milestone. Updates you post here appear on the public project page." />
    <div className="tabs" role="tablist">{([['all', 'All'], ['on_track', 'On track'], ['behind', 'Behind schedule'], ['done', 'Completed']] as [Filter, string][]).map(([k, l]) => (
      <button key={k} role="tab" aria-selected={filter === k} onClick={() => setFilter(k)}>{l}<span className="n">{counts[k]}</span></button>))}</div>
    {list.length ? <div className="stack">{list.map((p) => {
      const pct = Math.round((p.stage / (p.milestones.length - 1)) * 100);
      return (
        <div key={p.id} className="card stack">
          <div className="row between wrap" style={{ gap: 12 }}>
            <div className="grow" style={{ minWidth: 240 }}>
              <div className="row wrap" style={{ gap: 8 }}><h3 style={{ fontSize: 17 }}>{p.name}</h3>
                {isDone(p) ? <span className="pill" style={{ '--c': 'var(--st-done)' } as React.CSSProperties}>Completed</span> : isBehind(p) ? <span className="pill" style={{ '--c': 'var(--st-planned)' } as React.CSSProperties}>Behind schedule</span> : <span className="pill" style={{ '--c': 'var(--st-active)' } as React.CSSProperties}>On track</span>}</div>
              <p className="small muted" style={{ marginTop: 4 }}>{AGENCIES[p.agency].name} · {communityName(p.community)} · {p.followers} citizens following</p>
            </div>
            <div className="row"><Link className="btn btn-ghost btn-sm" href={`/projects/${p.id}`}><Icon name="eye" size={15} />Public page</Link>
              <button className="btn btn-primary btn-sm" onClick={() => ui.openModal(<ProjectUpdateForm p={p} />)}><Icon name="megaphone" size={15} />Post update</button></div>
          </div>
          {/* Milestone strip */}
          <div>
            <div className="row between xs muted" style={{ marginBottom: 6 }}><span>Stage {p.stage + 1} of {p.milestones.length}: <b style={{ color: 'var(--ink)' }}>{p.milestones[p.stage]}</b></span><span className="tnum">{pct}%</span></div>
            <div className="milestones">{p.milestones.map((m, i) => <span key={m} title={m} className={i < p.stage ? 'done' : i === p.stage ? 'now' : ''} />)}</div>
          </div>
          <div className="pgrid" style={{ marginTop: 0, gap: 12 }}>
            <dl className="kv span-5" style={{ alignContent: 'start' }}>
              <dt>Started</dt><dd>{fmtDate(p.start, { day: 'numeric', month: 'short', year: 'numeric' })}</dd>
              <dt>Expected completion</dt><dd>{fmtDate(p.expected, { day: 'numeric', month: 'short', year: 'numeric' })}{p.originalExpected && <div className="xs faint">was <s>{fmtDate(p.originalExpected)}</s></div>}</dd>
              {p.delayReason && <><dt>Reason for delay</dt><dd className="small">{p.delayReason}</dd></>}
            </dl>
            <div className="span-7 stack-sm">
              <div className="note small"><b>Latest public update:</b> {p.latest}</div>
              {p.updates?.slice(0, 2).map((u) => <div key={u.at} className="xs muted">{timeAgo(u.at)} · {u.text}</div>)}
            </div>
          </div>
        </div>);
    })}</div> : <div className="card"><EmptyState title="No projects here" body="Nothing matches this filter." /></div>}
  </>;
}

function ProjectUpdateForm({ p }: { p: Project }) {
  const repo = useRepo(); const ui = useUi();
  return (
    <FormModal title={`Update: ${p.name}`} sub="Write for citizens: say what happened and what comes next. A changed date needs a reason." submit="Publish update"
      onSubmit={(f) => {
        const expected = f.expected ? new Date(f.expected + 'T17:00').toISOString() : undefined;
        const moved = expected && f.expected !== p.expected.slice(0, 10);
        if (moved && !f.delayReason.trim()) { ui.toast('Add a reason for the new date', 'alert'); return false; }
        repo.updateProject(p.id, { latest: f.latest, stage: +f.stage, stalled: f.stalled === 'yes', expected: moved ? expected : undefined, delayReason: moved ? f.delayReason : undefined });
        ui.toast('Project update published', 'megaphone');
      }}>
      <Field label="Current milestone"><Select name="stage" value={String(p.stage)} options={p.milestones.map((m, i) => [String(i), `${i + 1}. ${m}`])} /></Field>
      <Field label="Public update"><textarea className="textarea" name="latest" required defaultValue="" placeholder="e.g. Culverts between Adelabu and Shoprite are complete; road surfacing starts Monday." /></Field>
      <div className="row gap-12">
        <Field label="Expected completion"><input className="input" type="date" name="expected" defaultValue={p.expected.slice(0, 10)} /></Field>
        <Field label="Status"><Select name="stalled" value={p.stalled ? 'yes' : 'no'} options={[['no', 'Work is progressing'], ['yes', 'Work has stalled']]} /></Field>
      </div>
      <Field label="Reason, if the date changes (shown publicly)"><input className="input" name="delayReason" defaultValue={p.delayReason ?? ''} placeholder="e.g. Replacement materials are being procured" /></Field>
    </FormModal>
  );
}
