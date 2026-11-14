'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRepo } from '@/lib/store';
import { CitizenShell } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { AuthorityLogo, communityName } from '@/components/civic';
import { NotFound } from '@/components/civic/NotFound';
import { categoryByKey } from '@/lib/domain/categories';
import { AGENCIES } from '@/lib/domain/routing';
import { fmtDate } from '@/lib/format';

export default function ReportSuccessPage() {
  const { ref } = useParams<{ ref: string }>(); const repo = useRepo(); const r = repo.getReport(ref);
  if (!r) return <NotFound />;
  return (
    <CitizenShell hideNav>
      <div className="screen stack-lg" style={{ paddingTop: 36, textAlign: 'center' }}>
        <div style={{ margin: '0 auto', width: 96, height: 96, borderRadius: 32, background: 'var(--brand)', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 12px 30px color-mix(in srgb, var(--brand) 40%, transparent)', animation: 'up .4s' }}><Icon name="check" size={52} /></div>
        <div><h1>Your report has been submitted</h1><p className="muted" style={{ marginTop: 8 }}>Thank you for looking out for {communityName(r.community)}.</p></div>
        <div className="card" style={{ textAlign: 'left' }}><dl className="kv">
          <dt>Reference</dt><dd className="tnum" style={{ fontFamily: 'ui-monospace,monospace' }}>{r.ref}</dd>
          <dt>Issue</dt><dd>{categoryByKey(r.category).label}{r.subtype ? ' · ' + r.subtype : ''}</dd>
          <dt>Location</dt><dd>{r.street}, {communityName(r.community)}</dd>
          <dt>Reported</dt><dd>{fmtDate(r.createdAt, { day: 'numeric', month: 'short', year: 'numeric' })}</dd></dl></div>
        <div className="next-card stack" style={{ textAlign: 'left' }}>
          <div className="row"><Icon name="search" size={18} /><b>We&apos;re checking which authority is responsible.</b></div>
          <div className="authority"><AuthorityLogo agency={r.agency} /><div><div className="xs faint">Likely responsible</div><b>{AGENCIES[r.agency].name}</b></div></div>
          <div className="row"><Icon name="clock" size={18} /><span><b>Next expected update:</b> within {r.urgent ? '1 working day' : '3 working days'}</span></div>
          <div className="row"><Icon name="bell" size={18} /><span className="small">We&apos;ll notify you at every step.</span></div>
        </div>
        <div className="stack-sm"><Link className="btn btn-primary btn-lg btn-block" href={`/issue/${r.ref}`}>Track this report</Link><Link className="btn btn-ghost btn-block" href="/">Back to home</Link></div>
      </div>
    </CitizenShell>
  );
}
