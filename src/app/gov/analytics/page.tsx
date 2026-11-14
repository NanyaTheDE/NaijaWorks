'use client';
import { PTop } from '@/components/shells';
import { CONTRACTORS } from '@/lib/api/repo'; // historical figures cover the seeded teams only

// Illustrative figures until the analytics API exists.
const KPIS = [['Avg. acknowledgement', '1.6 days'], ['Avg. inspection time', '4.4 days'], ['Avg. resolution', '18 days'], ['Completion rate', '71%'], ['Recurrence (90d)', '8%'], ['Citizen-confirmed fixes', '92%']];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
const FLOOD = [2, 1, 3, 6, 11, 18, 24, 21, 16, 9, 5];
const HOTSPOTS = ['Adeola St', 'Bode Thomas', 'Ogunlana Dr', 'Lawanson Rd', 'Herbert Macaulay', 'Alagomeji'];
const PERF = [[14, 86, 1.2, 93, 1], [31, 74, 3.4, 88, 3], [9, 67, 5.0, 81, 2], [22, 91, 0.8, 96, 0]];

export default function AnalyticsPage() {
  const max = Math.max(...FLOOD);
  return <>
    <PTop title="Analytics" sub="From reactive repairs to planned maintenance." />
    <div className="kpis">{KPIS.map(([l, v]) => <div key={l} className="kpi"><span className="l">{l}</span><span className="n">{v}</span></div>)}</div>
    <div className="pgrid">
      <div className="card span-6"><h3>Seasonal pattern · flooding &amp; drainage</h3><p className="xs faint">Reports per month, 2026 — plan desilting before May.</p>
        <div className="chart-bars" role="img" aria-label="Flooding reports per month">{MONTHS.map((m, i) => <div key={m} className="bc"><span className="bar" style={{ height: `${(FLOOD[i] / max) * 100}%`, background: FLOOD[i] > 15 ? 'var(--st-active)' : 'color-mix(in srgb, var(--st-active) 45%, transparent)' }} /><span>{m}</span></div>)}</div></div>
      <div className="card span-6"><h3>Recurring hotspots</h3><p className="xs faint">Locations with 3+ reports in 12 months</p>
        <div className="stack-sm" style={{ marginTop: 10 }}>{HOTSPOTS.map((h, i) => <div key={h} className="bar-row" style={{ gridTemplateColumns: '130px 1fr 30px' }}><span>{h}</span><div className="b"><span style={{ width: `${95 - i * 13}%`, background: 'var(--clay)', opacity: 1 - i * 0.12 }} /></div><span className="tnum faint">{9 - i}</span></div>)}</div></div>
      <div className="card span-12"><h3>Contractor performance</h3>
        <table className="table" style={{ marginTop: 8 }}><thead><tr><th>Contractor / team</th><th>Jobs</th><th>On time</th><th>Avg. delay</th><th>Citizen-confirmed</th><th>Reopened</th></tr></thead>
          <tbody>{CONTRACTORS.map((c, i) => <tr key={c.id}><td><b className="small">{c.name}</b><div className="xs faint">{c.speciality}</div></td><td className="tnum">{PERF[i][0]}</td><td className="tnum">{PERF[i][1]}%</td><td className="tnum">{PERF[i][2]} d</td><td className="tnum">{PERF[i][3]}%</td><td className="tnum">{PERF[i][4]}</td></tr>)}</tbody></table></div>
    </div>
  </>;
}
