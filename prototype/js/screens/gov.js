// Government Operations Portal + public transparency page.
import { repo, fmtDate, PEOPLE, CONTRACTORS, COMMUNITIES } from '../api/repo.js';
import { ui, go, rerender, toast, openModal, closeModal, formData, isoInDays } from '../ctx.js';
import { icon } from '../ui/icons.js';
import { STATUS, GROUPS, SEVERITY, REJECT_REASONS, INSPECTION_OUTCOMES } from '../domain/statuses.js';
import { categoryByKey, CATEGORIES } from '../domain/categories.js';
import { AGENCIES } from '../domain/routing.js';
import { esc, StatusBadge, SeverityBadge, Timeline, MapBase, MapPin, communityName, timeAgo, photoFor, media, Modal, BeforeAfter, EmptyState, statusColor, CatIcon } from '../ui/components.js';
import { logo } from './citizen.js';

const ngn = (n) => '₦' + Number(n || 0).toLocaleString('en-NG');
const INSPECTORS = [PEOPLE.inspector, PEOPLE.inspector2, PEOPLE.inspector3];
const all = () => repo.allReportsInternal().filter((r) => !r.mergedInto);
const QUEUES = {
  new:        { label: 'New',                  f: (r) => ['reported', 'under_review'].includes(r.status) && !r.rejected },
  urgent:     { label: 'Urgent safety',        f: (r) => r.urgent && !['completed', 'monitoring', 'unable'].includes(r.status) },
  assign:     { label: 'Awaiting assignment',  f: (r) => r.status === 'verified' || r.routingState === 'Needs routing review' && ['reported', 'under_review'].includes(r.status) },
  inspection: { label: 'Inspections',          f: (r) => ['assigned', 'inspection_scheduled'].includes(r.status) },
  decide:     { label: 'Awaiting decision',    f: (r) => r.status === 'inspected' },
  work:       { label: 'Work',                 f: (r) => ['work_planned', 'scheduled', 'in_progress'].includes(r.status) },
  review:     { label: 'Resolution review',    f: (r) => r.status === 'reopened' || r.status === 'completed' },
  all:        { label: 'All',                  f: () => true },
};

function portal(active, content) {
  const counts = { reports: QUEUES.new.f && all().filter(QUEUES.new.f).length };
  const link = (key, href, ic, label, count) => `<a class="side-link" href="${href}" ${active === key ? 'aria-current="page"' : ''}>${icon(ic, 18)}<span>${label}</span>${count ? `<span class="count">${count}</span>` : ''}</a>`;
  return `<div class="portal"><nav class="sidebar" aria-label="Portal">
    <div class="brand">${logo(30)}<span><b style="font:750 16px var(--display)">NaijaWorks</b><div class="xs" style="color:#7FA391">Operations · LSPWC</div></span></div>
    ${link('dash', '#/gov', 'grid', 'Dashboard')}${link('reports', '#/gov/reports', 'inbox', 'Reports', counts.reports)}${link('insp', '#/gov/inspections', 'clipboard', 'Inspections')}
    ${link('wo', '#/gov/work-orders', 'wrench', 'Work Orders')}${link('projects', '#/gov/projects', 'crane', 'Projects')}${link('map', '#/gov/map', 'map', 'Map')}
    <div class="side-sec">Insight</div>${link('analytics', '#/gov/analytics', 'chart', 'Analytics')}${link('comm', '#/gov/communities', 'users', 'Communities')}
    <div class="side-sec">Manage</div>${link('contractors', '#/gov/contractors', 'hammer', 'Contractors')}${link('ann', '#/gov/announcements', 'megaphone', 'Announcements')}${link('audit', '#/gov/audit', 'shield', 'Audit log')}
    <div style="margin-top:auto;padding:12px;border-top:1px solid rgb(255 255 255 / .08);display:flex;gap:10px;align-items:center"><span style="width:34px;height:34px;border-radius:50%;background:#1E5A3F;display:grid;place-items:center;color:#fff;font-weight:700">FA</span><div class="xs"><b style="color:#fff">${PEOPLE.officer.name}</b><div style="color:#7FA391">${PEOPLE.officer.title}</div></div></div>
  </nav><main class="pmain">${content}</main></div>`;
}
const ptop = (title, sub = '', right = '') => `<div class="ptop"><div class="grow"><h1>${title}</h1>${sub ? `<p class="muted small" style="margin-top:4px">${sub}</p>` : ''}</div>${right}</div>`;

