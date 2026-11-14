'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRepo, useUi } from '@/lib/store';
import { PTop } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { Media, StatusBadge, SeverityBadge, Timeline, MapBase, MapPin, CatIcon, AuthorityLogo, EmptyState, communityName } from '@/components/civic';
import { VerifyForm, AssignForm, ScheduleForm, RejectForm, MergeForm, UpdateForm, ApproveForm } from '@/components/gov/ActionForms';
import { INSPECTORS } from '@/components/gov/queues';
import { categoryByKey } from '@/lib/domain/categories';
import { AGENCIES } from '@/lib/domain/routing';
import { INSPECTION_OUTCOMES } from '@/lib/domain/statuses';
import { fmtDate, timeAgo } from '@/lib/format';
import type { Report } from '@/lib/domain/types';

const ANSWER_LABEL: Record<string, string> = { duration: 'Duration', access: 'Blocks access', safety: 'Safety risk' };

export default function ReportReviewPage() {
  const { ref } = useParams<{ ref: string }>(); const repo = useRepo(); const ui = useUi();
  const r = repo.getReport(ref);
  if (!r) return <div className="card"><EmptyState title="Report not found" body="It may have been merged into another report." /></div>;
  const insp = r.inspection; const wo = r.workOrder ? repo.getWorkOrder(r.workOrder) : undefined;
  const dups = repo.allReportsInternal().filter((x) => x.ref !== r.ref && x.category === r.category && x.community === r.community && !x.mergedInto && x.status !== 'monitoring').slice(0, 3);
  const inspector = insp && INSPECTORS.find((p) => p.id === insp.inspector);
  const open = (F: (p: { r: Report }) => React.ReactNode) => () => ui.openModal(<F r={r} />);
  const active = !['completed', 'monitoring', 'unable'].includes(r.status);
  const primary: Partial<Record<Report['status'], [string, string, () => void]>> = {
    reported: ['check', 'Verify report', open(VerifyForm)], under_review: ['check', 'Verify report', open(VerifyForm)], verified: ['building', 'Assign authority', open(AssignForm)],
    assigned: ['calendar', 'Schedule inspection', open(ScheduleForm)], reopened: ['calendar', 'Schedule re-inspection', open(ScheduleForm)], inspected: ['tools', 'Approve work', open(ApproveForm)],
  };
  const p = primary[r.status];
  const photos = r.photos.length ? r.photos : [{ phase: 'before' as const, scene: r.category }];

  return <>
    <div className="row xs muted" style={{ marginBottom: 10 }}><Link href="/gov/reports" className="link" style={{ fontSize: 13 }}>Reports</Link><Icon name="chevronR" size={14} /><span className="tnum">{r.ref}</span></div>
    <PTop title={r.title} sub={`${categoryByKey(r.category).label}${r.subtype ? ' · ' + r.subtype : ''} · ${r.street}, ${communityName(r.community)} · reported ${fmtDate(r.createdAt, { day: 'numeric', month: 'short', year: 'numeric' })}`}>
      <Link className="btn btn-ghost btn-sm" href={`/issue/${r.ref}`}><Icon name="eye" size={16} />Citizen view</Link>
      {p && <button className="btn btn-primary" onClick={p[2]}><Icon name={p[0]} size={17} />{p[1]}</button>}
    </PTop>
    {r.urgent && !['completed', 'monitoring'].includes(r.status) && <div className="banner banner-urgent" style={{ marginBottom: 16 }}><Icon name="alert" size={20} /><div><b>Potential urgent safety issue.</b> <span className="small">Citizen-reported severity — validate before prioritising. {r.supporting ? `${AGENCIES[r.supporting].short} has been notified.` : ''}</span></div></div>}

    <div className="pgrid" style={{ marginTop: 0 }}>
      <div className="span-8 stack">
        <div className="card"><div className="row between"><h3>Evidence</h3><span className="xs faint">{r.photos.length} item(s) · {r.identity === 'private' ? 'reporter private publicly' : 'reporter: ' + (r.reporterName ?? 'community member')}</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 10, marginTop: 12 }}>{photos.map((ph, i) => (
            <div key={i} style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}><Media photo={ph} /><span className="tag" style={{ position: 'absolute', left: 8, bottom: 8, background: 'var(--surface)' }}>{ph.phase}</span></div>))}</div>
          <p style={{ marginTop: 14 }}>{r.description}</p>
          {r.answers && <div className="chips" style={{ marginTop: 10 }}>{Object.entries(r.answers).map(([k, v]) => <span key={k} className="tag">{ANSWER_LABEL[k] ?? k}: {v}</span>)}</div>}
        </div>
        {insp?.completedAt && <div className="card stack-sm"><div className="row between"><h3>Inspection report</h3><span className="xs faint">{inspector?.name} · {fmtDate(insp.completedAt)}</span></div>
          <dl className="kv"><dt>Outcome</dt><dd>{INSPECTION_OUTCOMES[insp.outcome ?? 'none'].label}</dd><dt>Assessed severity</dt><dd><SeverityBadge severity={insp.assessedSeverity} /></dd>
            {insp.scope && <><dt>Scope estimate</dt><dd>{insp.scope}</dd></>}{insp.gps && <><dt>GPS</dt><dd className="tnum">{insp.gps}</dd></>}</dl>
          <p className="small">{insp.findings}</p></div>}
        {wo && <Link className="card card-hover row gap-12" href={`/gov/work-orders/${wo.id}`}><span style={{ width: 42, height: 42, borderRadius: 12, background: 'color-mix(in srgb, var(--st-active) 14%, transparent)', color: 'var(--st-active)', display: 'grid', placeItems: 'center' }}><Icon name="wrench" size={20} /></span>
          <div className="grow"><b>{wo.id}</b><div className="small muted">{wo.scope}</div></div><span className="tag">{wo.status.replace('_', ' ')}</span><Icon name="chevronR" size={18} /></Link>}
        <div className="card"><div className="row between" style={{ marginBottom: 14 }}><h3>Public timeline</h3><button className="btn btn-secondary btn-sm" onClick={() => ui.openModal(<UpdateForm r={r} mode="public" />)}><Icon name="megaphone" size={15} />Add public update</button></div><Timeline items={r.timeline} delay={r.delay} /></div>
      </div>

      <div className="span-4 stack">
        <div className="card stack-sm"><div className="row between"><h3>Status</h3><StatusBadge status={r.status} /></div>
          <dl className="kv"><dt>Priority</dt><dd><span className={`priority ${r.priority}`}>{r.priority}</span></dd><dt>Citizen severity</dt><dd><SeverityBadge severity={r.severity} /></dd>
            <dt>Validated</dt><dd>{r.validatedSeverity ? <SeverityBadge severity={r.validatedSeverity} /> : <span className="faint">Not yet</span>}</dd>
            <dt>Confirmations</dt><dd className="tnum">{r.affected}</dd><dt>Followers</dt><dd className="tnum">{r.followers.length}</dd>{r.eta && <><dt>Target</dt><dd>{fmtDate(r.eta)}</dd></>}</dl></div>
        <div className="card stack-sm"><h3>Routing</h3><div className="authority"><AuthorityLogo agency={r.agency} /><div><b className="small">{AGENCIES[r.agency].name}</b><div className="xs muted">{r.routingState}</div></div></div>
          {r.routingReason && <p className="xs muted">{r.routingReason}</p>}<button className="btn btn-secondary btn-sm" onClick={open(AssignForm)}><Icon name="refresh" size={15} />Transfer / reassign</button></div>
        <div className="card stack-sm"><h3>Actions</h3><div className="action-bar">
          {['reported', 'under_review'].includes(r.status) && <button className="btn btn-secondary btn-sm" onClick={open(VerifyForm)}><Icon name="check" size={15} />Verify</button>}
          {active && <button className="btn btn-secondary btn-sm" onClick={open(ScheduleForm)}><Icon name="calendar" size={15} />Schedule inspection</button>}
          {r.status === 'inspected' && <button className="btn btn-secondary btn-sm" onClick={open(ApproveForm)}><Icon name="tools" size={15} />Approve work</button>}
          <button className="btn btn-secondary btn-sm" onClick={() => ui.openModal(<UpdateForm r={r} mode="info" />)}><Icon name="info" size={15} />Request info</button>
          <button className="btn btn-secondary btn-sm" onClick={open(MergeForm)}><Icon name="layers" size={15} />Merge duplicate</button>
          <button className="btn btn-secondary btn-sm" onClick={() => ui.openModal(<UpdateForm r={r} mode="note" />)}><Icon name="clipboard" size={15} />Internal note</button>
          {active && <button className="btn btn-ghost btn-sm" style={{ color: 'var(--clay)' }} onClick={open(RejectForm)}><Icon name="x" size={15} />Reject</button>}
        </div></div>
        {dups.length > 0 && <div className="card stack-sm"><h3>Possible duplicates</h3>{dups.map((d) => <Link key={d.ref} className="row gap-12 small" href={`/gov/reports/${d.ref}`}><CatIcon category={d.category} size={26} /><span className="grow ellipsis">{d.street} — {d.title}</span><StatusBadge status={d.status} /></Link>)}</div>}
        {r.notes?.length ? <div className="card stack-sm"><h3>Internal notes <span className="xs faint">(not public)</span></h3>{r.notes.map((n) => <div key={n.at} className="note"><div className="xs faint">{n.by} · {timeAgo(n.at)}</div>{n.text}</div>)}</div> : null}
        <div className="card"><h3>Location</h3><div className="map" style={{ height: 180, marginTop: 10 }}><MapBase /><MapPin report={r} selected /></div><p className="xs muted" style={{ marginTop: 8 }}>{r.landmark} · {communityName(r.community)} · Lagos</p></div>
      </div>
    </div>
  </>;
}
