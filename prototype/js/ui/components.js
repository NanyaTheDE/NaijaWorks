// Reusable civic components. Each returns an HTML string; behaviour is wired via data-action delegation in app.js.
import { icon } from './icons.js';
import { scene } from './scenes.js';
import { STATUS, GROUPS, JOURNEY, journeyIndex, SEVERITY } from '../domain/statuses.js';
import { categoryByKey } from '../domain/categories.js';
import { AGENCIES } from '../domain/routing.js';
import { fmtDate, COMMUNITIES } from '../api/repo.js';

export const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const statusColor = (s) => GROUPS[STATUS[s]?.group || 'new'].color;
export const communityName = (slug) => COMMUNITIES.find((c) => c.slug === slug)?.name || slug;

export function timeAgo(iso) {
  const s = (Date.now() - new Date(iso)) / 1000;
  if (s < 60) return 'just now'; if (s < 3600) return `${Math.floor(s / 60)}m ago`; if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  const d = Math.floor(s / 86400); if (d < 7) return `${d}d ago`; return fmtDate(iso);
}

export const StatusBadge = (s, size = '') => `<span class="status ${size ? 'status-' + size : ''}" style="--c:${statusColor(s)}">${icon(STATUS[s].icon, 14)}${STATUS[s].label}</span>`;
export const SeverityBadge = (s) => s ? `<span class="sev sev-${s}">${SEVERITY[s].label}</span>` : '';
export const CatIcon = (key, size = 26) => { const c = categoryByKey(key); return `<span class="cat-ic" style="background:${c.hue};width:${size}px;height:${size}px">${icon(c.icon, size * 0.58)}</span>`; };
export const AuthorityTag = (id) => `<span class="tag">${icon('building', 13)}${esc(AGENCIES[id]?.short || 'Routing…')}</span>`;
export const photoFor = (r, phase = 'before') => r.photos.find((p) => p.phase === phase) || r.photos[0] || { scene: categoryByKey(r.category).key };
// Renders an uploaded photo (src) or the illustrated placeholder (scene).
export const media = (p, label) => p?.src ? `<img src="${p.src}" alt="${esc(label || 'Evidence photo')}" style="width:100%;height:100%;object-fit:cover;display:block">` : scene(p?.scene || p || 'road', { label });

export function MiniProgress(status) {
  const i = Math.max(0, journeyIndex(status));
  return `<div class="mini-progress" style="--c:${statusColor(status)}" aria-label="Step ${i + 1} of ${JOURNEY.length}">${JOURNEY.map((_, k) => `<span class="${k <= i ? 'on' : ''}"></span>`).join('')}</div>`;
}

export function ReportRow(r, { showAuthority = true } = {}) {
  const last = r.timeline.at(-1);
  return `<a class="card card-flush card-hover rcard" href="#/issue/${r.ref}">
    <div class="thumb">${media(photoFor(r))}${CatIcon(r.category)}</div>
    <div class="grow col gap-4">
      <div class="row between">${StatusBadge(r.status)}<span class="xs faint">${timeAgo(last.at)}</span></div>
      <h3>${esc(r.title)}</h3>
      <div class="xs muted row gap-4">${icon('pin', 13)}<span class="ellipsis">${esc(r.street)}, ${communityName(r.community)}</span></div>
      <div class="xs muted ellipsis">${icon('clock', 12).replace('class="ic', 'style="display:inline;vertical-align:-2px;margin-right:4px" class="ic')}${esc(last.title)}</div>
      ${MiniProgress(r.status)}
    </div>
  </a>`;
}

export function FeedCard(r) {
  const c = categoryByKey(r.category);
  return `<a class="card card-flush card-hover feedcard" href="#/issue/${r.ref}">
    <div class="media">${media(photoFor(r, ['completed', 'monitoring'].includes(r.status) ? 'after' : 'before'))}${StatusBadge(r.status)}</div>
    <div style="padding:12px 14px 14px" class="stack-sm">
      <div class="row xs muted" style="font-weight:600">${icon(c.icon, 14)}${c.label} · ${esc(r.street)}</div>
      <h3 class="ellipsis">${esc(r.title)}</h3>
      <div class="row between xs muted"><span>${icon('users', 13).replace('class="ic', 'style="display:inline;vertical-align:-2px" class="ic')} ${r.affected} affected</span><span>${timeAgo(r.timeline.at(-1).at)}</span></div>
    </div>
  </a>`;
}