// ---------- Dashboard ----------
export function dashboard() {
  const R = all(); const n = (f) => R.filter(f).length;
  const overdue = R.filter((r) => r.delay || (r.eta && new Date(r.eta) < new Date() && !['completed', 'monitoring'].includes(r.status)));
  // Workflow pipeline (Jobber-style): each stage = count + two "needs action" sub-counts, linked to its queue.
  const isDelayed = (r) => overdue.includes(r);
  const pipeline = [
    ['New', 'new', 'inbox', 'new', R.filter(QUEUES.new.f), [['Urgent', R.filter((r) => QUEUES.new.f(r) && r.urgent).length, true], ['Needs routing review', R.filter((r) => QUEUES.new.f(r) && r.routingState === 'Needs routing review').length]]],
    ['Verified', 'confirmed', 'building', 'assign', R.filter((r) => ['verified', 'assigned'].includes(r.status)), [['Awaiting assignment', n((r) => r.status === 'verified')], ['Awaiting inspection', n((r) => r.status === 'assigned')]]],
    ['Inspection', 'inspection', 'clipboard', 'inspection', R.filter((r) => ['inspection_scheduled', 'inspected'].includes(r.status)), [['Scheduled', n((r) => r.status === 'inspection_scheduled')], ['Awaiting decision', n((r) => r.status === 'inspected'), true]]],
    ['Work', 'active', 'hammer', 'work', R.filter((r) => ['work_planned', 'scheduled', 'in_progress'].includes(r.status)), [['In progress', n((r) => r.status === 'in_progress')], ['Delayed', R.filter((r) => ['work_planned', 'scheduled', 'in_progress'].includes(r.status) && isDelayed(r)).length, true]]],
    ['Done', 'done', 'check', 'review', R.filter((r) => ['completed', 'monitoring'].includes(r.status)), [['Awaiting citizen check', n((r) => r.status === 'completed')], ['Reopened', n((r) => r.status === 'reopened'), true]]],
  ];
  const activity = R.flatMap((r) => r.timeline.map((t) => ({ ...t, r }))).sort((x, y) => y.at.localeCompare(x.at)).slice(0, 8);
  const byCat = CATEGORIES.slice(0, 8).map((c) => ({ c, v: R.filter((r) => r.category === c.key).length * 7 + (c.key === 'road' ? 22 : c.key === 'drainage' ? 14 : 4) }));
  const maxC = Math.max(...byCat.map((x) => x.v));
  const months = [['Jun', 4.1, 9.2, 31], ['Jul', 3.6, 8.1, 28], ['Aug', 3.2, 7.4, 26], ['Sep', 2.8, 6.0, 23], ['Oct', 2.1, 5.2, 21], ['Nov', 1.6, 4.4, 18]];
  return portal('dash', `${ptop(`Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, Funmilayo`, `Lagos State · ${new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}`, `<a class="btn btn-secondary" href="#/data">${icon('globe', 17)}Public dashboard</a><a class="btn btn-primary" href="#/gov/reports">${icon('inbox', 17)}Open queue</a>`)}
    <h2 class="sr-only">Workflow</h2>
    <div class="pipeline">${pipeline.map(([label, g, ic, q, items, subs]) => `<a class="pipe card-hover" href="#/gov/reports?q=${q}" style="--c:${GROUPS[g].color}">
      <div class="row between"><span class="row small" style="font-weight:650;color:var(--ink-2)">${icon(ic, 16)}${label}</span>${icon('chevronR', 16, 'faint')}</div>
      <span class="n tnum">${label === 'Done' ? items.length + 31 : items.length}</span>${label === 'Done' ? '<span class="xs faint" style="margin-top:-6px">this month</span>' : ''}
      <div class="subs">${subs.map(([sl, sv, alert]) => `<div class="row between xs"><span class="muted">${sl}</span><b class="tnum" style="${alert && sv ? 'color:var(--clay)' : ''}">${sv}</b></div>`).join('')}</div></a>`).join('')}</div>
    <div class="pgrid">
      <div class="card span-7"><div class="row between"><h3>Live map</h3><a class="link" href="#/gov/map">Open map</a></div><div class="map" style="height:300px;margin-top:12px">${MapBase()}${R.filter((r) => r.status !== 'unable').map((r) => MapPin(r)).join('')}</div></div>
      <div class="card span-5"><div class="row between"><h3>Needs your attention</h3><a class="link" href="#/gov/reports?q=urgent">All</a></div>
        <div class="stack-sm" style="margin-top:12px">${R.filter((r) => r.urgent || ['reported', 'under_review'].includes(r.status) || r.status === 'inspected' || r.status === 'reopened').filter((r) => !['completed', 'monitoring', 'unable'].includes(r.status)).slice(0, 6).map((r) => `
          <a class="row gap-12 card-hover" href="#/gov/reports/${r.ref}" style="padding:10px;border-radius:12px;border:1px solid var(--line)">${CatIcon(r.category, 32)}<div class="grow" style="min-width:0"><div class="small ellipsis" style="font-weight:650">${esc(r.title)}</div><div class="xs muted">${r.ref} · ${timeAgo(r.timeline.at(-1).at)}</div></div>
          ${r.urgent ? '<span class="priority urgent">Urgent</span>' : StatusBadge(r.status)}</a>`).join('')}</div></div>
      <div class="card span-6"><h3>Issues by category · last 90 days</h3><div class="chart-bars" style="height:180px">${byCat.map(({ c, v }) => `<div class="bc"><span class="tnum" style="color:var(--ink-2);font-weight:650">${v}</span><span class="bar" style="height:${(v / maxC) * 100}%;background:${c.hue}"></span><span>${c.label.split(' ')[0]}</span></div>`).join('')}</div></div>
      <div class="card span-6"><h3>Response times (days)</h3><p class="xs faint">Median across all agencies on platform</p>
        <table class="table" style="margin-top:10px"><thead><tr><th>Month</th><th>Acknowledge</th><th>Inspect</th><th>Resolve</th><th></th></tr></thead><tbody>${months.map(([m, a, i, r]) => `<tr><td>${m}</td><td class="tnum">${a}</td><td class="tnum">${i}</td><td class="tnum">${r}</td><td style="width:40%"><div class="mini-progress"><span class="on" style="flex:${r};background:var(--brand)"></span><span style="flex:${35 - r}"></span></div></td></tr>`).join('')}</tbody></table></div>
      <div class="card span-6"><h3>Issues by LGA</h3><div class="stack-sm" style="margin-top:12px">${COMMUNITIES.map((c) => { const open = R.filter((r) => r.community === c.slug && !['completed', 'monitoring'].includes(r.status)).length; const done = R.filter((r) => r.community === c.slug && ['completed', 'monitoring'].includes(r.status)).length; return `<div class="bar-row" style="grid-template-columns:110px 1fr 70px"><span>${c.lgaName}</span><div class="b" style="display:flex"><span style="width:${open * 9}%;background:var(--st-planned);border-radius:0"></span><span style="width:${done * 9}%;background:var(--st-done);border-radius:0"></span></div><span class="xs faint">${open} open · ${done} done</span></div>`; }).join('')}</div></div>
      <div class="card span-6"><h3>Today's field activity</h3><div class="stack-sm" style="margin-top:12px">${repo.inspections().filter((i) => !i.completedAt).map((i) => `<div class="row gap-12"><span class="status" style="--c:var(--st-inspection)">${icon('clipboard', 14)}Inspection</span><span class="small grow ellipsis">${esc(i.report.street)} — ${INSPECTORS.find((p) => p.id === i.inspector)?.name}</span><span class="xs faint">${i.window || ''}</span></div>`).join('')}
        ${repo.listWorkOrders().filter((w) => w.status === 'in_progress').map((w) => `<div class="row gap-12"><span class="status" style="--c:var(--st-active)">${icon('hammer', 14)}Work</span><span class="small grow ellipsis">${w.id} — ${CONTRACTORS.find((c) => c.id === w.contractor).name}</span><span class="xs faint">${w.progress}%</span></div>`).join('')}</div></div>
      <div class="card span-12"><div class="row between"><h3>Recent activity</h3><a class="link" href="#/gov/audit">Audit log</a></div>
        <ol class="activity">${activity.map((a) => `<li><span class="dot" style="--c:${statusColor(a.status)}"></span><a class="grow" href="#/gov/reports/${a.r.ref}"><b class="small">${esc(a.title)}</b> <span class="small muted">· ${esc(a.r.title)}</span><div class="xs faint">${esc(a.actor)} · ${a.r.ref}</div></a><span class="xs faint">${timeAgo(a.at)}</span></li>`).join('')}</ol></div>
    </div>`);
}

