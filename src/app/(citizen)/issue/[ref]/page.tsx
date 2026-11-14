'use client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useRepo, useUi } from '@/lib/store';
import { CitizenShell } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { NotFound } from '@/components/civic/NotFound';
import {
  Media, StatusHero, SeverityBadge, CatIcon, BeforeAfter, ProgressTracker, Timeline, MapBase, MapPin, AuthorityLogo, InlineIcon,
  communityName, photoFor,
} from '@/components/civic';
import { categoryByKey } from '@/lib/domain/categories';
import { SEVERITY } from '@/lib/domain/statuses';
import { AGENCIES, LEVEL_EXPLAINER } from '@/lib/domain/routing';
import { PEOPLE } from '@/lib/api/repo';
import { fmtDate, fmtN } from '@/lib/format';
import type { ResolutionAnswer } from '@/lib/domain/types';

const ANSWERS: [ResolutionAnswer, string, string][] = [['yes', 'check', 'Yes, it is fixed'], ['partial', 'tools', 'Partially fixed'], ['no', 'x', 'No, problem remains'], ['unsure', 'info', 'I cannot confirm']];

export default function IssuePage() {
  const { ref } = useParams<{ ref: string }>(); const repo = useRepo(); const ui = useUi(); const router = useRouter();
  const r = repo.getReport(ref);
  if (!r) return <NotFound />;
  const me = repo.state.user.id; const following = r.followers.includes(me);
  const affected = repo.state.myConfirmations[ref] === 'affected' || r.reporterId === me;
  const done = ['completed', 'monitoring'].includes(r.status);
  const photos = r.photos.length ? r.photos : [{ phase: 'before' as const, scene: categoryByKey(r.category).key }];
  const transfer = r.timeline.find((x) => x.title.startsWith('Transferred'));
  const myRes = repo.state.myConfirmations[ref + ':res'] as ResolutionAnswer | undefined;
  const reporter = r.identity === 'first_name' && r.reporterName ? r.reporterName : r.identity === 'community_member' ? 'A community member' : 'Private reporter';
  const insp = r.inspection; const inspector = insp && Object.values(PEOPLE).find((p) => p.id === insp.inspector);

  const follow = () => { repo.toggleFollow(ref); ui.toast(following ? 'Unfollowed' : 'Following. You’ll get every update.', 'bell'); };
  const confirmFix = (v: ResolutionAnswer) => {
    repo.confirmResolution(ref, v);
    if (v === 'yes' && !r.urgent && (r.reporterId === me || following)) { ui.confetti(); ui.toast('Wonderful! Thanks for confirming.', 'sparkle'); }
    else ui.toast(v === 'no' || v === 'partial' ? 'Thanks. If others agree, this goes back for review.' : 'Thanks for your answer.');
  };

  return (
    <CitizenShell nav="explore">
      <div className="gallery gallery-short"><Media photo={photos[0]} />
        <div className="nav-over">
          <button className="icon-btn" onClick={() => (history.length > 1 ? router.back() : router.push('/'))} aria-label="Back"><Icon name="chevronL" size={20} /></button>
          <div className="row">
            <button className="icon-btn" onClick={() => { navigator.clipboard?.writeText(location.href); ui.toast('Link copied', 'upload'); }} aria-label="Share"><Icon name="upload" size={18} /></button>
            <button className="icon-btn" onClick={follow} aria-label={following ? 'Unfollow' : 'Follow'} style={following ? { color: 'var(--brand)' } : undefined}><Icon name="bell" size={18} /></button>
          </div>
        </div>
        <span className="count"><InlineIcon name="image" />{photos.length}</span>
      </div>

      <div className="screen sheet-top stack">
        {r.status === 'unable'
          ? <div className="banner banner-info"><Icon name="info" size={20} /><div><b>Why this report can’t go further</b><p className="small">{r.timeline.at(-1)!.body}</p></div></div>
          : <StatusHero report={r} />}
        <h1 style={{ fontSize: 24, marginTop: 6 }}>{r.title}</h1>
        <div className="row small muted wrap"><Icon name="pin" size={15} />{r.street}{r.landmark ? ` · ${r.landmark}` : ''}, {communityName(r.community)}</div>
        <div className="row xs faint wrap"><CatIcon category={r.category} size={20} /><span>{categoryByKey(r.category).label}{r.subtype ? ' · ' + r.subtype : ''}</span>·<SeverityBadge severity={r.validatedSeverity ?? r.severity} />{r.validatedSeverity && <span>checked by authority</span>}</div>
        <div className="xs faint">Reported {fmtDate(r.createdAt)} by {reporter} · <span className="tnum">{r.ref}</span></div>

        {done && <>
          <div className="stack-sm"><h2>Before → After</h2><BeforeAfter before={photoFor(r, 'before').scene} after={photoFor(r, 'after').scene ?? 'road-fixed'} />
            {r.completion && <p className="small muted">{r.completion.note} Completed {fmtDate(r.completion.at)}.</p>}</div>
          <div className="card stack" style={{ borderColor: 'color-mix(in srgb, var(--brand) 35%, var(--line))' }}>
            <div><h3 style={{ fontSize: 18 }}>Has this actually been fixed?</h3><p className="small muted">Your answer helps make sure work is really done.</p></div>
            {myRes ? <div className="banner banner-info"><Icon name="check" size={18} /><p className="small">Thanks! You said: <b>{ANSWERS.find((a) => a[0] === myRes)![2]}</b>.</p></div>
              : <div className="up-grid">{ANSWERS.map(([k, ic, l]) => <button key={k} className="btn btn-secondary btn-wrap" style={{ minHeight: 52 }} onClick={() => confirmFix(k)}><Icon name={ic} size={17} />{l}</button>)}</div>}
            {r.confirmations && <div className="row xs muted wrap" style={{ gap: 12 }}><span>✅ {r.confirmations.yes} fixed</span><span>🟡 {r.confirmations.partial} partly</span><span>❌ {r.confirmations.no} not fixed</span></div>}
          </div>
        </>}

        <div className="stat-pair">
          <div className="stat"><div className="n tnum">{r.affected}</div><div className="l">people confirmed this issue</div></div>
          <div className="stat"><div className="n tnum">{fmtN(r.peopleImpacted || r.affected * 20)}</div><div className="l">residents potentially affected</div></div>
        </div>
        {!done && r.status !== 'unable' && <>
          <div className="row gap-12">
            <button className={`btn ${affected ? 'btn-soft' : 'btn-primary'} grow`} disabled={affected} onClick={() => { repo.confirmAffected(ref); ui.toast('Thanks — you’ve been counted. This helps the authority understand the impact.', 'hand'); }}><Icon name="hand" size={18} />{affected ? 'You’re counted' : 'I’m affected too'}</button>
            <button className="btn btn-secondary grow" onClick={follow}><Icon name="bell" size={18} />{following ? 'Following' : 'Follow'}</button>
          </div>
          <button className="btn btn-ghost btn-block btn-sm" onClick={() => { repo.addEvidence(ref); ui.toast('Photo added. +5 points if it’s marked useful.', 'camera'); }}><Icon name="camera" size={16} />Add a photo or update</button>
        </>}

        <div className="card stack-sm"><div className="xs faint" style={{ fontWeight: 700 }}>RESPONSIBLE AUTHORITY</div>
          <div className="authority"><AuthorityLogo agency={r.agency} /><div className="grow"><b>{AGENCIES[r.agency].name}</b><div className="xs muted">{r.routingState}{r.supporting ? ` · with ${AGENCIES[r.supporting].short}` : ''}</div></div></div>
          <p className="small muted">{transfer ? <><InlineIcon name="refresh" />{transfer.body}</> : LEVEL_EXPLAINER[AGENCIES[r.agency].level]}</p>
          <Link className="link" href="/learn">Who handles what? →</Link></div>

        <div className="card"><h2 style={{ marginBottom: 14 }}>Progress</h2><ProgressTracker report={r} /></div>

        {insp?.completedAt && <div className="card stack-sm"><div className="row between"><h3>Inspection findings</h3><span className="xs faint">{fmtDate(insp.completedAt)}</span></div>
          <p className="small">{insp.findings}</p><div className="xs muted">Inspected by {inspector?.name ?? 'Field inspector'}{insp.assessedSeverity ? ` · assessed as ${SEVERITY[insp.assessedSeverity].label.toLowerCase()}` : ''}</div></div>}

        <div className="card"><h2 style={{ marginBottom: 14 }}>Timeline</h2><Timeline items={r.timeline} delay={r.delay} /></div>

        <div className="card stack-sm"><h3>Details</h3><p className="small">{r.description}</p>
          {r.answers && <div className="chips">
            {r.answers.duration && <span className="tag"><Icon name="clock" size={13} />{r.answers.duration}</span>}
            {r.answers.access === 'Yes' && <span className="tag"><Icon name="road" size={13} />Blocks access</span>}
            {r.answers.safety === 'Yes' && <span className="tag" style={{ color: 'var(--clay)' }}><Icon name="alert" size={13} />Safety risk</span>}</div>}
          <div className="map" style={{ height: 150, marginTop: 8 }}><MapBase /><MapPin report={r} selected /></div></div>
        <div style={{ height: 16 }} />
      </div>
    </CitizenShell>
  );
}
