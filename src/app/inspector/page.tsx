'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRepo } from '@/lib/store';
import { FieldFrame } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { CatIcon, EmptyState, communityName } from '@/components/civic';
import { fmtDate } from '@/lib/format';

type Tab = 'today' | 'upcoming' | 'urgent' | 'done';

export default function InspectorHome() {
  const repo = useRepo(); const [tab, setTab] = useState<Tab>('today');
  const all = repo.inspections(); const soon = Date.now() + 864e5;
  const tabs: Record<Tab, typeof all> = {
    today: all.filter((i) => !i.completedAt && new Date(i.date).getTime() <= soon),
    upcoming: all.filter((i) => !i.completedAt && new Date(i.date).getTime() > soon),
    urgent: all.filter((i) => !i.completedAt && i.report.urgent),
    done: all.filter((i) => i.completedAt),
  };
  return (
    <FieldFrame aside="Field Inspector app">
      <div className="field-head stack">
        <div className="row between"><div><div className="small muted">{new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}</div><h1 style={{ color: '#fff', fontSize: 24 }}>Hello, Engr. Chukwudi</h1></div>
          <span className="tag" style={{ background: 'rgb(255 255 255 / .1)', color: '#CFE3D8' }}><Icon name="wifi" size={13} />Online</span></div>
        <div className="row" style={{ gap: 10 }}>{([['Today', tabs.today.length], ['Urgent', tabs.urgent.length], ['Done this week', tabs.done.length]] as const).map(([l, n]) => (
          <div key={l} style={{ flex: 1, background: 'rgb(255 255 255 / .07)', borderRadius: 14, padding: '10px 12px' }}><div style={{ font: '750 22px var(--display)', color: '#fff' }}>{n}</div><div className="xs muted">{l}</div></div>))}</div>
      </div>
      <div className="screen stack" style={{ marginTop: 14 }}>
        <div className="seg" role="tablist">{([['today', 'Today'], ['upcoming', 'Upcoming'], ['urgent', 'Urgent'], ['done', 'Completed']] as [Tab, string][]).map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{l}</button>)}</div>
        {tabs[tab].length ? tabs[tab].map((i) => (
          <Link key={i.id} className="card card-hover stack-sm" href={`/inspector/${i.report.ref}`}>
            <div className="row between"><span className="tag"><Icon name="clock" size={13} />{fmtDate(i.date, { weekday: 'short', day: 'numeric', month: 'short' })} · {i.window ?? 'Anytime'}</span>{i.report.urgent ? <span className="sev sev-urgent">Urgent</span> : <span className={`priority ${i.report.priority}`}>{i.report.priority}</span>}</div>
            <div className="row gap-12"><CatIcon category={i.report.category} size={40} /><div className="grow"><b>{i.report.title}</b><div className="xs muted">{i.report.street}, {communityName(i.report.community)}</div></div><Icon name="chevronR" size={18} className="faint" /></div>
            {i.instructions && <div className="note xs">{i.instructions}</div>}
          </Link>)) : <EmptyState title="Nothing here" body={tab === 'today' ? 'No inspections today. Check upcoming.' : 'No inspections in this list.'} />}
      </div>
    </FieldFrame>
  );
}