// ---------- Reports queue ----------
export function reports(params) {
  if (params.get('q')) { ui.gov.tab = params.get('q'); history.replaceState(null, '', '#/gov/reports'); }
  const tab = ui.gov.tab; const R = all().filter(QUEUES[tab].f).filter((r) => !ui.gov.q || `${r.ref} ${r.title} ${r.street}`.toLowerCase().includes(ui.gov.q.toLowerCase()));
  const order = { urgent: 0, high: 1, medium: 2, low: 3 };
  R.sort((a, b) => order[a.priority] - order[b.priority] || b.createdAt.localeCompare(a.createdAt));
  return portal('reports', `${ptop('Reports', 'Triage, verify, route and track every report. Serious problems are sorted first, whatever their confirmation count.')}
    <div class="tabs" role="tablist">${Object.entries(QUEUES).map(([k, q]) => `<button role="tab" aria-selected="${tab === k}" data-action="gov-tab" data-v="${k}">${q.label}<span class="n">${all().filter(q.f).length}</span></button>`).join('')}</div>
    <div class="row" style="margin-bottom:12px"><form class="search grow" style="max-width:380px" data-action="gov-search">${icon('search', 18)}<input class="input" name="q" value="${esc(ui.gov.q)}" placeholder="Search reference, street, title"></form>
      <button class="btn btn-secondary btn-sm">${icon('filter', 15)}Category</button><button class="btn btn-secondary btn-sm">${icon('pin', 15)}LGA</button></div>
    ${R.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Report</th><th>Location</th><th>Status</th><th>Priority</th><th>Severity</th><th>Affected</th><th>Authority</th><th>Updated</th></tr></thead><tbody>
      ${R.map((r) => `<tr class="click" data-action="open-row" data-href="#/gov/reports/${r.ref}"><td><div class="row gap-12">${CatIcon(r.category, 30)}<div style="min-width:0;max-width:280px"><div class="ellipsis" style="font-weight:650">${esc(r.title)}</div><div class="xs faint tnum">${r.ref}</div></div></div></td>
        <td class="small">${esc(r.street)}<div class="xs faint">${communityName(r.community)}</div></td><td>${StatusBadge(r.status)}</td><td><span class="priority ${r.priority}">${r.priority}</span></td>
        <td>${SeverityBadge(r.validatedSeverity || r.severity)}</td><td class="tnum">${r.affected}</td><td class="small">${AGENCIES[r.agency].short}${r.routingState === 'Needs routing review' ? `<div class="xs" style="color:var(--st-planned)">Needs routing review</div>` : ''}</td><td class="xs faint">${timeAgo(r.timeline.at(-1).at)}</td></tr>`).join('')}
    </tbody></table><div class="pager"><span>Showing ${R.length} of ${R.length}</span><div class="row"><button class="btn btn-ghost btn-sm" disabled>Previous</button><button class="btn btn-ghost btn-sm" disabled>Next</button></div></div></div>`
    : `<div class="card">${EmptyState('Queue is clear', 'Nothing here right now. Nice work.')}</div>`}`);
}

// ---------- Report review ----------
export function reportReview(ref) {
  const r = repo.getReport(ref); if (!r) return portal('reports', EmptyState('Report not found', ''));
  const insp = r.inspection; const wo = r.workOrder && repo.getWorkOrder(r.workOrder);
  const dups = repo.allReportsInternal().filter((x) => x.ref !== r.ref && x.category === r.category && x.community === r.community && !x.mergedInto && !['monitoring'].includes(x.status)).slice(0, 3);
  const inspector = insp && INSPECTORS.find((p) => p.id === insp.inspector);
  const primary = {
    reported: ['verify', 'check', 'Verify report'], under_review: ['verify', 'check', 'Verify report'], verified: ['assign', 'building', 'Assign authority'],
    assigned: ['schedule', 'calendar', 'Schedule inspection'], reopened: ['schedule', 'calendar', 'Schedule re-inspection'], inspected: ['approve', 'tools', 'Approve work'],
  }[r.status];
  return portal('reports', `
    <div class="row xs muted" style="margin-bottom:10px"><a href="#/gov/reports" class="link" style="font-size:13px">Reports</a>${icon('chevronR', 14)}<span class="tnum">${r.ref}</span></div>
    ${ptop(esc(r.title), `${categoryByKey(r.category).label}${r.subtype ? ' · ' + r.subtype : ''} · ${esc(r.street)}, ${communityName(r.community)} · reported ${fmtDate(r.createdAt, { day: 'numeric', month: 'short', year: 'numeric' })}`,
      `<a class="btn btn-ghost btn-sm" href="#/issue/${r.ref}">${icon('eye', 16)}Citizen view</a>${primary ? `<button class="btn btn-primary" data-action="gov-${primary[0]}" data-ref="${r.ref}">${icon(primary[1], 17)}${primary[2]}</button>` : ''}`)}
    ${r.urgent && !['completed', 'monitoring'].includes(r.status) ? `<div class="banner banner-urgent" style="margin-bottom:16px">${icon('alert', 20)}<div><b>Potential urgent safety issue.</b> <span class="small">Citizen-reported severity — validate before prioritising. ${r.supporting ? `${AGENCIES[r.supporting].short} has been notified.` : ''}</span></div></div>` : ''}
    <div class="pgrid" style="margin-top:0">
      <div class="span-8 stack">
        <div class="card"><div class="row between"><h3>Evidence</h3><span class="xs faint">${r.photos.length} item(s) · ${r.identity === 'private' ? 'reporter private publicly' : 'reporter: ' + (r.reporterName || 'community member')}</span></div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;margin-top:12px">${(r.photos.length ? r.photos : [{ scene: r.category }]).map((p) => `<div style="border-radius:12px;overflow:hidden;aspect-ratio:4/3;position:relative">${media(p)}<span class="tag" style="position:absolute;left:8px;bottom:8px;background:var(--surface)">${p.phase || 'before'}</span></div>`).join('')}</div>
          <p style="margin-top:14px">${esc(r.description)}</p>
          ${r.answers ? `<div class="chips" style="margin-top:10px">${Object.entries(r.answers).map(([k, v]) => `<span class="tag">${{ duration: 'Duration', access: 'Blocks access', safety: 'Safety risk' }[k]}: ${esc(v)}</span>`).join('')}</div>` : ''}</div>
        ${insp?.completedAt ? `<div class="card stack-sm"><div class="row between"><h3>Inspection report</h3><span class="xs faint">${inspector?.name} · ${fmtDate(insp.completedAt)}</span></div>
          <dl class="kv"><dt>Outcome</dt><dd>${INSPECTION_OUTCOMES[insp.outcome].label}</dd><dt>Assessed severity</dt><dd>${SeverityBadge(insp.assessedSeverity)}</dd>${insp.scope ? `<dt>Scope estimate</dt><dd>${esc(insp.scope)}</dd>` : ''}${insp.gps ? `<dt>GPS</dt><dd class="tnum">${insp.gps}</dd>` : ''}</dl><p class="small">${esc(insp.findings)}</p></div>` : ''}
        ${wo ? `<a class="card card-hover row gap-12" href="#/gov/work-orders/${wo.id}"><span style="width:42px;height:42px;border-radius:12px;background:color-mix(in srgb, var(--st-active) 14%, transparent);color:var(--st-active);display:grid;place-items:center">${icon('wrench', 20)}</span><div class="grow"><b>${wo.id}</b><div class="small muted">${esc(wo.scope)}</div></div><span class="tag">${wo.status.replace('_', ' ')}</span>${icon('chevronR', 18)}</a>` : ''}
        <div class="card"><div class="row between" style="margin-bottom:14px"><h3>Public timeline</h3><button class="btn btn-secondary btn-sm" data-action="gov-update" data-ref="${r.ref}">${icon('megaphone', 15)}Add public update</button></div>${Timeline(r.timeline, { delay: r.delay })}</div>
      </div>
      <div class="span-4 stack">
        <div class="card stack-sm"><div class="row between"><h3>Status</h3>${StatusBadge(r.status)}</div>
          <dl class="kv"><dt>Priority</dt><dd><span class="priority ${r.priority}">${r.priority}</span></dd><dt>Citizen severity</dt><dd>${SeverityBadge(r.severity)}</dd><dt>Validated</dt><dd>${r.validatedSeverity ? SeverityBadge(r.validatedSeverity) : '<span class="faint">Not yet</span>'}</dd>
            <dt>Confirmations</dt><dd class="tnum">${r.affected}</dd><dt>Followers</dt><dd class="tnum">${r.followers.length}</dd>${r.eta ? `<dt>Target</dt><dd>${fmtDate(r.eta)}</dd>` : ''}</dl></div>
        <div class="card stack-sm"><h3>Routing</h3><div class="authority"><span class="logo">${AGENCIES[r.agency].short.slice(0, 4)}</span><div><b class="small">${AGENCIES[r.agency].name}</b><div class="xs muted">${r.routingState}</div></div></div>
          ${r.routingReason ? `<p class="xs muted">${esc(r.routingReason)}</p>` : ''}<button class="btn btn-secondary btn-sm" data-action="gov-assign" data-ref="${r.ref}">${icon('refresh', 15)}Transfer / reassign</button></div>
        <div class="card stack-sm"><h3>Actions</h3><div class="action-bar">
          ${['reported', 'under_review'].includes(r.status) ? `<button class="btn btn-secondary btn-sm" data-action="gov-verify" data-ref="${r.ref}">${icon('check', 15)}Verify</button>` : ''}
          ${!['completed', 'monitoring', 'unable'].includes(r.status) ? `<button class="btn btn-secondary btn-sm" data-action="gov-schedule" data-ref="${r.ref}">${icon('calendar', 15)}Schedule inspection</button>` : ''}
          ${r.status === 'inspected' ? `<button class="btn btn-secondary btn-sm" data-action="gov-approve" data-ref="${r.ref}">${icon('tools', 15)}Approve work</button>` : ''}
          <button class="btn btn-secondary btn-sm" data-action="gov-info" data-ref="${r.ref}">${icon('info', 15)}Request info</button>
          <button class="btn btn-secondary btn-sm" data-action="gov-merge" data-ref="${r.ref}">${icon('layers', 15)}Merge duplicate</button>
          <button class="btn btn-secondary btn-sm" data-action="gov-note" data-ref="${r.ref}">${icon('clipboard', 15)}Internal note</button>
          ${!['completed', 'monitoring', 'unable'].includes(r.status) ? `<button class="btn btn-ghost btn-sm" style="color:var(--clay)" data-action="gov-reject" data-ref="${r.ref}">${icon('x', 15)}Reject</button>` : ''}</div></div>
        ${dups.length ? `<div class="card stack-sm"><h3>Possible duplicates</h3>${dups.map((d) => `<a class="row gap-12 small" href="#/gov/reports/${d.ref}">${CatIcon(d.category, 26)}<span class="grow ellipsis">${esc(d.street)} — ${esc(d.title)}</span>${StatusBadge(d.status)}</a>`).join('')}</div>` : ''}
        ${r.notes?.length ? `<div class="card stack-sm"><h3>Internal notes <span class="xs faint">(not public)</span></h3>${r.notes.map((n) => `<div class="note"><div class="xs faint">${n.by} · ${timeAgo(n.at)}</div>${esc(n.text)}</div>`).join('')}</div>` : ''}
        <div class="card"><h3>Location</h3><div class="map" style="height:180px;margin-top:10px">${MapBase()}${MapPin(r, true)}</div><p class="xs muted" style="margin-top:8px">${esc(r.landmark || '')} · ${communityName(r.community)} · Lagos</p></div>
      </div>
    </div>`);
}

// ---------- Inspections & work orders ----------
export function inspections() {
  const list = repo.inspections();
  return portal('insp', `${ptop('Inspections', 'Scheduled and completed field inspections.')}
    <div class="table-wrap"><table class="table"><thead><tr><th>Report</th><th>Inspector</th><th>Date</th><th>Window</th><th>Outcome</th><th>Status</th></tr></thead><tbody>
    ${list.map((i) => `<tr class="click" data-action="open-row" data-href="#/gov/reports/${i.report.ref}"><td><b class="small">${esc(i.report.title)}</b><div class="xs faint">${i.report.ref}</div></td><td class="small">${INSPECTORS.find((p) => p.id === i.inspector)?.name || '—'}</td><td class="small">${fmtDate(i.date)}</td><td class="small">${i.window || '—'}</td><td class="small">${i.outcome ? INSPECTION_OUTCOMES[i.outcome].label : '—'}</td>
      <td>${i.completedAt ? '<span class="status" style="--c:var(--st-done)">Completed</span>' : i.startedAt ? '<span class="status" style="--c:var(--st-active)">On site</span>' : '<span class="status" style="--c:var(--st-inspection)">Scheduled</span>'}</td></tr>`).join('')}
    </tbody></table></div>`);
}

export function workOrders() {
  const list = repo.listWorkOrders();
  return portal('wo', `${ptop('Work Orders', 'Approved work assigned to contractors and maintenance teams.')}
    <div class="table-wrap"><table class="table"><thead><tr><th>Work order</th><th>Scope</th><th>Contractor / team</th><th>Start</th><th>Target</th><th>Progress</th><th>Status</th></tr></thead><tbody>
    ${list.map((w) => `<tr class="click" data-action="open-row" data-href="#/gov/work-orders/${w.id}"><td><b class="tnum">${w.id}</b><div class="xs faint">${w.reportRef}</div></td><td class="small" style="max-width:300px">${esc(w.scope)}</td><td class="small">${CONTRACTORS.find((c) => c.id === w.contractor).name}</td><td class="small">${fmtDate(w.start)}</td>
      <td class="small">${fmtDate(w.target)}${w.originalTarget ? `<div class="xs" style="color:var(--st-planned)">was ${fmtDate(w.originalTarget)}</div>` : ''}</td><td style="width:120px"><div class="mini-progress"><span class="on" style="flex:${w.progress}"></span><span style="flex:${100 - w.progress}"></span></div><span class="xs faint">${w.progress}%</span></td>
      <td><span class="status" style="--c:${{ in_progress: 'var(--st-active)', scheduled: 'var(--st-planned)', completed: 'var(--st-done)', paused: 'var(--st-blocked)' }[w.status] || 'var(--st-new)'}">${w.status.replace('_', ' ')}</span></td></tr>`).join('')}
    </tbody></table></div>`);
}

export function workOrder(id) {
  const w = repo.getWorkOrder(id); if (!w) return portal('wo', EmptyState('Not found', ''));
  const r = repo.getReport(w.reportRef); const c = CONTRACTORS.find((x) => x.id === w.contractor);
  return portal('wo', `<div class="row xs muted" style="margin-bottom:10px"><a href="#/gov/work-orders" class="link" style="font-size:13px">Work Orders</a>${icon('chevronR', 14)}<span>${w.id}</span></div>
    ${ptop(`${w.id}`, esc(r.title), `<a class="btn btn-secondary" href="#/gov/reports/${r.ref}">Open report</a><a class="btn btn-ghost" href="#/team/${w.id}">${icon('eye', 16)}Field team view</a>`)}
    <div class="pgrid" style="margin-top:0"><div class="span-8 stack">
      <div class="card"><dl class="kv" style="grid-template-columns:auto 1fr auto 1fr;text-align:left"><dt>Issue</dt><dd style="text-align:left">${esc(r.title)}</dd><dt>Location</dt><dd style="text-align:left">${esc(r.street)}, ${communityName(r.community)}</dd>
        <dt>Department</dt><dd style="text-align:left">${esc(w.department)}</dd><dt>Contractor / team</dt><dd style="text-align:left">${c.name} <span class="xs faint">(${c.kind})</span></dd>
        <dt>Priority</dt><dd style="text-align:left"><span class="priority ${w.priority}">${w.priority}</span></dd><dt>Status</dt><dd style="text-align:left">${w.status.replace('_', ' ')}</dd>
        <dt>Start</dt><dd style="text-align:left">${fmtDate(w.start)}</dd><dt>Target completion</dt><dd style="text-align:left">${fmtDate(w.target)}${w.originalTarget ? ` <s class="faint">${fmtDate(w.originalTarget)}</s>` : ''}</dd>
        <dt>Actual completion</dt><dd style="text-align:left">${w.actual ? fmtDate(w.actual) : '—'}</dd><dt>Progress</dt><dd style="text-align:left">${w.progress}%</dd></dl>
        <h3 style="margin-top:16px">Scope</h3><p class="small">${esc(w.scope)}</p></div>
      <div class="card"><h3>Progress updates</h3><div class="stack-sm" style="margin-top:12px">${w.updates.length ? w.updates.map((u) => `<div class="row gap-12"><span class="status" style="--c:var(--st-active)">${u.stage}</span><span class="small grow">${esc(u.note)}</span><span class="xs faint">${fmtDate(u.at)}</span></div>`).join('') : '<p class="small muted">No updates yet.</p>'}</div></div>
      ${r.completion ? `<div class="card stack-sm"><h3>Completion evidence</h3>${BeforeAfter(photoFor(r, 'before').scene, photoFor(r, 'after').scene, 'ba-wo')}<p class="small">${esc(r.completion.note)}</p></div>` : ''}
    </div><div class="span-4 stack">
      <div class="card stack-sm"><h3>Internal only</h3><dl class="kv"><dt>Estimated budget</dt><dd>${ngn(w.estimate)}</dd><dt>Funding source</dt><dd>${esc(w.funding)}</dd></dl><p class="xs faint">${icon('lock', 12).replace('class="ic', 'style="display:inline;vertical-align:-2px" class="ic')} Not shown to the public.</p></div>
      <div class="card stack-sm"><h3>Inspection evidence</h3>${r.inspection?.completedAt ? `<p class="small">${esc(r.inspection.findings)}</p>` : '<p class="small muted">—</p>'}</div>
    </div></div>`);
}

// ---------- Map / Analytics / misc ----------
export function govMap() {
  const R = all().filter((r) => r.status !== 'unable');
  return portal('map', `${ptop('Map', 'All open and recent reports across your jurisdiction.')}
    <div class="card" style="padding:12px"><div class="map" style="height:calc(100vh - 220px);min-height:460px">${MapBase()}${R.map((r) => MapPin(r, r.ref === ui.mapSel)).join('')}
      ${ui.mapSel ? (() => { const s = repo.getReport(ui.mapSel); return `<div class="map-sheet" style="max-width:420px"><a class="card row gap-12" href="#/gov/reports/${s.ref}" style="box-shadow:var(--shadow)">${CatIcon(s.category, 36)}<div class="grow"><b class="small">${esc(s.title)}</b><div class="xs muted">${s.ref}</div></div>${StatusBadge(s.status)}</a></div>`; })() : ''}</div>
    <div class="map-legend" style="margin-top:10px">${Object.entries(GROUPS).map(([, g]) => `<span><i style="background:${g.color}"></i>${g.label}</span>`).join('')}</div></div>`);
}

export function analytics() {
  const heat = ['Adeola St', 'Bode Thomas', 'Ogunlana Dr', 'Lawanson Rd', 'Herbert Macaulay', 'Alagomeji'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
  const flood = [2, 1, 3, 6, 11, 18, 24, 21, 16, 9, 5]; const max = 24;
  return portal('analytics', `${ptop('Analytics', 'From reactive repairs to planned maintenance.')}
    <div class="kpis">${[['Avg. acknowledgement', '1.6 days'], ['Avg. inspection time', '4.4 days'], ['Avg. resolution', '18 days'], ['Completion rate', '71%'], ['Recurrence (90d)', '8%'], ['Citizen-confirmed fixes', '92%']].map(([l, v]) => `<div class="kpi"><span class="l">${l}</span><span class="n">${v}</span></div>`).join('')}</div>
    <div class="pgrid">
      <div class="card span-6"><h3>Seasonal pattern · flooding & drainage</h3><p class="xs faint">Reports per month, 2026 — plan desilting before May.</p><div class="chart-bars">${months.map((m, i) => `<div class="bc"><span class="bar" style="height:${(flood[i] / max) * 100}%;background:${flood[i] > 15 ? 'var(--st-active)' : 'color-mix(in srgb, var(--st-active) 45%, transparent)'}"></span><span>${m}</span></div>`).join('')}</div></div>
      <div class="card span-6"><h3>Recurring hotspots</h3><p class="xs faint">Locations with 3+ reports in 12 months</p><div class="stack-sm" style="margin-top:10px">${heat.map((h, i) => `<div class="bar-row" style="grid-template-columns:130px 1fr 30px"><span>${h}</span><div class="b"><span style="width:${95 - i * 13}%;background:var(--clay);opacity:${1 - i * 0.12}"></span></div><span class="tnum faint">${9 - i}</span></div>`).join('')}</div></div>
      <div class="card span-12"><h3>Contractor performance</h3><table class="table" style="margin-top:8px"><thead><tr><th>Contractor / team</th><th>Jobs</th><th>On time</th><th>Avg. delay</th><th>Citizen-confirmed</th><th>Reopened</th></tr></thead><tbody>
        ${CONTRACTORS.map((c, i) => `<tr><td><b class="small">${c.name}</b><div class="xs faint">${c.speciality}</div></td><td class="tnum">${[14, 31, 9, 22][i]}</td><td class="tnum">${[86, 74, 67, 91][i]}%</td><td class="tnum">${[1.2, 3.4, 5.0, 0.8][i]} d</td><td class="tnum">${[93, 88, 81, 96][i]}%</td><td class="tnum">${[1, 3, 2, 0][i]}</td></tr>`).join('')}</tbody></table></div>
    </div>`);
}

export function audit() {
  const list = repo.state.audit;
  return portal('audit', `${ptop('Audit log', 'Every government action is recorded and cannot be edited.')}
    ${list.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>When</th><th>Who</th><th>Action</th><th>Subject</th><th>Detail</th></tr></thead><tbody>${list.map((a) => `<tr><td class="xs">${new Date(a.at).toLocaleString('en-NG')}</td><td class="small">${esc(a.actor)}</td><td><span class="tag">${a.action}</span></td><td class="small tnum">${a.subject}</td><td class="xs muted" style="font-family:ui-monospace,monospace;max-width:380px">${esc(JSON.stringify(a.detail))}</td></tr>`).join('')}</tbody></table></div>`
      : `<div class="card">${EmptyState('No actions yet this session', 'Verify, assign or schedule a report and it will appear here.')}</div>`}`);
}