export function ProgressTracker(r) {
  const idx = journeyIndex(r.status);
  const at = (s) => [...r.timeline].reverse().find((t) => t.status === s)?.at;
  const steps = ['reported', 'verified', 'assigned', 'inspection_scheduled', 'inspected', 'work_planned', 'scheduled', 'in_progress', 'completed'];
  return `<ol class="vtrack">${steps.map((s) => {
    const k = JOURNEY.indexOf(s); const state = k < idx || (k === idx && ['completed', 'monitoring'].includes(r.status)) ? 'done' : k === idx ? 'now' : 'todo';
    const label = s === 'work_planned' ? 'Repair approved' : s === 'scheduled' ? 'Repair scheduled' : STATUS[s].label;
    const when = at(s);
    return `<li class="${state}"><span class="node">${state === 'done' ? icon('check', 14) : state === 'now' ? icon(STATUS[s].icon, 14) : ''}</span>
      <div><div class="t">${label}</div>${state === 'now' ? `<div class="xs muted">${STATUS[s].meaning}</div>` : ''}</div>
      <div class="xs faint tnum" style="padding-top:4px">${when ? fmtDate(when) : state === 'now' ? 'Now' : ''}</div></li>`;
  }).join('')}</ol>`;
}

export function Timeline(items, { delay } = {}) {
  const list = [...items].reverse();
  return `<ol class="timeline">${list.map((t, i) => {
    const d = new Date(t.at);
    const isDelay = t.title.toLowerCase().startsWith('delay');
    return `<li class="${i === 0 ? 'latest' : ''}">
      <div class="date"><b>${d.getDate()}</b>${d.toLocaleDateString('en-NG', { month: 'short' })}</div>
      <span class="dot" style="--c:${isDelay ? 'var(--sun)' : statusColor(t.status)}"></span>
      <div><div class="title">${esc(t.title)}</div>${t.body ? `<p class="small muted" style="margin-top:2px">${esc(t.body)}</p>` : ''}
        ${isDelay && delay ? `<div class="delay-box"><div class="row between"><span>Original date</span><s>${fmtDate(delay.original)}</s></div><div class="row between"><span>Updated date</span><b>${fmtDate(delay.updated)}</b></div></div>` : ''}
        <div class="actor">${icon('building', 12)}${esc(t.actor)} · ${d.toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' })}</div></div>
    </li>`;
  }).join('')}</ol>`;
}

export function BeforeAfter(beforeScene, afterScene, id = 'ba') {
  return `<div class="ba" id="${id}" style="--pos:50%">
    <div class="layer">${scene(beforeScene, { label: 'Before' })}</div>
    <div class="layer after">${scene(afterScene, { label: 'After' })}</div>
    <span class="lbl" style="left:10px">Before</span><span class="lbl" style="right:10px">After</span>
    <div class="handle"></div>
    <input type="range" min="0" max="100" value="50" aria-label="Compare before and after" data-ba="${id}">
  </div>`;
}

// Stylised map (offline). Positions are 0–100 % of the map box. A real MapView adapter (Leaflet/Mapbox) would replace the base layer.
export function MapBase() {
  return `<svg class="base" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <rect width="100" height="100" fill="currentColor" opacity="0"/>
    <path d="M78 0 C70 20 88 40 80 62 C74 78 90 90 86 100 L100 100 L100 0Z" fill="#A8D3E6" opacity=".85"/>
    <path d="M0 88 C20 84 40 92 60 88 C70 86 78 92 86 100 L0 100Z" fill="#A8D3E6" opacity=".85"/>
    <g fill="#CFE5C3" opacity=".9"><rect x="20" y="30" width="9" height="7" rx="1.5"/><rect x="58" y="62" width="7" height="9" rx="1.5"/><rect x="8" y="64" width="10" height="6" rx="1.5"/></g>
    <g stroke="#fff" stroke-linecap="round" fill="none">
      <path d="M-2 40 C30 44 60 30 102 36" stroke-width="2.6"/><path d="M40 -2 C42 30 52 60 46 102" stroke-width="2.6"/><path d="M-2 72 C30 70 60 76 80 70" stroke-width="2"/>
      <path d="M14 -2 C18 40 10 70 18 102" stroke-width="1.6"/><path d="M62 -2 C64 30 70 60 64 90" stroke-width="2"/>
      <path d="M-2 18 L80 12" stroke-width="1.6"/><path d="M-2 56 L76 52" stroke-width="1.3"/><path d="M24 30 L30 90" stroke-width="1"/><path d="M52 10 L56 80" stroke-width="1"/>
    </g>
    <g stroke="#F3D58A" stroke-width=".9" fill="none"><path d="M-2 40 C30 44 60 30 102 36"/><path d="M40 -2 C42 30 52 60 46 102"/></g>
  </svg>`;
}
export function MapPin(r, sel) {
  const g = STATUS[r.status].group;
  return `<button class="pin ${sel ? 'sel' : ''} ${r.urgent && !['completed', 'monitoring'].includes(r.status) ? 'urgent' : ''}" style="left:${r.pos.x}%;top:${r.pos.y}%;--c:${GROUPS[g].color}" data-action="map-select" data-ref="${r.ref}" aria-label="${esc(r.title)}, ${STATUS[r.status].label}">
    <span class="head">${icon(categoryByKey(r.category).icon, 15)}</span></button>`;
}

export function EmptyState(title, body, cta = '') {
  return `<div class="empty">
    <svg class="art" viewBox="0 0 120 100" aria-hidden="true"><circle cx="60" cy="54" r="40" fill="var(--brand-soft)"/><path d="M30 74 Q60 56 90 74" stroke="var(--brand)" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="60" cy="40" r="12" fill="var(--sun)"/><path d="M60 20v-8M60 68v0M40 40h-8M88 40h-8M46 26l-5-5M74 26l5-5" stroke="var(--sun)" stroke-width="3" stroke-linecap="round"/></svg>
    <h3>${title}</h3><p class="small muted" style="max-width:280px">${body}</p>${cta}</div>`;
}

export const Skeleton = (n = 3) => Array.from({ length: n }, () => `<div class="card rcard"><div class="sk" style="width:84px;height:84px"></div><div class="grow stack-sm"><div class="sk" style="height:14px;width:40%"></div><div class="sk" style="height:16px"></div><div class="sk" style="height:12px;width:70%"></div></div></div>`).join('');

export function ProjectCard(p) {
  const pct = Math.round((p.stage / (p.milestones.length - 1)) * 100);
  return `<a class="card card-hover stack-sm" href="#/projects/${p.id}" style="width:280px">
    <div class="row between"><span class="tag">${icon('crane', 13)}Project</span>${p.stalled ? '<span class="sev sev-serious">Behind schedule</span>' : `<span class="xs faint">${pct}%</span>`}</div>
    <h3>${esc(p.name)}</h3>
    <p class="xs muted">${esc(p.milestones[p.stage])} · ${AGENCIES[p.agency].short}</p>
    <div class="mini-progress">${p.milestones.map((_, i) => `<span class="${i <= p.stage ? 'on' : ''}"></span>`).join('')}</div>
  </a>`;
}

export function AnnouncementCard(a) {
  return `<div class="insight"><span class="ii" style="background:var(--sun-soft);color:#8A6400">${icon('megaphone', 19)}</span>
    <div class="grow"><div class="xs faint" style="font-weight:650">${esc(a.kind)} · ${AGENCIES[a.agency].short}</div><div style="font-weight:650;margin:2px 0">${esc(a.title)}</div><p class="small muted">${esc(a.body)}</p></div></div>`;
}

export function Modal(inner) { return `<div class="overlay" data-action="close-modal-bg"><div class="modal" role="dialog" aria-modal="true"><div class="grab"></div>${inner}</div></div>`; }

// Status hero: delivery-tracking style summary (big date headline, on-track pill, 5-stop icon tracker, one next-step line).
// Pattern references: Talabat, Keeta, Walmart order tracking (see docs/05-mobbin-research.md).
// third value = journey index at which the stop counts as done
const STOPS = [['Reported', 'flag', 0], ['Verified', 'check', 1], ['Inspected', 'clipboard', 4], ['Repair', 'hammer', 8], ['Fixed', 'sparkle', 8]];
export function StatusHero(r) {
  const idx = journeyIndex(r.status); const st = STATUS[r.status];
  const done = ['completed', 'monitoring'].includes(r.status);
  const day = (iso, wd) => fmtDate(iso, wd ? { weekday: 'short', day: 'numeric', month: 'short' } : { day: 'numeric', month: 'short' });
  let kicker = 'NEXT STEP', head = st.next;
  if (done) { kicker = r.status === 'monitoring' ? 'FIXED · CONFIRMED BY RESIDENTS' : 'FIXED'; head = `Fixed ${day(r.completion?.at || r.timeline.at(-1).at)}`; }
  else if (r.status === 'inspection_scheduled' && r.inspection) { kicker = 'INSPECTION'; head = `${day(r.inspection.date, true)}`; }
  else if (r.eta) { kicker = r.status === 'in_progress' ? 'REPAIR EXPECTED BY' : 'WORK DUE BY'; head = day(r.eta, true); }
  else if (r.status === 'reopened') { kicker = 'BACK UNDER REVIEW'; head = 'Re-inspection next'; }
  const pill = done ? ['Fixed', 'var(--st-done)'] : r.delay ? ['Delayed', 'var(--st-planned)'] : r.urgent ? ['Urgent', 'var(--clay)'] : ['On track', 'var(--st-done)'];
  // current stop = first stop not yet done (the stage in progress)
  const cur = done ? 5 : STOPS.findIndex(([, , at]) => idx < at);
  const sentence = done ? 'The team shared completion photos. Tell us if it’s really fixed.'
    : r.status === 'in_progress' ? `${r.progress >= 75 ? 'Nearly done' : r.progress >= 50 ? 'About halfway' : 'Work has started'} · ${st.who} on site.`
    : `${st.meaning} ${st.who === 'NaijaWorks' ? '' : 'Who acts: ' + st.who + '.'}`;
  return `<section class="track-hero" aria-label="Current status">
    <div class="row between"><span class="xs faint" style="font-weight:700;letter-spacing:.05em">${kicker}</span><span class="pill" style="--c:${pill[1]}">${pill[0]}</span></div>
    <div class="big ${head.length > 20 ? 'big-sm' : ''}">${esc(head)}</div>
    <div class="stops" role="list">${STOPS.map(([label, ic], k) => `${k ? `<span class="ln ${k < cur ? 'done' : k === cur ? 'half' : ''}"></span>` : ''}<span role="listitem" aria-label="${label}${k < cur ? ', done' : k === cur ? ', in progress' : ''}" class="stop ${k < cur ? 'done' : k === cur ? 'now' : ''}">${icon(k < cur ? 'check' : ic, 15)}</span>`).join('')}</div>
    <div class="stop-labels">${STOPS.map(([label], k) => `<span class="${k === cur ? 'on' : ''}">${label}</span>`).join('')}</div>
    <p class="small" style="margin-top:12px">${StatusBadge(r.status)} <span class="muted">${esc(sentence)}</span></p>
    ${r.delay && !done ? `<div class="delay-box"><b>Rescheduled:</b> ${esc(r.delay.reason)}<div class="row between" style="margin-top:6px"><span>Original date</span><s>${fmtDate(r.delay.original)}</s></div><div class="row between"><span>New date</span><b>${fmtDate(r.delay.updated)}</b></div></div>` : ''}
  </section>`;
}
