// Inspector app + Contractor / maintenance team app (mobile).
import { repo, fmtDate, PEOPLE, CONTRACTORS } from '../api/repo.js';
import { ui, go, rerender, toast, openModal, closeModal, formData, isoInDays } from '../ctx.js';
import { icon } from '../ui/icons.js';
import { SEVERITY, INSPECTION_OUTCOMES, PROGRESS_STAGES } from '../domain/statuses.js';
import { categoryByKey } from '../domain/categories.js';
import { esc, StatusBadge, SeverityBadge, MapBase, MapPin, communityName, media, Modal, EmptyState, CatIcon, photoFor } from '../ui/components.js';

const frame = (content, aside) => `<div class="stage"><div class="phone"><div class="phone-scroll" id="scroller" style="padding-bottom:24px">${content}</div></div>
  <aside class="stage-aside"><div class="card stack-sm"><div class="row">${icon('info', 18)}<b>${aside}</b></div><p class="small muted">Large buttons, works offline and syncs later. GPS and time are captured automatically.</p></div></aside></div>`;
const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();

// ---------- Inspector ----------
export function inspectorHome() {
  const mine = repo.inspections();
  const tabs = { today: mine.filter((i) => !i.completedAt && new Date(i.date) <= new Date(Date.now() + 864e5) ), upcoming: mine.filter((i) => !i.completedAt && new Date(i.date) > new Date(Date.now() + 864e5)),
    urgent: mine.filter((i) => !i.completedAt && i.report.urgent), done: mine.filter((i) => i.completedAt) };
  const list = tabs[ui.inspectorTab];
  return frame(`<div class="field-head stack">
      <div class="row between"><div><div class="small muted">${new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}</div><h1 style="color:#fff;font-size:24px">Hello, Engr. Chukwudi</h1></div><span class="tag" style="background:rgb(255 255 255 / .1);color:#CFE3D8">${icon('wifi', 13)}Online</span></div>
      <div class="row" style="gap:10px">${[['Today', tabs.today.length], ['Urgent', tabs.urgent.length], ['Done this week', tabs.done.length]].map(([l, n]) => `<div style="flex:1;background:rgb(255 255 255 / .07);border-radius:14px;padding:10px 12px"><div style="font:750 22px var(--display);color:#fff">${n}</div><div class="xs muted">${l}</div></div>`).join('')}</div></div>
    <div class="screen stack" style="margin-top:14px">
      <div class="seg">${[['today', 'Today'], ['upcoming', 'Upcoming'], ['urgent', 'Urgent'], ['done', 'Completed']].map(([k, l]) => `<button aria-selected="${ui.inspectorTab === k}" data-action="ins-tab" data-v="${k}">${l}</button>`).join('')}</div>
      ${list.length ? list.map((i) => `<a class="card card-hover stack-sm" href="#/inspector/${i.report.ref}">
        <div class="row between"><span class="tag">${icon('clock', 13)}${fmtDate(i.date, { weekday: 'short', day: 'numeric', month: 'short' })} · ${i.window || 'Anytime'}</span>${i.report.urgent ? '<span class="sev sev-urgent">Urgent</span>' : `<span class="priority ${i.report.priority}">${i.report.priority}</span>`}</div>
        <div class="row gap-12">${CatIcon(i.report.category, 40)}<div class="grow"><b>${esc(i.report.title)}</b><div class="xs muted">${esc(i.report.street)}, ${communityName(i.report.community)}</div></div>${icon('chevronR', 18, 'faint')}</div>
        ${i.instructions ? `<div class="note xs">${esc(i.instructions)}</div>` : ''}</a>`).join('')
        : EmptyState('Nothing here', ui.inspectorTab === 'today' ? 'No inspections today. Check upcoming.' : 'No inspections in this list.')}
      ${ui.inspectorTab === 'today' && !tabs.today.length ? '' : ''}
    </div>`, 'Field Inspector app');
}