export function placeholder(key, title, body) { return portal(key, `${ptop(title)}<div class="card">${EmptyState(title, body)}</div>`); }

// ---------- Public transparency ----------
export function publicData() {
  const R = all(); const n = (f) => R.filter(f).length;
  const stages = [['Reports', R.length + 1240, 'var(--st-new)'], ['Acknowledged', n((r) => r.status !== 'reported') + 1180, 'var(--st-confirmed)'], ['Inspected', n((r) => r.inspection?.completedAt) + 880, 'var(--st-inspection)'], ['Scheduled', n((r) => ['work_planned', 'scheduled', 'in_progress', 'completed', 'monitoring'].includes(r.status)) + 710, 'var(--st-planned)'], ['In progress', n((r) => r.status === 'in_progress') + 96, 'var(--st-active)'], ['Resolved', n((r) => ['completed', 'monitoring'].includes(r.status)) + 590, 'var(--st-done)']];
  const max = stages[0][1];
  return `<div style="max-width:1080px;margin:0 auto;padding:24px 16px 60px" class="stack-lg">
    <div class="row between"><a class="row" href="#/">${logo(32)}<b style="font:750 18px var(--display)">NaijaWorks</b><span class="tag">Open data</span></a><a class="btn btn-secondary btn-sm" href="#/">Citizen app</a></div>
    <div><h1 style="font-size:36px">What happens after people report</h1><p class="muted" style="margin-top:6px;max-width:640px">Aggregated across Lagos State, all categories, last 12 months. Updated daily.</p></div>
    <div class="row wrap">${['Lagos State', 'All LGAs', 'All communities', 'All categories', 'All authorities'].map((x) => `<button class="chip">${x}${icon('chevronD', 14)}</button>`).join('')}</div>
    <div class="card"><h3>Report journey</h3><div class="stack-sm" style="margin-top:14px">${stages.map(([l, v, c]) => `<div class="bar-row" style="grid-template-columns:110px 1fr 60px"><span class="small">${l}</span><div class="b" style="height:22px"><span style="width:${(v / max) * 100}%;background:${c}"></span></div><b class="tnum small">${v.toLocaleString()}</b></div>`).join('')}</div></div>
    <div class="kpis">${[['Median time to acknowledge', '1.6 days'], ['Median time to inspect', '4.4 days'], ['Median time to resolve', '18 days'], ['Fixes confirmed by residents', '92%']].map(([l, v]) => `<div class="kpi"><span class="l">${l}</span><span class="n">${v}</span></div>`).join('')}</div>
    <div class="banner banner-sun">${icon('info', 20)}<div class="small"><b>About comparing areas.</b> Numbers depend on how many people use NaijaWorks in each place. An area with fewer reports is not necessarily better served. We don’t rank LGAs or officials; use these figures alongside other sources.</div></div>
  </div>`;
}

