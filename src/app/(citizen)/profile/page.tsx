'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRepo, useUi } from '@/lib/store';
import { LOCALES } from '@/lib/i18n';
import { CitizenShell, BackBar } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { Toggle, communityName } from '@/components/civic';
import { fmtDate } from '@/lib/format';
import type { IdentityMode } from '@/lib/domain/types';

export default function ProfilePage() {
  const repo = useRepo(); const ui = useUi(); const router = useRouter();
  const u = repo.state.user; const p = repo.state.prefs;
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark');
  const toggleDark = () => { const next = dark ? 'light' : 'dark'; document.documentElement.dataset.theme = next; try { localStorage.setItem('nw-theme', next); } catch { /* ignore */ } setDark(!dark); };
  const Row = ({ href, icon, label }: { href: string; icon: string; label: string }) => <Link className="card card-hover row" href={href}><Icon name={icon} size={20} /><b className="grow">{label}</b><Icon name="chevronR" size={18} /></Link>;
  return (
    <CitizenShell nav="community">
      <BackBar title="Profile" />
      <div className="screen stack">
        <div className="row gap-16">
          <div style={{ width: 68, height: 68, borderRadius: 24, background: 'var(--brand)', color: '#fff', display: 'grid', placeItems: 'center', font: '750 28px var(--display)' }}>{u.name[0]}</div>
          <div><h2>{u.fullName}</h2><div className="small muted">{communityName(p.community)}, Lagos · member since {fmtDate(u.joined, { month: 'short', year: 'numeric' })}</div>
            <div className="row" style={{ marginTop: 6 }}><span className="tag" style={{ background: 'var(--sun-soft)', color: '#7A5800' }}><Icon name="star" size={13} />{u.points} contribution points</span></div></div>
        </div>
        <p className="xs faint">Points come only from verified reports, useful evidence and confirming repairs — never from report volume.</p>
        <div className="section-head" style={{ marginTop: 6 }}><h2>Badges</h2></div>
        <div className="badge-grid">{repo.state.badges.map((b) => (
          <div key={b.key} className={`badge ${b.earned ? '' : 'locked'}`}><span className="medal"><Icon name={b.icon} size={22} /></span>{b.label}<span className="xs faint" style={{ fontWeight: 500 }}>{b.earned ? b.desc : `${b.progress}/${b.total}`}</span></div>))}</div>
        <div className="section-head" style={{ marginTop: 6 }}><h2>Settings</h2></div>
        <div className="field"><span className="label">Language</span>
          <div className="seg">{LOCALES.map((l) => <button key={l.key} aria-selected={p.locale === l.key} onClick={() => repo.setPref('locale', l.key)}>{l.label}</button>)}</div>
          <span className="xs faint">More Nigerian languages coming soon.</span></div>
        <Toggle on={p.lowData} label="Low-data mode" sub="Compressed photos, list instead of map, text-first" onToggle={() => repo.setPref('lowData', !p.lowData)} />
        <Toggle on={dark} label="Dark mode" sub="Easier on the eyes at night" onToggle={toggleDark} />
        <div className="field"><label htmlFor="idm">Default public identity</label>
          <select id="idm" className="select" value={p.identity} onChange={(e) => { repo.setPref('identity', e.target.value as IdentityMode); ui.toast('Saved'); }}>
            <option value="first_name">Show my first name</option><option value="community_member">Show as community member</option><option value="private">Keep me private publicly</option></select></div>
        <div className="stack-sm">
          <Row href="/learn" icon="book" label="Who handles what?" />
          <Row href="/impact" icon="sparkle" label="Community impact" />
          <button className="card card-hover row" style={{ width: '100%', textAlign: 'left' }} onClick={() => { repo.setPref('onboarded', false); router.push('/'); }}><Icon name="flag" size={20} /><b className="grow">Replay welcome</b><Icon name="chevronR" size={18} /></button>
          <button className="card card-hover row" style={{ width: '100%', textAlign: 'left' }} onClick={() => { repo.reset(); ui.toast('Demo data reset'); router.push('/'); }}><Icon name="refresh" size={20} /><b className="grow">Reset demo data</b></button>
        </div>
      </div>
    </CitizenShell>
  );
}