export function inspection(ref) {
  const r = repo.getReport(ref); if (!r?.inspection) return frame(EmptyState('Not found', ''), 'Field Inspector app');
  const i = r.inspection; const s = ui.inspection[ref] ||= { photos: 0, confirmed: null, severity: r.severity, outcome: 'repair', notes: '', scope: '' };
  const started = !!i.startedAt; const done = !!i.completedAt;
  return frame(`<header class="topbar"><a class="icon-btn" href="#/inspector" aria-label="Back">${icon('chevronL', 20)}</a><h1 class="grow ellipsis" style="font-size:17px">Inspection · ${r.ref}</h1></header>
    <div class="screen stack">
      <div class="map" style="height:170px">${MapBase()}${MapPin(r, true)}<div class="mypos" style="left:${r.pos.x - 8}%;top:${r.pos.y + 10}%"></div></div>
      <div><h2>${esc(r.title)}</h2><p class="small muted row" style="margin-top:4px">${icon('pin', 14)}${esc(r.street)}${r.landmark ? ' · ' + esc(r.landmark) : ''}, ${communityName(r.community)}</p></div>
      <button class="btn btn-secondary btn-block" data-action="toast" data-msg="Opening directions in Maps…">${icon('nav', 18)}Navigate · 2.1 km, 9 min</button>
      <div class="stat-pair" style="grid-template-columns:repeat(3,1fr)"><div class="stat"><div class="l">Reported</div>${SeverityBadge(r.severity)}</div><div class="stat"><div class="n tnum" style="font-size:20px">${r.affected}</div><div class="l">confirmations</div></div><div class="stat"><div class="n tnum" style="font-size:20px">${r.photos.length}</div><div class="l">citizen photos</div></div></div>
      ${i.instructions ? `<div class="note"><b>Instructions:</b> ${esc(i.instructions)}</div>` : ''}
      <div class="stack-sm"><span class="label">Citizen evidence</span><div class="hscroll">${r.photos.filter((p) => p.phase === 'before').map((p) => `<div style="width:200px;height:140px;border-radius:14px;overflow:hidden">${media(p)}</div>`).join('')}</div><p class="small">${esc(r.description)}</p></div>
      ${done ? `<div class="banner banner-info">${icon('check', 20)}<div><b>Inspection submitted</b><p class="small">${INSPECTION_OUTCOMES[i.outcome].label} · ${esc(i.findings)}</p></div></div>` :
      !started ? `<button class="btn btn-primary btn-block big-action" data-action="ins-start" data-ref="${ref}">${icon('play', 20)}Start inspection</button><p class="xs faint" style="text-align:center">Your GPS position and the time are recorded when you start.</p>` : `
      <div class="banner banner-sun">${icon('target', 18)}<p class="small">On site since ${new Date(i.startedAt).toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' })} · GPS ${i.gps}</p></div>
      <div class="card stack">
        <div class="stack-sm"><span class="label">Inspection photos & video</span><div class="up-grid"><button class="up-tile" data-action="ins-photo" data-ref="${ref}">${icon('camera', 22)}Take photo</button><button class="up-tile" data-action="toast" data-msg="Video recorded (0:15)">${icon('video', 22)}Add video</button></div>
          ${s.photos ? `<div class="thumbs">${Array.from({ length: s.photos }, () => `<div class="t">${media(photoFor(r))}</div>`).join('')}</div>` : ''}</div>
        <div class="stack-sm"><span class="label">Is the problem confirmed?</span><div class="seg"><button aria-selected="${s.confirmed === true}" data-action="ins-set" data-ref="${ref}" data-k="confirmed" data-v="true">Yes, confirmed</button><button aria-selected="${s.confirmed === false}" data-action="ins-set" data-ref="${ref}" data-k="confirmed" data-v="false">No / invalid</button></div></div>
        ${s.confirmed !== false ? `<div class="stack-sm"><span class="label">Assessed severity</span><div class="chips">${Object.entries(SEVERITY).map(([k, v]) => `<button class="chip" aria-pressed="${s.severity === k}" data-action="ins-set" data-ref="${ref}" data-k="severity" data-v="${k}">${v.label}</button>`).join('')}</div></div>
        <div class="field"><label>Recommended action</label><select class="select" data-action="ins-select" data-ref="${ref}" data-k="outcome">${Object.entries(INSPECTION_OUTCOMES).map(([k, v]) => `<option value="${k}" ${s.outcome === k ? 'selected' : ''}>${v.label}</option>`).join('')}</select></div>
        <div class="field"><label>Estimated scope of work</label><input class="input" data-insbind="scope" data-ref="${ref}" value="${esc(s.scope)}" placeholder="e.g. Patch 3 potholes ≈ 9 m², desilt 40 m drain"></div>` : ''}
        <div class="field"><label>Findings (plain language — citizens see a summary)</label><textarea class="textarea" data-insbind="notes" data-ref="${ref}" placeholder="What you found on site">${esc(s.notes)}</textarea></div>
      </div>
      <button class="btn btn-primary btn-block big-action" data-action="ins-submit" data-ref="${ref}" ${s.confirmed === null ? 'disabled' : ''}>${icon('check', 20)}Complete inspection</button>`}
    </div>`, 'Field Inspector app');
}

// ---------- Contractor / maintenance team ----------
export function teamHome() {
  const all = repo.listWorkOrders();
  const tabs = { assigned: all.filter((w) => ['scheduled', 'approved'].includes(w.status)), progress: all.filter((w) => ['in_progress', 'paused'].includes(w.status)), done: all.filter((w) => w.status === 'completed') };
  const list = tabs[ui.teamTab];
  return frame(`<div class="field-head stack" style="background:#1D1A10"><div><div class="small muted">Field team</div><h1 style="color:#fff;font-size:24px">Ọ̀nà Roads & Civil · Crew A</h1></div>
      <div class="row" style="gap:10px">${[['Assigned', tabs.assigned.length], ['In progress', tabs.progress.length], ['Completed', tabs.done.length]].map(([l, n]) => `<div style="flex:1;background:rgb(255 255 255 / .07);border-radius:14px;padding:10px 12px"><div style="font:750 22px var(--display);color:#fff">${n}</div><div class="xs muted">${l}</div></div>`).join('')}</div></div>
    <div class="screen stack" style="margin-top:14px">
      <div class="seg">${[['assigned', 'Assigned'], ['progress', 'In progress'], ['done', 'Done']].map(([k, l]) => `<button aria-selected="${ui.teamTab === k}" data-action="team-tab" data-v="${k}">${l}</button>`).join('')}</div>
      ${list.length ? list.map((w) => { const r = repo.getReport(w.reportRef); return `<a class="card card-hover stack-sm" href="#/team/${w.id}">
        <div class="row between"><b class="tnum">${w.id}</b><span class="priority ${w.priority}">${w.priority}</span></div>
        <div class="row gap-12">${CatIcon(r.category, 40)}<div class="grow"><b class="small">${esc(r.title)}</b><div class="xs muted">${esc(r.street)}, ${communityName(r.community)}</div></div></div>
        <div class="row between xs muted"><span>${icon('calendar', 13).replace('class="ic', 'style="display:inline;vertical-align:-2px" class="ic')} ${fmtDate(w.start)} → ${fmtDate(w.target)}</span><span>${w.progress}%</span></div>
        <div class="mini-progress"><span class="on" style="flex:${w.progress}"></span><span style="flex:${100 - w.progress}"></span></div></a>`; }).join('') : EmptyState('No jobs here', 'New jobs appear when an officer approves work.')}
    </div>`, 'Contractor / maintenance team app');
}

export function teamJob(id) {
  const w = repo.getWorkOrder(id); if (!w) return frame(EmptyState('Not found', ''), 'Field team');
  const r = repo.getReport(w.reportRef); const c = CONTRACTORS.find((x) => x.id === w.contractor);
  const nextStage = PROGRESS_STAGES.find((s) => s.pct > w.progress);
  return frame(`<header class="topbar"><a class="icon-btn" href="#/team" aria-label="Back">${icon('chevronL', 20)}</a><h1 class="grow" style="font-size:17px">${w.id}</h1><span class="tag">${w.status.replace('_', ' ')}</span></header>
    <div class="screen stack">
      <div style="border-radius:16px;overflow:hidden;height:170px">${media(photoFor(r))}</div>
      <div><h2>${esc(r.title)}</h2><p class="small muted row" style="margin-top:4px">${icon('pin', 14)}${esc(r.street)}, ${communityName(r.community)}</p></div>
      <div class="card stack-sm"><span class="label">Scope</span><p class="small">${esc(w.scope)}</p><dl class="kv"><dt>Team</dt><dd>${c.name}</dd><dt>Start</dt><dd>${fmtDate(w.start)}</dd><dt>Target</dt><dd>${fmtDate(w.target)}</dd></dl>
        ${r.inspection?.findings ? `<div class="note xs"><b>Inspector:</b> ${esc(r.inspection.findings)}</div>` : ''}</div>
      <button class="btn btn-secondary btn-block" data-action="toast" data-msg="Opening directions…">${icon('nav', 18)}Directions</button>
      ${w.status === 'scheduled' ? `<button class="btn btn-primary btn-block big-action" data-action="team-start" data-id="${id}">${icon('play', 20)}Start job</button><p class="xs faint" style="text-align:center">Citizens following this issue will see “Work has started”.</p>` : ''}
      ${w.status === 'in_progress' ? `
        <div class="card stack"><div class="row between"><b>Progress</b><span class="small muted">${w.progress}%</span></div><div class="mini-progress" style="height:10px"><span class="on" style="flex:${w.progress}"></span><span style="flex:${100 - w.progress}"></span></div>
          <div class="chips">${PROGRESS_STAGES.slice(1).map((s) => `<button class="chip" aria-pressed="${w.progress >= s.pct}" data-action="team-progress" data-id="${id}" data-v="${s.key}" ${w.progress >= s.pct ? 'disabled' : ''}>${s.label}</button>`).join('')}</div>
          <p class="xs faint">Pick the stage that best describes the work. Exact percentages aren’t required.</p></div>
        <div class="up-grid"><button class="up-tile" data-action="toast" data-msg="Progress photo uploaded">${icon('camera', 22)}Progress photo</button><button class="up-tile" data-action="team-delay" data-id="${id}">${icon('alert', 22)}Blocker / extension</button></div>
        <button class="btn btn-primary btn-block big-action" data-action="team-complete" data-id="${id}">${icon('check', 20)}Mark work completed</button>` : ''}
      ${w.status === 'completed' ? `<div class="banner banner-info">${icon('check', 20)}<div><b>Completed ${fmtDate(w.actual)}</b><p class="small">Residents are now being asked to confirm the fix.</p></div></div>` : ''}
      ${w.updates.length ? `<div class="card stack-sm"><b>Updates</b>${w.updates.map((u) => `<div class="row small"><span class="faint xs" style="width:52px">${fmtDate(u.at)}</span><span class="grow">${esc(u.note)}</span></div>`).join('')}</div>` : ''}
    </div>`, 'Contractor / maintenance team app');
}

// ---------- Actions ----------
export const actions = {
  'ins-tab': (el) => { ui.inspectorTab = el.dataset.v; rerender(); },
  'ins-start': (el) => { repo.startInspection(el.dataset.ref, '6.4968° N, 3.3541° E ±8 m'); toast('Inspection started · GPS and time recorded', 'target'); rerender(); },
  'ins-photo': (el) => { ui.inspection[el.dataset.ref].photos++; toast('Photo saved with GPS + timestamp', 'camera'); rerender(); },
  'ins-set': (el) => { const s = ui.inspection[el.dataset.ref]; s[el.dataset.k] = el.dataset.v === 'true' ? true : el.dataset.v === 'false' ? false : el.dataset.v; if (s.confirmed === false) s.outcome = 'none'; rerender(); },
  'ins-select': (el) => { ui.inspection[el.dataset.ref][el.dataset.k] = el.value; },
  'ins-submit': (el) => {
    const s = ui.inspection[el.dataset.ref];
    if (!s.notes.trim()) { toast('Add a short finding before submitting', 'alert'); document.querySelector('[data-insbind="notes"]')?.focus(); return; }
    repo.submitInspection(el.dataset.ref, { outcome: s.confirmed === false ? 'none' : s.outcome, findings: s.notes, assessedSeverity: s.severity, scope: s.scope, photos: Array(s.photos).fill(1) });
    toast('Inspection submitted · officer notified'); go('#/inspector');
  },
  'team-tab': (el) => { ui.teamTab = el.dataset.v; rerender(); },
  'team-start': (el) => { repo.startWork(el.dataset.id); toast('Job started · residents notified'); rerender(); },
  'team-progress': (el) => { const st = PROGRESS_STAGES.find((s) => s.key === el.dataset.v); repo.progressUpdate(el.dataset.id, el.dataset.v, `${st.label}.`); toast('Progress shared'); rerender(); },
  'team-delay': (el) => openModal(Modal(`<form class="stack" data-action="team-delay-submit" data-id="${el.dataset.id}"><h2>Report a blocker</h2>
    <div class="field"><label>Reason (shown to citizens)</label><select class="select" name="reason">${['Work rescheduled due to heavy rainfall.', 'Replacement materials are being procured.', 'Further engineering assessment is required.', 'Site access blocked by traffic management.'].map((x) => `<option>${x}</option>`).join('')}</select></div>
    <div class="field"><label>New target date</label><input class="input" type="date" name="date" value="${isoInDays(5)}" required></div>
    <div class="row" style="justify-content:flex-end"><button type="button" class="btn btn-ghost" data-action="close-modal">Cancel</button><button class="btn btn-primary">Request extension</button></div></form>`)),
  'team-delay-submit': (el, e) => { e.preventDefault(); const f = formData(el); repo.reportDelay(el.dataset.id, new Date(f.date + 'T17:00').toISOString(), f.reason); closeModal(); toast('Delay shared with original and new dates', 'clock'); rerender(); },
  'team-complete': (el) => openModal(Modal(`<form class="stack" data-action="team-complete-submit" data-id="${el.dataset.id}"><h2>Mark work completed</h2><p class="small muted">Completion needs photo evidence and a short note.</p>
    <label class="up-tile big" style="cursor:pointer"><input type="checkbox" name="photo" required style="position:absolute;opacity:0">${icon('camera', 28)}Tap to add completion photo<span class="xs">(required)</span></label>
    <div class="field"><label>Completion note</label><textarea class="textarea" name="note" required>Potholes excavated, base compacted and resurfaced. Drain desilted.</textarea></div>
    <div class="field"><label>Date completed</label><input class="input" type="date" name="date" value="${isoInDays(0)}" required></div>
    <div class="row" style="justify-content:flex-end"><button type="button" class="btn btn-ghost" data-action="close-modal">Cancel</button><button class="btn btn-primary">Submit completion</button></div></form>`)),
  'team-complete-submit': (el, e) => { e.preventDefault(); repo.completeWork(el.dataset.id, formData(el).note); closeModal(); toast('Completed · residents asked to confirm the fix', 'sparkle'); rerender(); },
};