// ---------- Modals & actions ----------
const sel = (name, opts, cur) => `<select class="select" name="${name}" required>${opts.map(([v, l]) => `<option value="${v}" ${v === cur ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
const fld = (label, inner) => `<div class="field"><label>${label}</label>${inner}</div>`;
const formModal = (title, action, ref, inner, submit, sub = '') => Modal(`<form class="stack" data-action="${action}" data-ref="${ref}"><div><h2>${title}</h2>${sub ? `<p class="small muted" style="margin-top:4px">${sub}</p>` : ''}</div>${inner}
  <div class="row" style="justify-content:flex-end"><button type="button" class="btn btn-ghost" data-action="close-modal">Cancel</button><button class="btn btn-primary">${submit}</button></div></form>`);

export const actions = {
  'gov-tab': (el) => { ui.gov.tab = el.dataset.v; rerender(); },
  'gov-search': (el, e) => { e.preventDefault(); ui.gov.q = new FormData(el).get('q'); rerender(); },
  'open-row': (el) => go(el.dataset.href),
  'gov-verify': (el) => { const r = repo.getReport(el.dataset.ref); openModal(formModal('Verify report', 'do-verify', r.ref,
    fld('Validated severity', sel('severity', Object.entries(SEVERITY).map(([k, v]) => [k, v.label]), r.severity)) + fld('Priority', sel('priority', [['urgent', 'Urgent'], ['high', 'High'], ['medium', 'Medium'], ['low', 'Low']], r.priority))
    + `<p class="xs muted">Priority is based on severity and impact, not only on how many people confirmed it (${r.affected}).</p>`, 'Verify', 'Confirm this is a genuine public infrastructure issue.')); },
  'do-verify': (el, e) => { e.preventDefault(); repo.verify(el.dataset.ref, formData(el)); closeModal(); toast('Verified · citizen notified'); rerender(); },
  'gov-assign': (el) => { const r = repo.getReport(el.dataset.ref); openModal(formModal('Assign responsible authority', 'do-assign', r.ref,
    fld('Authority', sel('agency', Object.values(AGENCIES).filter((a) => a.id !== 'triage').map((a) => [a.id, `${a.name} (${a.level})`]), r.agency))
    + fld('Public reason (shown to citizens)', `<input class="input" name="reason" placeholder="e.g. This road is state-managed">`), 'Assign', 'Transfers are shown transparently on the public timeline.')); },
  'do-assign': (el, e) => { e.preventDefault(); const f = formData(el); repo.assign(el.dataset.ref, f.agency, f.reason); closeModal(); toast('Assignment saved'); rerender(); },
  'gov-schedule': (el) => { const r = repo.getReport(el.dataset.ref); openModal(formModal('Schedule inspection', 'do-schedule', r.ref,
    fld('Inspector', sel('inspector', INSPECTORS.map((p) => [p.id, `${p.name} — ${AGENCIES[p.agency].short}`]), PEOPLE.inspector.id))
    + `<div class="row gap-12">${fld('Date', `<input class="input" type="date" name="date" value="${isoInDays(r.urgent ? 0 : 2)}" required>`)}${fld('Time window', sel('window', [['8am – 11am', '8am – 11am'], ['10am – 1pm', '10am – 1pm'], ['1pm – 4pm', '1pm – 4pm']], '10am – 1pm'))}</div>`
    + fld('Priority', sel('priority', [['urgent', 'Urgent'], ['high', 'High'], ['medium', 'Medium'], ['low', 'Low']], r.priority))
    + fld('Instructions for inspector', `<textarea class="textarea" name="instructions" placeholder="What to check on site"></textarea>`), 'Schedule', 'The citizen will see the inspection date.')); },
  'do-schedule': (el, e) => { e.preventDefault(); const f = formData(el); repo.scheduleInspection(el.dataset.ref, { ...f, date: new Date(f.date + 'T10:00').toISOString() }); closeModal(); toast('Inspection scheduled · citizen notified', 'calendar'); rerender(); },
  'gov-reject': (el) => openModal(formModal('Reject report', 'do-reject', el.dataset.ref,
    fld('Reason (required)', sel('reason', Object.entries(REJECT_REASONS).map(([k, v]) => [k, v.label]), 'insufficient')) + fld('Note to citizen (optional)', `<textarea class="textarea" name="note"></textarea>`)
    + `<div class="note">The citizen receives a friendly explanation for the reason you pick.</div>`, 'Reject report')),
  'do-reject': (el, e) => { e.preventDefault(); const f = formData(el); repo.reject(el.dataset.ref, f.reason, f.note); closeModal(); toast('Report closed with explanation'); go('#/gov/reports'); },
  'gov-merge': (el) => { const r = repo.getReport(el.dataset.ref); const cands = repo.allReportsInternal().filter((x) => x.ref !== r.ref && !x.mergedInto && x.category === r.category);
    openModal(formModal('Merge duplicate', 'do-merge', r.ref, cands.length ? fld('Merge this report into', sel('into', cands.map((c) => [c.ref, `${c.ref} — ${c.title}`]))) + '<p class="xs muted">Confirmations and followers move to the main report.</p>' : '<p class="muted">No similar reports found.</p>', 'Merge')); },
  'do-merge': (el, e) => { e.preventDefault(); const into = formData(el).into; repo.merge(el.dataset.ref, into); closeModal(); toast('Merged'); go('#/gov/reports/' + into); },
  'gov-update': (el) => openModal(formModal('Add public update', 'do-update', el.dataset.ref, fld('Update (plain language)', `<textarea class="textarea" name="text" required placeholder="e.g. Materials have been delivered; work starts Monday."></textarea>`), 'Publish update', 'Avoid vague words like “processing”. Say what is happening and when.')),
  'do-update': (el, e) => { e.preventDefault(); repo.publicUpdate(el.dataset.ref, formData(el).text); closeModal(); toast('Update published'); rerender(); },
  'gov-note': (el) => openModal(formModal('Internal note', 'do-note', el.dataset.ref, fld('Note (never public)', `<textarea class="textarea" name="text" required></textarea>`), 'Save note')),
  'do-note': (el, e) => { e.preventDefault(); repo.internalNote(el.dataset.ref, formData(el).text); closeModal(); toast('Note saved'); rerender(); },
  'gov-info': (el) => openModal(formModal('Request more information', 'do-update', el.dataset.ref, fld('What do you need?', `<textarea class="textarea" name="text" required>Could you add a photo showing the nearest landmark? It will help our inspector find the exact spot.</textarea>`), 'Send request')),
  'gov-approve': (el) => { const r = repo.getReport(el.dataset.ref); openModal(formModal('Approve work', 'do-approve', r.ref,
    `<div class="note"><b>Inspector recommends:</b> ${INSPECTION_OUTCOMES[r.inspection.outcome].label}. ${esc(r.inspection.findings || '')}</div>`
    + fld('Type of work (public)', sel('workType', [['Repair', 'Repair'], ['Maintenance', 'Maintenance'], ['Replacement', 'Replacement'], ['Emergency work', 'Emergency work']], r.inspection.outcome === 'replacement' ? 'Replacement' : 'Repair'))
    + fld('Scope', `<textarea class="textarea" name="scope" required>${esc(r.inspection.scope || r.inspection.findings || '')}</textarea>`)
    + fld('Contractor / maintenance team', sel('contractor', CONTRACTORS.map((c) => [c.id, `${c.name} — ${c.speciality}`]), 'c-2'))
    + `<div class="row gap-12">${fld('Start date', `<input class="input" type="date" name="start" value="${isoInDays(3)}" required>`)}${fld('Target completion', `<input class="input" type="date" name="target" value="${isoInDays(10)}" required>`)}</div>`
    + `<div class="row gap-12">${fld('Estimated budget (₦) · internal', `<input class="input" type="number" name="estimate" value="1500000">`)}${fld('Funding source · internal', sel('funding', [['LGA maintenance budget 2026', 'LGA maintenance 2026'], ['State works budget 2026', 'State works 2026'], ['Emergency fund', 'Emergency fund']]))}</div>`,
    'Approve & create work order', 'Citizens see the work type and dates. Budget and funding stay internal.')); },
  'do-approve': (el, e) => { e.preventDefault(); const f = formData(el); const id = repo.approveWork(el.dataset.ref, { ...f, start: new Date(f.start + 'T08:00').toISOString(), target: new Date(f.target + 'T17:00').toISOString(), estimate: +f.estimate }); closeModal(); toast(`${id} created · citizens notified`, 'wrench'); rerender(); },
};
