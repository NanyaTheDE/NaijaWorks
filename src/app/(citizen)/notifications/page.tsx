'use client';
import Link from 'next/link';
import { useRepo } from '@/lib/store';
import { CitizenShell, BackBar } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { EmptyState, statusColor } from '@/components/civic';
import { STATUS } from '@/lib/domain/statuses';
import { timeAgo } from '@/lib/format';
import type { StatusKey } from '@/lib/domain/types';

function meta(kind: string): [string, string, string] {
  const special: Record<string, [string, string, string]> = { announcement: ['megaphone', 'var(--sun-soft)', '#8A6400'], delay: ['clock', 'var(--sun-soft)', '#8A6400'], completed: ['sparkle', 'var(--brand-soft)', 'var(--brand)'], monitoring: ['eye', 'var(--brand-soft)', 'var(--brand)'] };
  if (special[kind]) return special[kind];
  const s = STATUS[kind as StatusKey];
  return s ? [s.icon, `color-mix(in srgb, ${statusColor(kind as StatusKey)} 14%, transparent)`, statusColor(kind as StatusKey)] : ['bell', 'var(--surface-2)', 'var(--ink-2)'];
}

export default function NotificationsPage() {
  const repo = useRepo(); const list = repo.listNotifications();
  return (
    <CitizenShell nav="mine">
      <BackBar title="Notifications" right={list.some((n) => !n.read) ? <button className="btn btn-ghost btn-sm" onClick={() => repo.markNotificationsRead()}>Mark all read</button> : null} />
      <div>{list.length ? list.map((n) => { const [ic, bg, fg] = meta(n.kind); return (
        <Link key={n.id} className={`notif ${n.read ? '' : 'unread'}`} href={n.ref ? `/issue/${n.ref}` : `/community/${repo.state.prefs.community}`}>
          <span className="ni" style={{ background: bg, color: fg }}><Icon name={ic} size={19} /></span>
          <div className="grow"><div className="row between"><b className="small">{n.title}</b><span className="xs faint">{timeAgo(n.at)}</span></div><p className="small muted">{n.body}</p></div>
        </Link>); })
        : <EmptyState title="You’re all caught up" body="Updates on reports you submit or follow will show up here." />}</div>
    </CitizenShell>
  );
}
