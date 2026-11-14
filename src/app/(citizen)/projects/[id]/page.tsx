'use client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useRepo, useUi } from '@/lib/store';
import { CitizenShell } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { Scene } from '@/components/ui/Scene';
import { NotFound } from '@/components/civic/NotFound';
import { communityName } from '@/components/civic';
import { AGENCIES } from '@/lib/domain/routing';
import { fmtDate } from '@/lib/format';

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>(); const repo = useRepo(); const ui = useUi(); const router = useRouter();
  const p = repo.getProject(id);
  if (!p) return <NotFound />;
  const long = { day: 'numeric', month: 'short', year: 'numeric' } as const;
  return (
    <CitizenShell nav="community">
      <div className="gallery"><Scene name={p.agency === 'lslights' ? 'streetlight-fixed' : p.agency === 'lsmoe' ? 'drainage' : 'school'} />
        <div className="nav-over"><button className="icon-btn" onClick={() => router.back()} aria-label="Back"><Icon name="chevronL" size={20} /></button></div></div>
      <div className="screen sheet-top stack">
        <div className="row wrap"><span className="tag"><Icon name="crane" size={13} />Public project</span>{p.stalled ? <span className="sev sev-serious">Behind schedule</span> : <span className="status" style={{ '--c': 'var(--st-active)' } as React.CSSProperties}>On track</span>}</div>
        <h1 style={{ fontSize: 24 }}>{p.name}</h1><p className="muted">{p.description}</p>
        <div className="card"><dl className="kv">
          <dt>Responsible</dt><dd>{AGENCIES[p.agency].name}</dd><dt>Location</dt><dd>{communityName(p.community)}, Lagos</dd>
          <dt>Started</dt><dd>{fmtDate(p.start, long)}</dd><dt>Expected completion</dt><dd>{fmtDate(p.expected, long)}{p.originalExpected && <div className="xs faint">was <s>{fmtDate(p.originalExpected, long)}</s></div>}</dd><dt>Following</dt><dd>{p.followers} people</dd></dl></div>
        <div className="next-card stack-sm"><div className="xs faint" style={{ fontWeight: 700 }}>LATEST UPDATE</div><p>{p.latest}</p>
          {p.delayReason && <div className="delay-box"><b>Rescheduled:</b> {p.delayReason}</div>}
          {(p.updates?.length ?? 0) > 1 && <div className="stack-sm" style={{ marginTop: 6 }}>{p.updates!.slice(1, 4).map((u) => <div key={u.at} className="xs muted">{fmtDate(u.at)} · {u.text}</div>)}</div>}</div>
        <div className="card"><h2 style={{ marginBottom: 14 }}>Milestones</h2><ol className="vtrack">{p.milestones.map((m, i) => (
          <li key={m} className={i < p.stage ? 'done' : i === p.stage ? 'now' : 'todo'}><span className="node">{i < p.stage && <Icon name="check" size={14} />}</span><div className="t">{m}</div><span /></li>))}</ol></div>
        <div className="stack-sm">
          <button className="btn btn-primary btn-block" onClick={() => ui.toast('You’re following this project', 'bell')}><Icon name="bell" size={18} />Follow project</button>
          <div className="row gap-12">
            <button className="btn btn-secondary grow" onClick={() => ui.toast(`Update requested from ${AGENCIES[p.agency].short}`, 'megaphone')}><Icon name="megaphone" size={17} />Ask for update</button>
            <Link className="btn btn-secondary grow" href="/report"><Icon name="flag" size={17} />Report a problem</Link>
          </div>
        </div>
      </div>
    </CitizenShell>
  );
}
