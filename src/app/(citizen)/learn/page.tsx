'use client';
import { CitizenShell, BackBar } from '@/components/shells';
import { Icon } from '@/components/ui/Icon';

const LEVELS: [string, string, string, string[], string][] = [
  ['Local Government (LGA / LCDA)', 'users', '#0B7A4B', ['Local streets and inner roads', 'Small drains on local streets', 'Markets and motor parks', 'Some streetlights on local streets'], 'Example: Surulere LGA Works'],
  ['State Government', 'building', '#4F46E5', ['Major roads inside the state', 'Primary drainage channels and flooding', 'Public water supply', 'Waste collection (e.g. LAWMA in Lagos)', 'Public primary schools and health centres'], 'Example: Lagos State Public Works'],
  ['Federal Government', 'flag', '#C77700', ['Highways that connect states (trunk roads)', 'Federal bridges', 'Federal buildings and institutions'], 'Example: FERMA'],
  ['Utilities & regulators', 'bolt', '#D9481F', ['Electricity supply, poles and transformers — your distribution company (DisCo)', 'Electrical safety — NEMSA', 'Some water services — state water corporation'], 'Example: Eko DisCo, Ikeja Electric'],
];

export default function LearnPage() {
  return (
    <CitizenShell nav="home">
      <BackBar title="Who handles what?" />
      <div className="screen stack">
        <p className="muted">You never need to know this before reporting — NaijaWorks works it out. But it helps to know who is responsible.</p>
        {LEVELS.map(([h, ic, col, items, ex]) => (
          <div key={h} className="card stack-sm">
            <div className="row gap-12"><span style={{ width: 42, height: 42, borderRadius: 14, display: 'grid', placeItems: 'center', background: `color-mix(in srgb, ${col} 14%, transparent)`, color: col }}><Icon name={ic} size={21} /></span><h3 style={{ fontSize: 17 }}>{h}</h3></div>
            <ul className="small prose-list" style={{ margin: '4px 0 0', display: 'grid', gap: 4 }}>{items.map((i) => <li key={i}>{i}</li>)}</ul>
            <div className="xs faint">{ex}</div>
          </div>))}
        <div className="banner banner-sun"><Icon name="refresh" size={18} /><p className="small">Sometimes a report goes to one office and is then <b>transferred</b> to the right one. When that happens, you’ll see why on the timeline.</p></div>
      </div>
    </CitizenShell>
  );
}
