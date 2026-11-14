'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/civic';
import { useRepo, useUi } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { PEOPLE } from '@/lib/api/repo';
import { cx } from '@/lib/format';

// ---------- Role switcher (demo only: lets one person act as every role) ----------
const ROLES = [['citizen', '/', 'user', 'Citizen app'], ['gov', '/gov', 'building', 'Government portal'], ['inspector', '/inspector', 'clipboard', 'Field inspector'], ['team', '/team', 'hammer', 'Field team'], ['public', '/data', 'globe', 'Public data']] as const;
export function RoleSwitcher() {
  const path = usePathname();
  const cur = path.startsWith('/gov') ? 'gov' : path.startsWith('/inspector') ? 'inspector' : path.startsWith('/team') ? 'team' : path.startsWith('/data') ? 'public' : 'citizen';
  return (
    <nav className={cx('roles', (cur === 'gov' || cur === 'public') && 'compact')} aria-label="Switch role (demo)">
      <div className="hd">Viewing as</div>
      {ROLES.map(([k, href, ic, label]) => <Link key={k} href={href} aria-current={k === cur} title={label}><Icon name={ic} size={17} /><span>{label}</span></Link>)}
    </nav>
  );
}

// ---------- Citizen phone shell ----------
export function CitizenShell({ children, nav, hideNav = false, footer }: { children: ReactNode; nav?: 'home' | 'explore' | 'mine' | 'community'; hideNav?: boolean; footer?: ReactNode }) {
  const repo = useRepo(); const t = useT(); const ui = useUi(); const router = useRouter();
  const unread = repo.unreadCount();
  const Item = ({ k, href, ic, label }: { k: string; href: string; ic: string; label: string }) => (
    <Link className="bn-item" href={href} aria-current={nav === k ? 'page' : undefined}><Icon name={ic} size={22} /><span>{label}</span>{k === 'mine' && unread > 0 && <span className="dot" />}</Link>
  );
  return (
    <div className="stage">
      <div className="phone">
        <div className="phone-scroll" id="scroller">{children}</div>
        {footer}
        {!hideNav && (
          <nav className="bottomnav" aria-label="Main">
            <Item k="home" href="/" ic="home" label={t('nav.home')} />
            <Item k="explore" href="/explore" ic="map" label={t('nav.explore')} />
            <Link className="bn-item bn-report" href="/report" aria-label={t('nav.report')}><span className="fab"><Icon name="plus" size={28} /></span><span>{t('nav.report')}</span></Link>
            <Item k="mine" href="/my-reports" ic="list" label={t('nav.mine')} />
            <Item k="community" href={`/community/${repo.state.prefs.community}`} ic="users" label={t('nav.community')} />
          </nav>
        )}
      </div>
      <aside className="stage-aside stack">
        <div className="card stack-sm">
          <div className="row"><Icon name="info" size={18} /><b>Citizen app preview</b></div>
          <p className="small muted">Mobile-first PWA. Use the role switcher to act as the government officer, inspector or field team, and watch the same report move through its journey.</p>
          <button className="btn btn-ghost btn-sm" onClick={() => { repo.reset(); ui.toast('Demo data reset'); router.push('/'); }}><Icon name="refresh" size={16} />Reset demo data</button>
        </div>
      </aside>
      <RoleSwitcher />
    </div>
  );
}

export function BackBar({ href = '/', title, right }: { href?: string; title: string; right?: ReactNode }) {
  const router = useRouter();
  return (
    <header className="topbar">
      <button className="icon-btn" onClick={() => (history.length > 1 ? router.back() : router.push(href))} aria-label="Back"><Icon name="chevronL" size={20} /></button>
      <h1 className="grow ellipsis">{title}</h1>{right}
    </header>
  );
}

// ---------- Field (inspector / team) phone frame ----------
export function FieldFrame({ children, aside }: { children: ReactNode; aside: string }) {
  return (
    <div className="stage">
      <div className="phone"><div className="phone-scroll" id="scroller" style={{ paddingBottom: 24 }}>{children}</div></div>
      <aside className="stage-aside"><div className="card stack-sm"><div className="row"><Icon name="info" size={18} /><b>{aside}</b></div><p className="small muted">Large buttons, works offline and syncs later. GPS and time are captured automatically.</p></div></aside>
      <RoleSwitcher />
    </div>
  );
}

// ---------- Government portal ----------
export function PortalShell({ children }: { children: ReactNode }) {
  const path = usePathname(); const repo = useRepo();
  const newCount = repo.allReportsInternal().filter((r) => !r.mergedInto && !r.rejected && ['reported', 'under_review'].includes(r.status)).length;
  const L = ({ href, ic, label, count }: { href: string; ic: string; label: string; count?: number }) => {
    const active = href === '/gov' ? path === '/gov' : path.startsWith(href);
    return <Link className="side-link" href={href} aria-current={active ? 'page' : undefined}><Icon name={ic} size={18} /><span>{label}</span>{count ? <span className="count">{count}</span> : null}</Link>;
  };
  return (
    <div className="portal">
      <nav className="sidebar" aria-label="Portal">
        <div className="brand"><Logo size={30} /><span><b style={{ font: '750 16px var(--display)' }}>NaijaWorks</b><div className="xs" style={{ color: '#7FA391' }}>Operations · LSPWC</div></span></div>
        <L href="/gov" ic="grid" label="Dashboard" /><L href="/gov/reports" ic="inbox" label="Reports" count={newCount} /><L href="/gov/inspections" ic="clipboard" label="Inspections" />
        <L href="/gov/work-orders" ic="wrench" label="Work Orders" /><L href="/gov/projects" ic="crane" label="Projects" /><L href="/gov/map" ic="map" label="Map" />
        <div className="side-sec">Insight</div><L href="/gov/analytics" ic="chart" label="Analytics" /><L href="/gov/communities" ic="users" label="Communities" />
        <div className="side-sec">Manage</div><L href="/gov/contractors" ic="hammer" label="Contractors" /><L href="/gov/announcements" ic="megaphone" label="Announcements" /><L href="/gov/audit" ic="shield" label="Audit log" />
        <div style={{ marginTop: 'auto', padding: 12, borderTop: '1px solid rgb(255 255 255 / .08)', display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ width: 34, height: 34, borderRadius: '50%', background: '#1E5A3F', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700 }}>FA</span>
          <div className="xs"><b style={{ color: '#fff' }}>{PEOPLE.officer.name}</b><div style={{ color: '#7FA391' }}>{PEOPLE.officer.title}</div></div>
        </div>
      </nav>
      <main className="pmain">{children}</main>
      <RoleSwitcher />
    </div>
  );
}
export function PTop({ title, sub, children }: { title: ReactNode; sub?: ReactNode; children?: ReactNode }) {
  return <div className="ptop"><div className="grow"><h1>{title}</h1>{sub && <p className="muted small" style={{ marginTop: 4 }}>{sub}</p>}</div>{children}</div>;
}
