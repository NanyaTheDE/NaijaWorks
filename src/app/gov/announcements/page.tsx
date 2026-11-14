'use client';
import { useRepo, useUi } from '@/lib/store';
import { PTop } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { AnnouncementCard, EmptyState, communityName } from '@/components/civic';
import { Field, Select, FormModal } from '@/components/gov/ActionForms';
import { COMMUNITIES } from '@/lib/api/repo';
import { AGENCIES } from '@/lib/domain/routing';
import { timeAgo } from '@/lib/format';

const KINDS = ['Planned road repairs', 'Water maintenance', 'Streetlight maintenance', 'Drainage clearing', 'Temporary closure', 'Infrastructure project'];

// Announcements appear on the citizen home feed and community page, and notify residents of that area.
export default function AnnouncementsPage() {
  const repo = useRepo(); const ui = useUi(); const list = repo.listAnnouncements();
  return <>
    <PTop title="Announcements" sub="Tell residents about planned work before it happens. Announcements show on the home feed and community page for that area.">
      <button className="btn btn-primary" onClick={() => ui.openModal(<NewAnnouncementForm />)}><Icon name="megaphone" size={17} />New announcement</button>
    </PTop>
    {list.length ? (
      <div className="pgrid" style={{ marginTop: 0 }}>{list.map((a) => (
        <div key={a.id} className="card span-6 stack-sm">
          <div className="row between xs muted"><span>{communityName(a.community)} · published {timeAgo(a.at)}</span>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--clay)' }} onClick={() => { repo.withdrawAnnouncement(a.id); ui.toast('Announcement withdrawn'); }}><Icon name="x" size={14} />Withdraw</button></div>
          <AnnouncementCard a={a} />
        </div>))}</div>
    ) : <div className="card"><EmptyState title="No announcements" body="Planned work, closures and maintenance notices you publish will show here." /></div>}
  </>;
}

function NewAnnouncementForm() {
  const repo = useRepo(); const ui = useUi();
  return (
    <FormModal title="New announcement" sub="Use plain language and say when. Residents of the area get a notification." submit="Publish"
      onSubmit={(f) => { repo.publishAnnouncement({ agency: f.agency, kind: f.kind, title: f.title.trim(), body: f.body.trim(), community: f.community }); ui.toast('Announcement published · residents notified', 'megaphone'); }}>
      <div className="row gap-12">
        <Field label="Area"><Select name="community" options={COMMUNITIES.map((c) => [c.slug, `${c.name} (${c.lgaName})`])} /></Field>
        <Field label="Type"><Select name="kind" options={KINDS.map((k) => [k, k])} /></Field>
      </div>
      <Field label="From"><Select name="agency" value="lspwc" options={Object.values(AGENCIES).filter((a) => a.id !== 'triage').map((a) => [a.id, a.name])} /></Field>
      <Field label="Headline"><input className="input" name="title" required maxLength={80} placeholder="e.g. Road resurfacing on Adeola Street" /></Field>
      <Field label="Details (what, where, when)"><textarea className="textarea" name="body" required placeholder="e.g. One lane closed Mon 24 – Wed 26 Nov, 8am – 4pm. Use Bode Thomas Street instead." /></Field>
    </FormModal>
  );
}
