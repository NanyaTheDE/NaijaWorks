'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useRepo, useUi } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { CitizenShell } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';
import { ReportRow, MapBase, MapPin, EmptyState } from '@/components/civic';
import { CATEGORIES } from '@/lib/domain/categories';
import { STATUS, GROUPS } from '@/lib/domain/statuses';
import type { StatusGroup } from '@/lib/domain/types';

const GROUP_CHIPS: [StatusGroup | 'all', string][] = [['all', 'All'], ['new', 'New'], ['confirmed', 'Verified'], ['inspection', 'Inspection'], ['planned', 'Scheduled'], ['active', 'In progress'], ['done', 'Completed']];

export default function ExplorePage() { return <Suspense><Explore /></Suspense>; }

function Explore() {
  const repo = useRepo(); const ui = useUi(); const t = useT(); const params = useSearchParams(); const router = useRouter();
  const [status, setStatus] = useState<StatusGroup | 'all'>((params.get('group') as StatusGroup) ?? 'all');
  const [category, setCategory] = useState<string | null>(null);
  const [q, setQ] = useState(params.get('q') ?? '');
  const [view, setView] = useState<'map' | 'list'>(params.get('q') ? 'list' : 'map');
  const [sel, setSel] = useState<string | null>(null);
  useEffect(() => { if (params.size) router.replace('/explore'); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const list = repo.listReports({ q, category }).filter((r) => status === 'all' || STATUS[r.status].group === status);
  const selected = sel ? list.find((r) => r.ref === sel) : undefined;
  const mode = repo.state.prefs.lowData ? 'list' : view;
  const search = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); setQ(String(new FormData(e.currentTarget).get('q') ?? '')); };
  const chips = GROUP_CHIPS.map(([k, l]) => (
    <button key={k} className="chip" aria-pressed={status === k} onClick={() => { setStatus(k); setSel(null); }}>
      {k !== 'all' && <i style={{ width: 8, height: 8, borderRadius: '50%', background: GROUPS[k].color, display: 'inline-block' }} />}{l}</button>));
  const toggle = (v: 'map' | 'list') => <button className="icon-btn fm-float" onClick={() => setView(v)} aria-label={v === 'list' ? 'Show list' : 'Show map'}><Icon name={v === 'list' ? 'list' : 'map'} size={20} /></button>;

  // Full-bleed map with floating controls and a card carousel (Places / Strava / Hypelist pattern).
  if (mode === 'map') {
    const ordered = selected ? [selected, ...list.filter((r) => r !== selected)] : list;
    return (
      <CitizenShell nav="explore">
        <h1 className="sr-only">{t('nav.explore')} map</h1>
        <div className="fullmap">
          <div className="map" onClick={() => setSel(null)}><MapBase /><div className="mypos" style={{ left: '44%', top: '61%' }} />
            {list.map((r) => <MapPin key={r.ref} report={r} selected={r.ref === sel} onSelect={(ref) => { setSel(ref === sel ? null : ref); document.getElementById('fm-cards')?.scrollTo(0, 0); }} />)}</div>
          <div className="fm-top">
            <div className="row"><form className="search grow" onSubmit={search}><Icon name="search" size={18} /><input className="input fm-float" name="q" defaultValue={q} placeholder="Search street, landmark or NW-…" aria-label="Search issues" /></form>{toggle('list')}</div>
            <div className="hscroll fm-chips">{chips}</div>
          </div>
          <div className="fm-bottom">
            <div className="fm-row"><div className="fm-count"><b>{list.length} issues</b>&nbsp;in view{selected ? '' : ' · tap a pin'}</div>
              <button className="icon-btn fm-float" onClick={() => ui.toast('Showing issues around you', 'nav')} aria-label="Centre on my location"><Icon name="nav" size={19} /></button></div>
            {list.length ? <div className="hscroll fm-cards" id="fm-cards">{ordered.map((r) => <div key={r.ref} className={`fm-card ${r === selected ? 'sel' : ''}`}><ReportRow report={r} /></div>)}</div>
              : <div className="card" style={{ margin: '0 16px' }}><EmptyState title="No issues match" body="Try another filter." /></div>}
          </div>
        </div>
      </CitizenShell>
    );
  }

  return (
    <CitizenShell nav="explore">
      <header className="topbar" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
        <div className="row"><h1 className="grow">{t('nav.explore')}</h1>{!repo.state.prefs.lowData && toggle('map')}</div>
        <form className="search" onSubmit={search}><Icon name="search" size={18} /><input className="input" name="q" defaultValue={q} placeholder="Street, landmark, authority or NW-…" aria-label="Search issues" /></form>
        <div className="hscroll" style={{ paddingBottom: 2 }}>{chips}</div>
        <div className="hscroll" style={{ paddingBottom: 2 }}>
          <button className="chip" aria-pressed={!category} onClick={() => setCategory(null)}>All types</button>
          {CATEGORIES.slice(0, 10).map((c) => <button key={c.key} className="chip" aria-pressed={category === c.key} onClick={() => setCategory(c.key)}><Icon name={c.icon} size={15} />{c.label}</button>)}
        </div>
      </header>
      <div className="screen stack">
        {repo.state.prefs.lowData && <div className="banner banner-sun"><Icon name="wifi" size={18} /><p className="small">Low-data mode: showing a simple list instead of the map.</p></div>}
        {list.length ? <div className="stack-sm">{list.map((r) => <ReportRow key={r.ref} report={r} />)}</div> : <EmptyState title="No issues match" body="Try another filter, or report something new." />}
      </div>
    </CitizenShell>
  );
}
