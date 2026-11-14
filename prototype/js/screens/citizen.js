// Citizen app screens (mobile-first).
import { repo, fmtDate, COMMUNITIES, PEOPLE } from '../api/repo.js';
import { ui, go, rerender, toast, confetti, openModal, closeModal } from '../ctx.js';
import { icon } from '../ui/icons.js';
import { scene } from '../ui/scenes.js';
import { t, LOCALES } from '../i18n.js';
import { CATEGORIES, categoryByKey, URGENT_SUBTYPES } from '../domain/categories.js';
import { STATUS, GROUPS, SEVERITY } from '../domain/statuses.js';
import { AGENCIES, LEVEL_EXPLAINER, routeReport, assignmentState } from '../domain/routing.js';
import { esc, StatusBadge, SeverityBadge, ReportRow, FeedCard, ProgressTracker, Timeline, BeforeAfter, MapBase, MapPin, EmptyState,
  ProjectCard, AnnouncementCard, AuthorityTag, CatIcon, StatusHero, communityName, timeAgo, photoFor, media, Modal, statusColor } from '../ui/components.js';

// Known streets for pin → address lookup (mock geocoder).
const STREETS = [
  { name: 'Adeola Street', c: 'surulere', x: 44, y: 61 }, { name: 'Bode Thomas Street', c: 'surulere', x: 50, y: 54 }, { name: 'Ogunlana Drive', c: 'surulere', x: 38, y: 66 },
  { name: 'Akerele Street', c: 'surulere', x: 54, y: 63 }, { name: 'Lawanson Road', c: 'surulere', x: 33, y: 55 }, { name: 'Masha Road', c: 'surulere', x: 57, y: 50 },
  { name: 'Iponri Market Road', c: 'surulere', x: 62, y: 70 }, { name: 'Aguda Road', c: 'surulere', x: 28, y: 48 }, { name: 'Funsho Williams Avenue', c: 'surulere', x: 46, y: 75 },
  { name: 'Herbert Macaulay Way', c: 'yaba', x: 66, y: 36 }, { name: 'Alagomeji Street', c: 'yaba', x: 70, y: 46 }, { name: 'Ikorodu Road', c: 'yaba', x: 56, y: 30 },
  { name: 'Allen Avenue', c: 'ikeja', x: 42, y: 22 }, { name: 'Opebi Road', c: 'ikeja', x: 48, y: 15 }, { name: 'Obafemi Awolowo Way', c: 'ikeja', x: 30, y: 12 },
];
const nearestStreet = (x, y) => STREETS.reduce((a, s) => (Math.hypot(s.x - x, s.y - y) < Math.hypot(a.x - x, a.y - y) ? s : a));
const OPEN = ['reported', 'under_review', 'verified', 'assigned', 'reopened'];
const fmtN = (n) => n.toLocaleString('en-NG');

// ---------- Shell ----------
export function shell(content, { nav, hideNav = false } = {}) {
  const unread = repo.unreadCount();
  const item = (key, href, ic, label) => `<a class="bn-item" href="${href}" ${nav === key ? 'aria-current="page"' : ''}>${icon(ic, 22)}<span>${label}</span>${key === 'mine' && unread ? '<span class="dot"></span>' : ''}</a>`;
  return `<div class="stage"><div class="phone"><div class="phone-scroll" id="scroller">${content}</div>
    ${hideNav ? '' : `<nav class="bottomnav" aria-label="Main">
      ${item('home', '#/', 'home', t('nav.home'))}${item('explore', '#/explore', 'map', t('nav.explore'))}
      <a class="bn-item bn-report" href="#/report" aria-label="${t('nav.report')}"><span class="fab">${icon('plus', 28)}</span><span>${t('nav.report')}</span></a>
      ${item('mine', '#/my-reports', 'list', t('nav.mine'))}${item('community', '#/community/' + repo.state.prefs.community, 'users', t('nav.community'))}
    </nav>`}</div>
    <aside class="stage-aside stack">${asideNote()}</aside></div>`;
}
const asideNote = () => `<div class="card stack-sm"><div class="row">${icon('info', 18)}<b>Citizen app preview</b></div>
  <p class="small muted">Mobile-first PWA. Use the role switcher to act as the government officer, inspector or field team, and watch the same report move through its journey.</p>
  <button class="btn btn-ghost btn-sm" data-action="reset">${icon('refresh', 16)}Reset demo data</button></div>`;

const back = (href = '#/', title = '', right = '') => `<header class="topbar"><a class="icon-btn" href="${href}" aria-label="Back">${icon('chevronL', 20)}</a><h1 class="grow ellipsis">${title}</h1>${right}</header>`;

// ---------- Onboarding ----------
export function onboarding() {
  const p = repo.state.prefs;
  return shell(`<div class="screen stack-lg" style="padding-top:28px">
    <div class="hero" style="padding:28px 22px 26px">
      <div class="row" style="gap:10px">${logo(36)}<b style="font:750 20px var(--display)">NaijaWorks</b></div>
      <h1 style="font-size:32px;margin-top:40px;color:#fff">See it. Report it.<br>Watch it get fixed.</h1>
      <p style="margin-top:10px;opacity:.9">Report bad roads, broken streetlights, blocked drains and more. We find who is responsible and show you every step until it is fixed.</p>
    </div>
    <div class="stack-sm">
      ${[['flag', 'Report in 2 minutes', 'Snap a photo, drop a pin, done. No forms.'], ['building', 'We find who handles it', 'Local, state, federal or utility — you don’t need to know.'], ['eye', 'Track every step', 'Like tracking a parcel: inspection, repair, completion.']]
        .map(([i, h, b]) => `<div class="insight"><span class="ii" style="background:var(--brand-soft);color:var(--brand)">${icon(i, 20)}</span><div><b>${h}</b><p class="small muted">${b}</p></div></div>`).join('')}
    </div>
    <div class="field"><span class="label">Language</span><div class="seg" role="tablist">${LOCALES.map((l) => `<button role="tab" aria-selected="${p.locale === l.key}" data-action="set-locale" data-v="${l.key}">${l.label}</button>`).join('')}</div></div>
    <div class="field"><label for="ob-comm">Your community</label><select id="ob-comm" class="select" data-action="set-community">${COMMUNITIES.map((c) => `<option value="${c.slug}" ${p.community === c.slug ? 'selected' : ''}>${c.name}, ${c.state}</option>`).join('')}</select></div>
    <button class="btn btn-primary btn-lg btn-block" data-action="finish-onboarding">Get started ${icon('arrowR', 18)}</button>
    <p class="xs faint" style="text-align:center;padding-bottom:12px">Your phone number and address are never shown publicly.</p>
  </div>`, { hideNav: true });
}
export const logo = (s = 32) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="12" fill="#F5B301"/><path d="M11 29V12l18 17V12" stroke="#063D27" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;

// ---------- Home ----------
export function home() {
  const p = repo.state.prefs; const comm = COMMUNITIES.find((c) => c.slug === p.community);
  const all = repo.listReports({ community: p.community });
  const by = (g) => all.filter((r) => STATUS[r.status].group === g);
  const fixed = all.filter((r) => ['completed', 'monitoring'].includes(r.status));
  const working = all.filter((r) => ['in_progress', 'scheduled', 'work_planned'].includes(r.status));
  const awaitingInsp = all.filter((r) => ['inspection_scheduled', 'assigned', 'verified'].includes(r.status));
  const mine = repo.myReports(); const myImpact = mine.reduce((a, r) => a + (r.peopleImpacted || 0), 0);
  const h = new Date().getHours(); const greet = t(h < 12 ? 'home.greet.morning' : h < 17 ? 'home.greet.afternoon' : 'home.greet.evening');
  const lanes = [['new', 'flag', 'Needs attention'], ['inspection', 'clipboard', 'Being inspected'], ['planned', 'calendar', 'Work scheduled'], ['active', 'hammer', 'Work in progress'], ['done', 'sparkle', 'Recently fixed']];
  const inProg = working.find((r) => r.status === 'in_progress');

  return shell(`
    <h1 class="sr-only">NaijaWorks home</h1>
    <header class="topbar" style="padding-top:18px">
      <div class="grow"><div class="small muted">${greet}, ${esc(repo.state.user.name)} 👋</div>
        <button class="row" data-action="pick-community" style="border:0;background:none;padding:0;gap:4px"><b style="font:750 20px var(--display)">${comm.name}</b><span class="muted">${comm.state}</span>${icon('chevronD', 16)}</button></div>
      <a class="icon-btn" href="#/notifications" aria-label="Notifications">${icon('bell', 20)}${repo.unreadCount() ? '<span class="badge-dot"></span>' : ''}</a>
      <a class="icon-btn" href="#/profile" aria-label="Profile" style="background:var(--brand-soft);color:var(--brand);font-weight:750">${esc(repo.state.user.name[0])}</a>
    </header>
    <div class="screen">
      <form class="search" data-action="search-submit"><label class="sr-only" for="hs">Search</label>${icon('search', 18)}<input id="hs" name="q" class="input" placeholder="${t('home.search')}"></form>

      <section class="hero" style="margin-top:14px">
        <h2 style="font-size:22px;color:#fff;max-width:250px">${t('home.hero.title')}</h2>
        <p class="small" style="opacity:.88;margin:8px 0 16px;max-width:290px">${t('home.hero.body')}</p>
        <a class="btn btn-primary btn-lg" href="#/report">${icon('camera', 20)}${t('home.cta')}</a>
        <svg width="120" height="120" viewBox="0 0 120 120" style="position:absolute;right:-14px;bottom:-12px;opacity:.95" aria-hidden="true"><circle cx="70" cy="70" r="46" fill="#F5B301" opacity=".18"/><path d="M50 98V58l20-16 20 16v40" fill="#F5B301" opacity=".9"/><rect x="62" y="74" width="16" height="24" rx="2" fill="#063D27"/><path d="M34 98h76" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="96" cy="36" r="6" fill="#fff"/></svg>
      </section>

      <div class="hscroll" style="margin-top:16px">${lanes.map(([g, ic, label]) => `
        <a class="lane card-hover" href="#/explore?group=${g}"><span class="chip-ic" style="background:color-mix(in srgb, ${GROUPS[g].color} 14%, transparent);color:${GROUPS[g].color}">${icon(ic, 18)}</span>
        <span class="num tnum">${by(g).length}</span><span class="xs muted" style="font-weight:600">${label}</span></a>`).join('')}</div>

      <div class="stack-sm" style="margin-top:16px">
        <div class="insight"><span class="ii" style="background:var(--brand-soft);color:var(--brand)">${icon('sparkle', 19)}</span><div><b>${fixed.length + 10} issues were resolved around ${comm.name} this month.</b><p class="small muted">Up from 7 last month.</p></div></div>
        ${inProg ? `<a class="insight card-hover" href="#/issue/${inProg.ref}"><span class="ii" style="background:color-mix(in srgb, var(--st-active) 14%, transparent);color:var(--st-active)">${icon('hammer', 19)}</span><div class="grow"><b>${categoryByKey(inProg.category).label} repairs are underway on ${esc(inProg.street)}.</b><p class="small muted">${esc(inProg.timeline.at(-1).body)}</p></div>${icon('chevronR', 18, 'faint')}</a>` : ''}
        ${awaitingInsp.length ? `<div class="insight"><span class="ii" style="background:color-mix(in srgb, var(--st-inspection) 14%, transparent);color:var(--st-inspection)">${icon('clipboard', 19)}</span><div><b>${awaitingInsp.length} problems near you are awaiting inspection.</b><p class="small muted">Follow them to get updates.</p></div></div>` : ''}
        ${myImpact ? `<a class="insight card-hover" href="#/my-reports"><span class="ii" style="background:var(--sun-soft);color:#8A6400">${icon('heart', 19)}</span><div class="grow"><b>Your reports helped ${fmtN(myImpact)} residents.</b><p class="small muted">${mine.filter((r) => ['completed', 'monitoring'].includes(r.status)).length} of your reports are now resolved.</p></div>${icon('chevronR', 18, 'faint')}</a>` : ''}
      </div>

      <div class="section-head"><h2>${t('home.near')}</h2><a class="link" href="#/explore">See map</a></div>
      ${all.length ? `<div class="stack-sm">${all.filter((r) => OPEN.includes(r.status) || r.status === 'inspection_scheduled').slice(0, 3).map((r) => ReportRow(r)).join('')}</div>`
        : EmptyState('Looks quiet around here', 'If you notice something that needs attention, you can report it in a few taps.', `<a class="btn btn-primary" href="#/report">${t('home.cta')}</a>`)}

      ${working.length ? `<div class="section-head"><h2>${t('home.work')}</h2><a class="link" href="#/explore?group=active">All</a></div><div class="hscroll">${working.map(FeedCard).join('')}</div>` : ''}

      ${fixed.length ? `<div class="section-head"><h2>${t('home.fixed')}</h2><a class="link" href="#/impact">Impact</a></div>
        <a class="card card-flush card-hover" href="#/issue/${fixed[0].ref}" style="display:block">${BeforeAfter(photoFor(fixed[0], 'before').scene, photoFor(fixed[0], 'after').scene, 'ba-home')}
        <div style="padding:12px 14px" class="row between"><div><b>${esc(fixed[0].title)}</b><div class="xs muted">${esc(fixed[0].street)} · fixed ${timeAgo(fixed[0].completion?.at || fixed[0].timeline.at(-1).at)}</div></div>${StatusBadge(fixed[0].status)}</div></a>` : ''}

      <div class="section-head"><h2>Projects nearby</h2><a class="link" href="#/community/${p.community}">All</a></div>
      <div class="hscroll">${repo.listProjects().map(ProjectCard).join('')}</div>

      <div class="section-head"><h2>${t('home.ann')}</h2></div>
      <div class="stack-sm">${repo.listAnnouncements(p.community).map(AnnouncementCard).join('') || '<p class="small muted">No announcements for your area.</p>'}</div>

      <div class="section-head"><h2>${t('home.tips')}</h2></div>
      <a class="card card-hover row gap-12" href="#/learn" style="background:var(--sun-soft);border-color:transparent">
        <span class="ii" style="width:44px;height:44px;border-radius:14px;background:var(--sun);color:#2A1E00;display:grid;place-items:center">${icon('book', 22)}</span>
        <div class="grow"><b>Who fixes what?</b><p class="small muted">Local streets, state roads, waste, water, electricity — a 1-minute guide.</p></div>${icon('chevronR', 18)}</a>
      <div style="height:24px"></div>
    </div>`, { nav: 'home' });
}

// ---------- Report flow ----------
const newDraft = () => ({ category: null, subtype: null, photos: [], pos: null, street: '', landmark: '', community: repo.state.prefs.community, title: '', description: '', answers: {}, severity: null, identity: repo.state.prefs.identity });
export function report() {
  if (!ui.draft) { ui.draft = repo.state.drafts || newDraft(); ui.reportStep = 0; ui.dupDismissed = false; }
  const d = ui.draft; const s = ui.reportStep;
  const titles = [t('report.step1'), t('report.step2'), t('report.step3'), t('report.step4'), t('report.step5')];
  const canNext = [!!d.category, true, !!d.street, !!d.severity && (d.title || d.description), true][s];
  const body = [stepCategory, stepEvidence, stepLocation, stepDetails, stepReview][s](d);
  return shell(`
    <header class="topbar" style="flex-direction:column;align-items:stretch;gap:12px">
      <div class="row"><button class="icon-btn" data-action="${s ? 'step-back' : 'exit-report'}" aria-label="${s ? 'Previous step' : 'Close'}">${icon(s ? 'chevronL' : 'x', 20)}</button>
        <div class="grow" style="text-align:center"><div class="xs faint" style="font-weight:700">STEP ${s + 1} OF 5</div></div>
        <button class="btn btn-ghost btn-sm" data-action="save-draft">Save draft</button></div>
      <div class="steps">${titles.map((_, i) => `<span class="${i <= s ? 'on' : ''}"></span>`).join('')}</div>
    </header>
    <div class="screen stack" style="padding-bottom:100px"><h1 style="font-size:26px;margin-top:4px">${titles[s]}</h1>${body}</div>
    <div class="sticky-cta">${s < 4 ? `<button class="btn btn-primary btn-lg btn-block" data-action="step-next" ${canNext ? '' : 'disabled'}>${s === 1 && !d.photos.length ? t('report.skip') : t('report.continue')} ${icon('arrowR', 18)}</button>`
      : `<button class="btn btn-primary btn-lg btn-block" data-action="submit-report">${icon('check', 20)}${t('report.submit')}</button>`}</div>`, { hideNav: true });
}

function emergencyBanner() {
  return `<div class="banner banner-urgent" role="alert">${icon('alert', 22)}<div><b>If someone's life is in immediate danger, call 112 first.</b>
    <p class="small">You can still report it here. A government team will check how urgent it is.</p>
    <a class="btn btn-danger btn-sm" href="tel:112" style="margin-top:8px">${icon('phone', 15)}Call 112</a></div></div>`;
}

function stepCategory(d) {
  const cat = d.category && categoryByKey(d.category);
  return `<p class="muted">Pick the closest match. You don’t need to know who handles it.</p>
    <div class="cat-grid">${CATEGORIES.map((c) => `<button class="cat-tile" aria-pressed="${d.category === c.key}" data-action="pick-cat" data-v="${c.key}">
      <span class="ci" style="background:color-mix(in srgb, ${c.hue} 16%, transparent);color:${c.hue}">${icon(c.icon, 24)}</span>${c.label}</button>`).join('')}</div>
    ${cat ? `<div class="card stack-sm"><span class="label">What kind of ${cat.label.toLowerCase()} problem?</span><div class="chips">${cat.subtypes.map((st) => `<button class="chip" aria-pressed="${d.subtype === st}" data-action="pick-sub" data-v="${st}">${st}</button>`).join('')}</div></div>` : ''}
    ${URGENT_SUBTYPES.includes(d.subtype) ? emergencyBanner() : ''}
    ${d.category === 'abandoned' ? `<div class="banner banner-info">${icon('crane', 20)}<p class="small">For stalled projects, tell us the project name if you know it, how long work has stopped, and how it affects your community.</p></div>` : ''}`;
}

function stepEvidence(d) {
  const low = repo.state.prefs.lowData;
  return `<p class="muted">A clear photo helps the team understand the problem faster. It is optional.</p>
    <input type="file" id="file-in" accept="image/*" capture="environment" hidden data-action="file-picked" multiple>
    <div class="up-grid">
      <button class="up-tile big" data-action="pick-file">${icon('camera', 30)}Take a photo<span class="xs" style="font-weight:500;opacity:.8">or choose from gallery</span></button>
      <button class="up-tile" data-action="add-sample-photo">${icon('image', 22)}Use sample photo</button>
      <button class="up-tile" data-action="add-media" data-v="video">${icon('video', 22)}Short video</button>
      <button class="up-tile" data-action="add-media" data-v="voice" style="grid-column:span 2;min-height:64px;flex-direction:row">${icon('mic', 20)}Record a voice note instead of typing</button>
    </div>
    ${d.photos.length ? `<div class="stack-sm"><span class="label">${d.photos.length} attached</span><div class="thumbs">${d.photos.map((p, i) => `<div class="t">${p.kind === 'voice' ? `<div style="height:100%;display:grid;place-items:center;background:var(--brand-soft);color:var(--brand)">${icon('mic', 24)}</div>` : p.kind === 'video' ? `<div style="height:100%;display:grid;place-items:center;background:var(--ink);color:#fff">${icon('play', 22)}</div>` : media(p)}<button data-action="rm-photo" data-i="${i}" aria-label="Remove">${icon('x', 12)}</button></div>`).join('')}</div></div>` : ''}
    <div class="banner banner-sun">${icon('info', 18)}<p class="small"><b>Tips:</b> stand back so we can see the surroundings, include a landmark, and don’t photograph people’s faces. ${low ? 'Low-data mode: photos are compressed to under 200 KB.' : ''}</p></div>`;
}

function stepLocation(d) {
  const dups = d.street && !ui.dupDismissed ? repo.findDuplicates({ category: d.category, community: d.community, street: d.street }) : [];
  const comm = COMMUNITIES.find((c) => c.slug === d.community);
  return `<div class="map" style="height:240px" data-action="map-click" role="application" aria-label="Map. Tap to place the pin.">${MapBase()}
      ${d.pos ? `<div class="pin sel" style="left:${d.pos.x}%;top:${d.pos.y}%;--c:var(--clay);pointer-events:none"><span class="head">${icon('pin', 15)}</span></div>` : `<div class="mypos" style="left:44%;top:61%"></div>`}
      <div class="map-sheet row" style="justify-content:flex-end"><button class="btn btn-secondary btn-sm" data-action="use-gps" style="box-shadow:var(--shadow)">${icon('target', 16)}Use my location</button></div>
    </div>
    <p class="xs faint" style="text-align:center">Tap the map to drop a pin, or search below.</p>
    ${d.street ? `<div class="card row gap-12"><span class="ii" style="width:40px;height:40px;border-radius:12px;background:var(--clay-soft);color:var(--clay);display:grid;place-items:center">${icon('pin', 20)}</span>
      <div class="grow"><b>${esc(d.street)}</b><div class="xs muted">${comm.name} · ${comm.lgaName} · ${comm.state} State</div></div>${icon('check', 20, 'brand')}</div>` : ''}
    <div class="field"><label for="street">Street or area</label><input id="street" class="input" list="streets" value="${esc(d.street)}" data-bind="street" placeholder="e.g. Adeola Street"><datalist id="streets">${STREETS.map((s) => `<option value="${s.name}">`).join('')}</datalist></div>
    <div class="field"><label for="lm">Nearby landmark <span class="faint">(optional)</span></label><input id="lm" class="input" value="${esc(d.landmark)}" data-bind="landmark" placeholder="e.g. Opposite the church, near the bus stop"></div>
    <div class="row gap-12"><div class="field grow"><label for="cm">Community</label><select id="cm" class="select" data-bind="community">${COMMUNITIES.map((c) => `<option value="${c.slug}" ${d.community === c.slug ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div>
      <div class="field grow"><span class="label">LGA · State</span><div class="input muted" style="display:flex;align-items:center">${comm.lgaName.replace(' LGA', '').replace(' LCDA', '')} · Lagos</div></div></div>
    ${dups.length ? `<div class="card stack" style="border-color:color-mix(in srgb, var(--sun) 60%, var(--line));background:color-mix(in srgb, var(--sun) 7%, var(--surface))">
      <div class="row">${icon('layers', 20)}<b>This issue may already have been reported</b></div>
      ${dups.map((r) => `<div class="stack-sm">${ReportRow(r)}<div class="xs muted">${r.affected} people have confirmed this issue.</div>
        <div class="chips"><button class="chip" data-action="dup-affected" data-ref="${r.ref}">${icon('hand', 15)}Yes, I'm affected too</button><a class="chip" href="#/issue/${r.ref}">${icon('camera', 15)}Add photo or info</a><button class="chip" data-action="dup-follow" data-ref="${r.ref}">${icon('bell', 15)}Follow</button></div></div>`).join('')}
      <button class="btn btn-ghost btn-sm" data-action="dup-different">This is a different problem — continue my report</button></div>` : ''}`;
}

function stepDetails(d) {
  const q = (key, label, opts) => `<div class="stack-sm"><span class="label">${label}</span><div class="chips">${opts.map((o) => `<button class="chip" aria-pressed="${d.answers[key] === o}" data-action="answer" data-k="${key}" data-v="${o}">${o}</button>`).join('')}</div></div>`;
  return `<p class="muted">A few words is enough. Plain language is perfect.</p>
    <div class="field"><label for="ttl">Short title</label><input id="ttl" class="input" data-bind="title" maxlength="80" value="${esc(d.title)}" placeholder="e.g. Deep pothole at the junction"></div>
    <div class="field"><div class="row between"><label for="desc">What’s happening?</label><button class="btn btn-soft btn-sm" data-action="ai-describe">${icon('sparkle', 15)}Help me describe</button></div>
      <textarea id="desc" class="textarea" data-bind="description" placeholder="What you see, and how it affects people">${esc(d.description)}</textarea></div>
    ${q('duration', 'How long has this been happening?', ['Today', 'Days', 'Weeks', 'Months', 'Over a year'])}
    ${q('access', 'Is it blocking homes, shops or roads?', ['Yes', 'Partly', 'No'])}
    ${q('safety', 'Is there an immediate safety risk?', ['Yes', 'Not sure', 'No'])}
    <div class="stack-sm"><span class="label">How serious is it?</span>
      ${Object.entries(SEVERITY).map(([k, v]) => `<button class="radio-card" role="radio" aria-checked="${d.severity === k}" data-action="pick-sev" data-v="${k}"><span class="ring"></span><div class="grow"><b>${v.label}</b><div class="xs muted">${{ low: 'Annoying, but not dangerous', moderate: 'Affects daily life', serious: 'Causes damage or blocks access', urgent: 'Someone could get hurt' }[k]}</div></div><span class="sev sev-${k}" aria-hidden="true"></span></button>`).join('')}
      <p class="xs faint">The government team will also check how serious it is. Serious problems are prioritised even if few people report them.</p></div>
    ${d.severity === 'urgent' || d.answers.safety === 'Yes' ? emergencyBanner() : ''}`;
}

function stepReview(d) {
  const comm = COMMUNITIES.find((c) => c.slug === d.community); const cat = categoryByKey(d.category);
  const r = routeReport({ category: d.category, subtype: d.subtype, street: d.street, lga: comm.lga });
  const ids = [['first_name', `Show my first name (${repo.state.user.name})`, 'Neighbours see who reported it'], ['community_member', 'Show as “community member”', 'Your name stays hidden'], ['private', 'Keep me private publicly', 'Only the authority can contact you']];
  return `<div class="card card-flush">
      <div style="height:150px;position:relative">${d.photos.find((p) => !p.kind) ? media(d.photos.find((p) => !p.kind)) : scene(cat.key)}<span class="tag" style="position:absolute;left:10px;top:10px;background:var(--surface)">${icon(cat.icon, 13)}${cat.label}${d.subtype ? ' · ' + d.subtype : ''}</span></div>
      <div style="padding:14px" class="stack-sm"><h3 style="font-size:18px">${esc(d.title || `${d.subtype || cat.label} on ${d.street}`)}</h3><p class="small muted">${esc(d.description) || '<i>No description</i>'}</p>
      <dl class="kv" style="margin-top:12px"><dt>Location</dt><dd>${esc(d.street)}, ${comm.name}</dd><dt>Severity</dt><dd>${SeverityBadge(d.severity)}</dd><dt>Evidence</dt><dd>${d.photos.length} item${d.photos.length === 1 ? '' : 's'}</dd></dl></div></div>
    <div class="next-card stack-sm"><div class="xs faint" style="font-weight:700">LIKELY RESPONSIBLE</div>
      <div class="authority"><span class="logo">${AGENCIES[r.primary].short.slice(0, 4)}</span><div><b>${AGENCIES[r.primary].name}</b><div class="xs muted">${assignmentState(r.confidence)}</div></div></div>
      <p class="small">${LEVEL_EXPLAINER[r.level]} ${r.reason}</p>${r.supporting ? `<p class="xs muted">Also notified: ${AGENCIES[r.supporting].name}</p>` : ''}</div>
    <div class="stack-sm"><span class="label">How should you appear publicly?</span>${ids.map(([k, l, s]) => `<button class="radio-card" role="radio" aria-checked="${d.identity === k}" data-action="pick-id" data-v="${k}"><span class="ring"></span><div><b>${l}</b><div class="xs muted">${s}</div></div></button>`).join('')}
    <p class="xs faint row gap-4">${icon('lock', 13)}Your phone number and home address are never shown on public reports.</p></div>`;
}

export function reportSuccess(ref) {
  const r = repo.getReport(ref); if (!r) return notFound();
  return shell(`<div class="screen stack-lg" style="padding-top:36px;text-align:center">
    <div style="margin:0 auto;width:96px;height:96px;border-radius:32px;background:var(--brand);color:#fff;display:grid;place-items:center;box-shadow:0 12px 30px color-mix(in srgb, var(--brand) 40%, transparent);animation:up .4s">${icon('check', 52)}</div>
    <div><h1>Your report has been submitted</h1><p class="muted" style="margin-top:8px">Thank you for looking out for ${communityName(r.community)}.</p></div>
    <div class="card" style="text-align:left"><dl class="kv"><dt>Reference</dt><dd class="tnum" style="font-family:ui-monospace,monospace">${r.ref}</dd><dt>Issue</dt><dd>${categoryByKey(r.category).label}${r.subtype ? ' · ' + r.subtype : ''}</dd>
      <dt>Location</dt><dd>${esc(r.street)}, ${communityName(r.community)}</dd><dt>Reported</dt><dd>${fmtDate(r.createdAt, { day: 'numeric', month: 'short', year: 'numeric' })}</dd></dl></div>
    <div class="next-card stack" style="text-align:left">
      <div class="row">${icon('search', 18)}<b>We're checking which authority is responsible.</b></div>
      <div class="authority"><span class="logo">${AGENCIES[r.agency].short.slice(0, 4)}</span><div><div class="xs faint">Likely responsible</div><b>${AGENCIES[r.agency].name}</b></div></div>
      <div class="row">${icon('clock', 18)}<span><b>Next expected update:</b> within ${r.urgent ? '1 working day' : '3 working days'}</span></div>
      <div class="row">${icon('bell', 18)}<span class="small">We'll notify you at every step.</span></div></div>
    <div class="stack-sm"><a class="btn btn-primary btn-lg btn-block" href="#/issue/${r.ref}">Track this report</a><a class="btn btn-ghost btn-block" href="#/">Back to home</a></div>
  </div>`, { hideNav: true });
}

// ---------- Issue details ----------
export function issue(ref) {
  const r = repo.getReport(ref); if (!r) return notFound();
  const me = repo.state.user.id; const following = r.followers.includes(me); const affected = repo.state.myConfirmations[ref] === 'affected' || r.reporterId === me;
  const done = ['completed', 'monitoring'].includes(r.status); const st = STATUS[r.status];
  const photos = r.photos.length ? r.photos : [{ scene: categoryByKey(r.category).key }];
  const transfer = r.timeline.find((x) => x.title.startsWith('Transferred'));
  const myRes = repo.state.myConfirmations[ref + ':res'];
  const reporter = r.identity === 'first_name' && r.reporterName ? r.reporterName : r.identity === 'community_member' ? 'A community member' : 'Private reporter';
  const insp = r.inspection; const inspector = insp && Object.values(PEOPLE).find((p) => p.id === insp.inspector);

  return shell(`
    <div class="gallery gallery-short">${media(photos[0])}
      <div class="nav-over"><a class="icon-btn" href="javascript:history.back()" aria-label="Back">${icon('chevronL', 20)}</a>
        <div class="row"><button class="icon-btn" data-action="share" aria-label="Share">${icon('upload', 18)}</button><button class="icon-btn" data-action="follow" data-ref="${ref}" aria-label="${following ? 'Unfollow' : 'Follow'}" style="${following ? 'color:var(--brand)' : ''}">${icon('bell', 18)}</button></div></div>
      <span class="count">${icon('image', 13).replace('class="ic', 'style="display:inline;vertical-align:-2px" class="ic')} ${photos.length}</span></div>
    <div class="screen sheet-top stack">
      ${r.status === 'unable' ? `<div class="banner banner-info">${icon('info', 20)}<div><b>Why this report can’t go further</b><p class="small">${esc(r.timeline.at(-1).body)}</p></div></div>` : StatusHero(r)}
      <h1 style="font-size:24px;margin-top:6px">${esc(r.title)}</h1>
      <div class="row small muted wrap">${icon('pin', 15)}${esc(r.street)}${r.landmark ? ` · ${esc(r.landmark)}` : ''}, ${communityName(r.community)}</div>
      <div class="row xs faint wrap">${CatIcon(r.category, 20)}<span>${categoryByKey(r.category).label}${r.subtype ? ' · ' + r.subtype : ''}</span>·${SeverityBadge(r.validatedSeverity || r.severity)}${r.validatedSeverity ? '<span>checked by authority</span>' : ''}</div>
      <div class="xs faint">Reported ${fmtDate(r.createdAt)} by ${reporter} · <span class="tnum">${r.ref}</span></div>

      ${done ? `<div class="stack-sm"><h2>Before → After</h2>${BeforeAfter(photoFor(r, 'before').scene || 'road', (photoFor(r, 'after').scene) || 'road-fixed', 'ba-issue')}
        ${r.completion ? `<p class="small muted">${esc(r.completion.note)} Completed ${fmtDate(r.completion.at)}.</p>` : ''}</div>
        <div class="card stack" style="border-color:color-mix(in srgb, var(--brand) 35%, var(--line))">
          <div><h3 style="font-size:18px">Has this actually been fixed?</h3><p class="small muted">Your answer helps make sure work is really done.</p></div>
          ${myRes ? `<div class="banner banner-info">${icon('check', 18)}<p class="small">Thanks! You said: <b>${{ yes: 'Yes, it is fixed', partial: 'Partially fixed', no: 'No, the problem remains', unsure: 'I cannot confirm' }[myRes]}</b>.</p></div>` :
          `<div class="up-grid">${[['yes', 'check', 'Yes, it is fixed'], ['partial', 'tools', 'Partially fixed'], ['no', 'x', 'No, problem remains'], ['unsure', 'info', 'I cannot confirm']].map(([k, ic, l]) => `<button class="btn btn-secondary btn-wrap" style="min-height:52px" data-action="confirm-fix" data-ref="${ref}" data-v="${k}">${icon(ic, 17)}${l}</button>`).join('')}</div>`}
          ${r.confirmations ? `<div class="row xs muted wrap" style="gap:12px"><span>✅ ${r.confirmations.yes} fixed</span><span>🟡 ${r.confirmations.partial} partly</span><span>❌ ${r.confirmations.no} not fixed</span></div>` : ''}
        </div>` : ''}

      <div class="stat-pair"><div class="stat"><div class="n tnum">${r.affected}</div><div class="l">people confirmed this issue</div></div><div class="stat"><div class="n tnum">${fmtN(r.peopleImpacted || r.affected * 20)}</div><div class="l">residents potentially affected</div></div></div>
      ${!done && r.status !== 'unable' ? `<div class="row gap-12">
        <button class="btn ${affected ? 'btn-soft' : 'btn-primary'} grow" data-action="affected" data-ref="${ref}" ${affected ? 'disabled' : ''}>${icon('hand', 18)}${affected ? 'You’re counted' : 'I’m affected too'}</button>
        <button class="btn btn-secondary grow" data-action="follow" data-ref="${ref}">${icon('bell', 18)}${following ? 'Following' : 'Follow'}</button></div>
        <button class="btn btn-ghost btn-block btn-sm" data-action="add-evidence" data-ref="${ref}">${icon('camera', 16)}Add a photo or update</button>` : ''}

      <div class="card stack-sm"><div class="xs faint" style="font-weight:700">RESPONSIBLE AUTHORITY</div>
        <div class="authority"><span class="logo">${AGENCIES[r.agency].short.slice(0, 4)}</span><div class="grow"><b>${AGENCIES[r.agency].name}</b><div class="xs muted">${r.routingState}${r.supporting ? ` · with ${AGENCIES[r.supporting].short}` : ''}</div></div></div>
        ${transfer ? `<p class="small muted">${icon('refresh', 13).replace('class="ic', 'style="display:inline;vertical-align:-2px" class="ic')} ${esc(transfer.body)}</p>` : `<p class="small muted">${LEVEL_EXPLAINER[AGENCIES[r.agency].level]}</p>`}
        <a class="link" href="#/learn">Who handles what? →</a></div>

      <div class="card"><h2 style="margin-bottom:14px">Progress</h2>${ProgressTracker(r)}</div>

      ${insp?.completedAt ? `<div class="card stack-sm"><div class="row between"><h3>Inspection findings</h3><span class="xs faint">${fmtDate(insp.completedAt)}</span></div>
        <p class="small">${esc(insp.findings || '')}</p><div class="xs muted">Inspected by ${esc(inspector?.name || 'Field inspector')}${insp.assessedSeverity ? ` · assessed as ${SEVERITY[insp.assessedSeverity].label.toLowerCase()}` : ''}</div></div>` : ''}

      <div class="card"><h2 style="margin-bottom:14px">Timeline</h2>${Timeline(r.timeline, { delay: r.delay })}</div>

      <div class="card stack-sm"><h3>Details</h3><p class="small">${esc(r.description)}</p>
        ${r.answers ? `<div class="chips">${r.answers.duration ? `<span class="tag">${icon('clock', 13)}${esc(r.answers.duration)}</span>` : ''}${r.answers.access === 'Yes' ? `<span class="tag">${icon('road', 13)}Blocks access</span>` : ''}${r.answers.safety === 'Yes' ? `<span class="tag" style="color:var(--clay)">${icon('alert', 13)}Safety risk</span>` : ''}</div>` : ''}
        <div class="map" style="height:150px;margin-top:8px">${MapBase()}${MapPin(r, true)}</div></div>
      <div style="height:16px"></div>
    </div>`, { nav: 'explore' });
}

// ---------- My Reports ----------
export function myReports() {
  const mine = repo.myReports(); const active = mine.filter((r) => !['completed', 'monitoring', 'unable'].includes(r.status));
  const resolved = mine.filter((r) => ['completed', 'monitoring'].includes(r.status)); const following = repo.following();
  const lists = { active, resolved, following };
  const cur = lists[ui.myTab];
  const empty = { active: EmptyState('You haven’t reported anything yet', 'Spot something your community needs help with? Let us know.', `<a class="btn btn-primary" href="#/report">${t('home.cta')}</a>`),
    resolved: EmptyState('Nothing resolved yet', 'When work on your reports is completed, you’ll see before-and-after photos here.'),
    following: EmptyState('Not following anything', 'Follow issues near you to get updates when inspections and repairs happen.', '<a class="btn btn-secondary" href="#/explore">Explore nearby</a>') };
  const verified = mine.filter((r) => !['reported', 'under_review', 'unable'].includes(r.status)).length;
  return shell(`<header class="topbar"><h1 class="grow">${t('nav.mine')}</h1><a class="icon-btn" href="#/notifications" aria-label="Notifications">${icon('bell', 20)}${repo.unreadCount() ? '<span class="badge-dot"></span>' : ''}</a></header>
    <div class="screen stack">
      <div class="hero" style="padding:18px"><div class="row between"><div><div class="xs" style="opacity:.8;font-weight:700;letter-spacing:.05em">YOUR IMPACT</div><b style="font:750 20px var(--display);color:#fff">Your reports helped improve ${communityName(repo.state.prefs.community)}.</b></div></div>
        <div class="row" style="margin-top:14px;gap:18px">${[[verified + 6, 'verified'], [resolved.length + 4, 'resolved'], [3, 'communities'], [fmtN(mine.reduce((a, r) => a + (r.peopleImpacted || 0), 0)), 'people impacted']].map(([n, l]) => `<div><div style="font:750 22px var(--display);color:#fff" class="tnum">${n}</div><div class="xs" style="opacity:.8">${l}</div></div>`).join('')}</div></div>
      <div class="seg" role="tablist">${[['active', 'Active', active.length], ['resolved', 'Resolved', resolved.length], ['following', 'Following', following.length]].map(([k, l, n]) => `<button role="tab" aria-selected="${ui.myTab === k}" data-action="my-tab" data-v="${k}">${l} <span class="faint">${n}</span></button>`).join('')}</div>
      <div class="stack-sm">${cur.length ? cur.map((r) => ReportRow(r)).join('') : empty[ui.myTab]}</div>
    </div>`, { nav: 'mine' });
}

// ---------- Explore ----------
export function explore(params) {
  const f = ui.exploreFilter; if (params.get('group')) { f.status = params.get('group'); history.replaceState(null, '', '#/explore'); }
  if (params.get('q') !== null) { f.q = params.get('q'); history.replaceState(null, '', '#/explore'); }
  const list = repo.listReports({ q: f.q, category: f.category }).filter((r) => f.status === 'all' || STATUS[r.status].group === f.status);
  const sel = ui.mapSel && list.find((r) => r.ref === ui.mapSel);
  const view = repo.state.prefs.lowData ? 'list' : ui.exploreView;
  const groups = [['all', 'All'], ['new', 'New'], ['confirmed', 'Verified'], ['inspection', 'Inspection'], ['planned', 'Scheduled'], ['active', 'In progress'], ['done', 'Completed']];
  const statusChips = groups.map(([k, l]) => `<button class="chip" aria-pressed="${f.status === k}" data-action="explore-status" data-v="${k}">${k !== 'all' ? `<i style="width:8px;height:8px;border-radius:50%;background:${GROUPS[k].color};display:inline-block"></i>` : ''}${l}</button>`).join('');
  const viewToggle = (v) => `<button class="icon-btn fm-float" data-action="explore-view" data-v="${v}" aria-label="${v === 'list' ? 'Show list' : 'Show map'}">${icon(v === 'list' ? 'list' : 'map', 20)}</button>`;

  // Full-bleed map: floating search + chips, locate button, swipeable card carousel (Places / Strava / Hypelist pattern).
  if (view === 'map') {
    const ordered = sel ? [sel, ...list.filter((r) => r !== sel)] : list;
    return shell(`<h1 class="sr-only">${t('nav.explore')} map</h1><div class="fullmap">
      <div class="map" data-action="map-clear">${MapBase()}<div class="mypos" style="left:44%;top:61%"></div>${list.map((r) => MapPin(r, r.ref === ui.mapSel)).join('')}</div>
      <div class="fm-top">
        <div class="row"><form class="search grow" data-action="explore-search">${icon('search', 18)}<input class="input fm-float" name="q" value="${esc(f.q)}" placeholder="Search street, landmark or NW-…" aria-label="Search issues"></form>${viewToggle('list')}</div>
        <div class="hscroll fm-chips">${statusChips}</div>
      </div>
      <div class="fm-bottom">
        <div class="fm-row"><div class="fm-count"><b>${list.length} issues</b>&nbsp;in view${sel ? '' : ' · tap a pin'}</div><button class="icon-btn fm-float" data-action="locate" aria-label="Centre on my location">${icon('nav', 19)}</button></div>
        ${list.length ? `<div class="hscroll fm-cards" id="fm-cards">${ordered.map((r) => `<div class="fm-card ${r === sel ? 'sel' : ''}">${ReportRow(r)}</div>`).join('')}</div>` : `<div class="card" style="margin:0 16px">${EmptyState('No issues match', 'Try another filter.')}</div>`}
      </div></div>`, { nav: 'explore' });
  }

  return shell(`<header class="topbar" style="flex-direction:column;align-items:stretch;gap:10px">
      <div class="row"><h1 class="grow">${t('nav.explore')}</h1>${repo.state.prefs.lowData ? '' : viewToggle('map')}</div>
      <form class="search" data-action="explore-search">${icon('search', 18)}<input class="input" name="q" value="${esc(f.q)}" placeholder="Street, landmark, authority or NW-…"></form>
      <div class="hscroll" style="padding-bottom:2px">${statusChips}</div>
      <div class="hscroll" style="padding-bottom:2px"><button class="chip" aria-pressed="${!f.category}" data-action="explore-cat" data-v="">All types</button>${CATEGORIES.slice(0, 10).map((c) => `<button class="chip" aria-pressed="${f.category === c.key}" data-action="explore-cat" data-v="${c.key}">${icon(c.icon, 15)}${c.label}</button>`).join('')}</div>
    </header>
    <div class="screen stack">
      ${repo.state.prefs.lowData ? `<div class="banner banner-sun">${icon('wifi', 18)}<p class="small">Low-data mode: showing a simple list instead of the map.</p></div>` : ''}
      ${list.length ? `<div class="stack-sm">${list.map((r) => ReportRow(r)).join('')}</div>` : EmptyState('No issues match', 'Try another filter, or report something new.')}
    </div>`, { nav: 'explore' });
}

// ---------- Community ----------
export function community(slug) {
  const c = COMMUNITIES.find((x) => x.slug === slug) || COMMUNITIES[0];
  const all = repo.listReports({ community: c.slug });
  const open = all.filter((r) => !['completed', 'monitoring', 'in_progress', 'scheduled', 'work_planned'].includes(r.status));
  const working = all.filter((r) => ['in_progress', 'scheduled', 'work_planned'].includes(r.status));
  const resolved = all.filter((r) => ['completed', 'monitoring'].includes(r.status));
  const score = Math.max(30, Math.min(95, Math.round(62 + resolved.length * 6 - open.filter((r) => r.urgent).length * 8 + working.length * 2)));
  const cats = ['road', 'water', 'electricity', 'drainage', 'streetlight', 'waste'].map((k) => ({ k, n: all.filter((r) => r.category === k).length + (k === 'road' ? 6 : k === 'drainage' ? 4 : 1) }));
  const max = Math.max(...cats.map((x) => x.n));
  const upcoming = all.filter((r) => r.status === 'inspection_scheduled');
  return shell(`
    <div class="hero" style="border-radius:0 0 28px 28px;padding:16px 16px 24px">
      <div class="row between"><a class="icon-btn" href="#/" style="background:rgb(255 255 255 / .14);border:0;color:#fff" aria-label="Back">${icon('chevronL', 20)}</a>
        <div class="row">${COMMUNITIES.map((x) => `<a class="chip" href="#/community/${x.slug}" style="min-height:32px;background:${x.slug === c.slug ? '#fff' : 'rgb(255 255 255 / .12)'};color:${x.slug === c.slug ? 'var(--brand-deep)' : '#fff'};border:0">${x.name}</a>`).join('')}</div></div>
      <div class="row between" style="margin-top:18px;align-items:flex-end"><div><div class="xs" style="opacity:.8;font-weight:700">${c.lgaName.toUpperCase()} · ${c.state.toUpperCase()}</div><h1 style="color:#fff;font-size:34px">${c.name}</h1><div class="small" style="opacity:.85">≈ ${fmtN(c.residents)} residents</div></div>
        <div class="ring-score" style="--p:${score}"><div style="color:var(--ink)">${score}</div></div></div>
    </div>
    <div class="screen stack" style="margin-top:14px">
      <div class="banner banner-info">${icon('info', 18)}<p class="xs"><b>Community infrastructure score</b> reflects reports and repairs on NaijaWorks only. It is not a full measure of government performance; areas with fewer reports may look better or worse than they are.</p></div>
      <div class="stat-pair" style="grid-template-columns:repeat(3,1fr)">${[[open.length, 'Open issues', 'var(--st-new)'], [working.length, 'Being fixed', 'var(--st-active)'], [resolved.length + 9, 'Resolved (90d)', 'var(--st-done)']].map(([n, l, col]) => `<div class="stat"><div class="n tnum" style="color:${col}">${n}</div><div class="l">${l}</div></div>`).join('')}</div>
      <div class="card stack-sm"><h3>Most common problems</h3>${cats.sort((a, b) => b.n - a.n).map(({ k, n }) => { const ct = categoryByKey(k); return `<div class="bar-row"><span class="row gap-4">${icon(ct.icon, 14)}${ct.label}</span><div class="b"><span style="width:${(n / max) * 100}%;background:${ct.hue}"></span></div><span class="tnum faint">${n}</span></div>`; }).join('')}</div>
      ${upcoming.length ? `<div class="section-head" style="margin-top:8px"><h2>Upcoming inspections</h2></div>${upcoming.map((r) => `<a class="insight card-hover" href="#/issue/${r.ref}"><span class="ii" style="background:color-mix(in srgb, var(--st-inspection) 14%, transparent);color:var(--st-inspection)">${icon('calendar', 19)}</span><div class="grow"><b>${esc(r.title)}</b><p class="small muted">${fmtDate(r.inspection.date, { weekday: 'short', day: 'numeric', month: 'short' })} · ${r.inspection.window}</p></div></a>`).join('')}` : ''}
      ${working.length ? `<div class="section-head" style="margin-top:8px"><h2>Being worked on</h2></div><div class="stack-sm">${working.map((r) => ReportRow(r)).join('')}</div>` : ''}
      <div class="section-head" style="margin-top:8px"><h2>Government projects</h2></div><div class="hscroll">${repo.listProjects(c.slug).map(ProjectCard).join('') || '<p class="small muted">No public projects listed.</p>'}</div>
      <div class="section-head" style="margin-top:8px"><h2>Announcements</h2></div><div class="stack-sm">${repo.listAnnouncements(c.slug).map(AnnouncementCard).join('') || '<p class="small muted">No announcements right now.</p>'}</div>
      <div class="section-head" style="margin-top:8px"><h2>Recently resolved</h2></div>
      ${resolved.length ? `<div class="stack-sm">${resolved.map((r) => ReportRow(r)).join('')}</div>` : EmptyState('Nothing resolved yet', 'Resolved issues will appear here.')}
      <div style="height:12px"></div>
    </div>`, { nav: 'community' });
}

// ---------- Impact ----------
export function impact() {
  const fixed = repo.listReports().filter((r) => ['completed', 'monitoring'].includes(r.status));
  const tiles = [['road', 'Roads repaired', 14], ['lamp', 'Streetlights restored', 63], ['droplet', 'Water issues resolved', 9], ['waves', 'Drains cleared', 11], ['users', 'Communities reached', 27], ['check', 'Reports completed', 142]];
  return shell(`${back('#/', 'Impact')}
    <div class="screen stack">
      <div class="hero"><div class="xs" style="opacity:.8;font-weight:700;letter-spacing:.06em">NOVEMBER 2026 · LAGOS</div><h2 style="color:#fff;font-size:24px;margin-top:6px">142 fixes your neighbours can see.</h2><p class="small" style="opacity:.85;margin-top:6px">Every number below was completed with photos and checked by residents.</p></div>
      <div class="stat-pair" style="grid-template-columns:repeat(3,1fr)">${tiles.map(([ic, l, n]) => `<div class="stat"><span style="color:var(--brand)">${icon(ic, 20)}</span><div class="n tnum" style="margin-top:6px">${n}</div><div class="l">${l}</div></div>`).join('')}</div>
      <div class="section-head"><h2>Before → After</h2><span class="xs faint">drag to compare</span></div>
      ${fixed.map((r, i) => `<div class="card card-flush">${BeforeAfter(photoFor(r, 'before').scene, photoFor(r, 'after').scene, 'ba-imp-' + i)}
        <div style="padding:12px 14px" class="row between"><a href="#/issue/${r.ref}" class="grow"><b>${esc(r.title)}</b><div class="xs muted">${esc(r.street)}, ${communityName(r.community)} · ${r.confirmations?.yes || 0} residents confirmed</div></a>
        <button class="btn btn-soft btn-sm" data-action="celebrate">${icon('heart', 15)}Celebrate</button></div></div>`).join('')}
      <div class="card stack-sm"><h3>About these numbers</h3><p class="small muted">Counts come from reports completed on NaijaWorks with evidence. They don’t include work done outside the platform. <a class="link" href="#/data">See public data</a></p></div>
    </div>`, { nav: 'home' });
}

// ---------- Notifications ----------
export function notifications() {
  const list = repo.listNotifications();
  const meta = (k) => ({ delay: ['clock', 'var(--sun-soft)', '#8A6400'], completed: ['sparkle', 'var(--brand-soft)', 'var(--brand)'], monitoring: ['eye', 'var(--brand-soft)', 'var(--brand)'] }[k]
    || (STATUS[k] ? [STATUS[k].icon, `color-mix(in srgb, ${statusColor(k)} 14%, transparent)`, statusColor(k)] : ['bell', 'var(--surface-2)', 'var(--ink-2)']));
  const html = shell(`${back('#/', 'Notifications', list.some((n) => !n.read) ? '<button class="btn btn-ghost btn-sm" data-action="read-all">Mark all read</button>' : '')}
    <div>${list.length ? list.map((n) => { const [ic, bg, fg] = meta(n.kind); return `<a class="notif ${n.read ? '' : 'unread'}" href="#/issue/${n.ref}"><span class="ni" style="background:${bg};color:${fg}">${icon(ic, 19)}</span>
      <div class="grow"><div class="row between"><b class="small">${esc(n.title)}</b><span class="xs faint">${timeAgo(n.at)}</span></div><p class="small muted">${esc(n.body)}</p></div></a>`; }).join('')
      : EmptyState('You’re all caught up', 'Updates on reports you submit or follow will show up here.')}</div>`, { nav: 'mine' });
  return html;
}

// ---------- Profile ----------
export function profile() {
  const u = repo.state.user; const p = repo.state.prefs; const theme = document.documentElement.dataset.theme || 'light';
  const toggle = (k, on, label, sub) => `<button class="radio-card" data-action="toggle-pref" data-k="${k}" role="switch" aria-checked="${on}" style="border-width:1px"><div class="grow"><b>${label}</b><div class="xs muted">${sub}</div></div>
    <span style="width:46px;height:28px;border-radius:99px;background:${on ? 'var(--brand)' : 'var(--surface-3)'};position:relative;transition:.2s"><span style="position:absolute;top:3px;left:${on ? 21 : 3}px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:var(--shadow);transition:.2s"></span></span></button>`;
  return shell(`${back('#/', 'Profile')}
    <div class="screen stack">
      <div class="row gap-16"><div style="width:68px;height:68px;border-radius:24px;background:var(--brand);color:#fff;display:grid;place-items:center;font:750 28px var(--display)">${u.name[0]}</div>
        <div><h2>${esc(u.fullName)}</h2><div class="small muted">${communityName(p.community)}, Lagos · member since ${fmtDate(u.joined, { month: 'short', year: 'numeric' })}</div>
        <div class="row" style="margin-top:6px"><span class="tag" style="background:var(--sun-soft);color:#7A5800">${icon('star', 13)}${u.points} contribution points</span></div></div></div>
      <p class="xs faint">Points come only from verified reports, useful evidence and confirming repairs — never from report volume.</p>
      <div class="section-head" style="margin-top:6px"><h2>Badges</h2></div>
      <div class="badge-grid">${repo.state.badges.map((b) => `<div class="badge ${b.earned ? '' : 'locked'}"><span class="medal">${icon(b.icon, 22)}</span>${b.label}<span class="xs faint" style="font-weight:500">${b.earned ? b.desc : `${b.progress}/${b.total}`}</span></div>`).join('')}</div>
      <div class="section-head" style="margin-top:6px"><h2>Settings</h2></div>
      <div class="field"><span class="label">Language</span><div class="seg">${LOCALES.map((l) => `<button aria-selected="${p.locale === l.key}" data-action="set-locale" data-v="${l.key}">${l.label}</button>`).join('')}</div><span class="xs faint">More Nigerian languages coming soon.</span></div>
      ${toggle('lowData', p.lowData, 'Low-data mode', 'Compressed photos, list instead of map, text-first')}
      ${toggle('dark', theme === 'dark', 'Dark mode', 'Easier on the eyes at night')}
      <div class="field"><label for="idm">Default public identity</label><select id="idm" class="select" data-action="set-identity">${[['first_name', 'Show my first name'], ['community_member', 'Show as community member'], ['private', 'Keep me private publicly']].map(([k, l]) => `<option value="${k}" ${p.identity === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
      <div class="stack-sm"><a class="card card-hover row" href="#/learn">${icon('book', 20)}<b class="grow">Who handles what?</b>${icon('chevronR', 18)}</a>
        <a class="card card-hover row" href="#/impact">${icon('sparkle', 20)}<b class="grow">Community impact</b>${icon('chevronR', 18)}</a>
        <a class="card card-hover row" href="#/onboarding">${icon('flag', 20)}<b class="grow">Replay welcome</b>${icon('chevronR', 18)}</a>
        <button class="card card-hover row" data-action="reset" style="width:100%;text-align:left">${icon('refresh', 20)}<b class="grow">Reset demo data</b></button></div>
    </div>`, { nav: 'community' });
}

// ---------- Learn ----------
export function learn() {
  const lv = [
    ['Local Government (LGA / LCDA)', 'users', '#0B7A4B', ['Local streets and inner roads', 'Small drains on local streets', 'Markets and motor parks', 'Some streetlights on local streets'], 'Example: Surulere LGA Works'],
    ['State Government', 'building', '#4F46E5', ['Major roads inside the state', 'Primary drainage channels and flooding', 'Public water supply', 'Waste collection (e.g. LAWMA in Lagos)', 'Public primary schools and health centres'], 'Example: Lagos State Public Works'],
    ['Federal Government', 'flag', '#C77700', ['Highways that connect states (trunk roads)', 'Federal bridges', 'Federal buildings and institutions'], 'Example: FERMA'],
    ['Utilities & regulators', 'bolt', '#D9481F', ['Electricity supply, poles and transformers — your distribution company (DisCo)', 'Electrical safety — NEMSA', 'Some water services — state water corporation'], 'Example: Eko DisCo, Ikeja Electric'],
  ];
  return shell(`${back('#/', 'Who handles what?')}
    <div class="screen stack">
      <p class="muted">You never need to know this before reporting — NaijaWorks works it out. But it helps to know who is responsible.</p>
      ${lv.map(([h, ic, col, items, ex]) => `<div class="card stack-sm"><div class="row gap-12"><span style="width:42px;height:42px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb, ${col} 14%, transparent);color:${col}">${icon(ic, 21)}</span><h3 style="font-size:17px">${h}</h3></div>
        <ul class="small" style="margin:4px 0 0;padding-left:20px;display:grid;gap:4px">${items.map((i) => `<li>${i}</li>`).join('')}</ul><div class="xs faint">${ex}</div></div>`).join('')}
      <div class="banner banner-sun">${icon('refresh', 18)}<p class="small">Sometimes a report goes to one office and is then <b>transferred</b> to the right one. When that happens, you’ll see why on the timeline.</p></div>
    </div>`, { nav: 'home' });
}

// ---------- Project ----------
export function project(id) {
  const p = repo.getProject(id); if (!p) return notFound();
  return shell(`<div class="gallery">${scene(p.agency === 'lslights' ? 'streetlight-fixed' : p.agency === 'lsmoe' ? 'drainage' : 'school')}<div class="nav-over"><a class="icon-btn" href="javascript:history.back()" aria-label="Back">${icon('chevronL', 20)}</a></div></div>
    <div class="screen sheet-top stack">
      <div class="row wrap"><span class="tag">${icon('crane', 13)}Public project</span>${p.stalled ? '<span class="sev sev-serious">Behind schedule</span>' : '<span class="status" style="--c:var(--st-active)">On track</span>'}</div>
      <h1 style="font-size:24px">${esc(p.name)}</h1><p class="muted">${esc(p.description)}</p>
      <div class="card"><dl class="kv"><dt>Responsible</dt><dd>${AGENCIES[p.agency].name}</dd><dt>Location</dt><dd>${communityName(p.community)}, Lagos</dd><dt>Started</dt><dd>${fmtDate(p.start, { day: 'numeric', month: 'short', year: 'numeric' })}</dd><dt>Expected completion</dt><dd>${fmtDate(p.expected, { day: 'numeric', month: 'short', year: 'numeric' })}</dd><dt>Following</dt><dd>${p.followers} people</dd></dl></div>
      <div class="next-card"><div class="xs faint" style="font-weight:700">LATEST UPDATE</div><p style="margin-top:4px">${esc(p.latest)}</p></div>
      <div class="card"><h2 style="margin-bottom:14px">Milestones</h2><ol class="vtrack">${p.milestones.map((m, i) => `<li class="${i < p.stage ? 'done' : i === p.stage ? 'now' : 'todo'}"><span class="node">${i < p.stage ? icon('check', 14) : ''}</span><div class="t">${m}</div><span></span></li>`).join('')}</ol></div>
      <div class="stack-sm"><button class="btn btn-primary btn-block" data-action="toast" data-msg="You’re following this project">${icon('bell', 18)}Follow project</button>
        <div class="row gap-12"><button class="btn btn-secondary grow" data-action="toast" data-msg="Update requested from ${AGENCIES[p.agency].short}">${icon('megaphone', 17)}Ask for update</button><a class="btn btn-secondary grow" href="#/report">${icon('flag', 17)}Report a problem</a></div></div>
    </div>`, { nav: 'community' });
}

export const notFound = () => shell(`<div class="screen">${EmptyState('We couldn’t find that', 'The report may have been merged or the link is wrong.', '<a class="btn btn-primary" href="#/">Go home</a>')}</div>`, { nav: 'home' });

// ---------- Actions ----------
const compress = (file, max) => new Promise((res) => {
  const img = new Image(); img.onload = () => { const s = Math.min(1, max / Math.max(img.width, img.height)); const c = document.createElement('canvas'); c.width = img.width * s; c.height = img.height * s;
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', 0.7)); URL.revokeObjectURL(img.src); };
  img.src = URL.createObjectURL(file);
});

export const actions = {
  'finish-onboarding': () => { repo.setPref('onboarded', true); go('#/'); },
  'set-locale': (el) => { repo.setPref('locale', el.dataset.v); rerender(); },
  'set-community': (el) => repo.setPref('community', el.value),
  'set-identity': (el) => { repo.setPref('identity', el.value); toast('Saved'); },
  'pick-community': () => openModal(Modal(`<h2>Choose your area</h2><div class="stack-sm" style="margin-top:14px">${COMMUNITIES.map((c) => `<button class="radio-card" role="radio" aria-checked="${repo.state.prefs.community === c.slug}" data-action="choose-community" data-v="${c.slug}"><span class="ring"></span><div><b>${c.name}</b><div class="xs muted">${c.lgaName}, ${c.state}</div></div></button>`).join('')}</div>`)),
  'choose-community': (el) => { repo.setPref('community', el.dataset.v); closeModal(); rerender(); },
  'search-submit': (el, e) => { e.preventDefault(); go('#/explore?q=' + encodeURIComponent(new FormData(el).get('q') || '')); },
  'explore-search': (el, e) => { e.preventDefault(); ui.exploreFilter.q = new FormData(el).get('q'); ui.exploreView = 'list'; rerender(); },
  'explore-status': (el) => { ui.exploreFilter.status = el.dataset.v; ui.mapSel = null; rerender(); },
  'explore-cat': (el) => { ui.exploreFilter.category = el.dataset.v || null; ui.mapSel = null; rerender(); },
  'explore-view': (el) => { ui.exploreView = el.dataset.v; rerender(); },
  'map-select': (el, e) => { e.stopPropagation(); ui.mapSel = ui.mapSel === el.dataset.ref ? null : el.dataset.ref; rerender(); document.getElementById('fm-cards')?.scrollTo(0, 0); },
  'map-clear': (el, e) => { if (!e.target.closest('.pin') && ui.mapSel) { ui.mapSel = null; rerender(); } },
  'locate': () => toast('Showing issues around you', 'nav'),
  'my-tab': (el) => { ui.myTab = el.dataset.v; rerender(); },
  // report flow
  'exit-report': () => { ui.draft = null; go('#/'); },
  'save-draft': () => { repo.saveDraft(ui.draft); toast('Draft saved on this phone. It will send when you are back online.', 'wifi'); },
  'step-next': () => { ui.reportStep++; rerender(); document.getElementById('scroller')?.scrollTo(0, 0); },
  'step-back': () => { ui.reportStep--; rerender(); },
  'pick-cat': (el) => { ui.draft.category = el.dataset.v; ui.draft.subtype = categoryByKey(el.dataset.v).subtypes[0]; rerender(); },
  'pick-sub': (el) => { ui.draft.subtype = el.dataset.v; if (URGENT_SUBTYPES.includes(el.dataset.v)) ui.draft.severity = 'urgent'; rerender(); },
  'pick-file': () => document.getElementById('file-in').click(),
  'file-picked': async (el) => { for (const f of el.files) ui.draft.photos.push({ phase: 'before', src: await compress(f, repo.state.prefs.lowData ? 640 : 1024) }); rerender(); },
  'add-sample-photo': () => { ui.draft.photos.push({ phase: 'before', scene: categoryByKey(ui.draft.category).key }); rerender(); },
  'add-media': (el) => { ui.draft.photos.push({ phase: 'before', kind: el.dataset.v }); toast(el.dataset.v === 'voice' ? 'Voice note recorded (0:12)' : 'Video attached (0:08)', el.dataset.v === 'voice' ? 'mic' : 'video'); rerender(); },
  'rm-photo': (el) => { ui.draft.photos.splice(+el.dataset.i, 1); rerender(); },
  'map-click': (el, e) => {
    if (e.target.closest('button')) return; const b = el.getBoundingClientRect();
    const x = ((e.clientX - b.left) / b.width) * 100, y = ((e.clientY - b.top) / b.height) * 100; const s = nearestStreet(x, y);
    Object.assign(ui.draft, { pos: { x, y }, street: s.name, community: s.c }); ui.dupDismissed = false; rerender();
  },
  'use-gps': () => { Object.assign(ui.draft, { pos: { x: 44.5, y: 61 }, street: 'Adeola Street', community: 'surulere' }); ui.dupDismissed = false; toast('Location found · accurate to 12 m', 'target'); rerender(); },
  'dup-affected': (el) => { repo.confirmAffected(el.dataset.ref); ui.draft = null; toast('Added you to this issue. Thank you!'); go('#/issue/' + el.dataset.ref); },
  'dup-follow': (el) => { repo.toggleFollow(el.dataset.ref); toast('Following. We’ll keep you updated.', 'bell'); rerender(); },
  'dup-different': () => { ui.dupDismissed = true; rerender(); },
  'answer': (el) => { ui.draft.answers[el.dataset.k] = el.dataset.v; rerender(); },
  'pick-sev': (el) => { ui.draft.severity = el.dataset.v; rerender(); },
  'pick-id': (el) => { ui.draft.identity = el.dataset.v; rerender(); },
  'ai-describe': () => {
    const d = ui.draft; const cat = categoryByKey(d.category); const a = d.answers;
    d.title ||= `${d.subtype || cat.label} on ${d.street || 'my street'}`;
    d.description = `${d.subtype || cat.label} at ${d.street || 'this location'}${d.landmark ? ` (${d.landmark})` : ''}. ${a.duration ? `This has been happening for ${a.duration.toLowerCase() === 'today' ? 'less than a day' : a.duration.toLowerCase()}. ` : ''}${a.access === 'Yes' ? 'It is blocking access to homes and businesses. ' : a.access === 'Partly' ? 'It partly blocks access. ' : ''}${a.safety === 'Yes' ? 'There is a safety risk to people passing.' : ''}`.trim();
    toast('Suggested a description — edit anything you like', 'sparkle'); rerender();
  },
  'submit-report': () => { const r = repo.createReport(ui.draft); ui.draft = null; go('#/report/success/' + r.ref); },
  // issue page
  'follow': (el) => { repo.toggleFollow(el.dataset.ref); const on = repo.getReport(el.dataset.ref).followers.includes(repo.state.user.id); toast(on ? 'Following. You’ll get every update.' : 'Unfollowed', 'bell'); rerender(); },
  'affected': (el) => { repo.confirmAffected(el.dataset.ref); toast('Thanks — you’ve been counted. This helps the authority understand the impact.', 'hand'); rerender(); },
  'add-evidence': (el) => { repo.addEvidence(el.dataset.ref); toast('Photo added. +5 points if it’s marked useful.', 'camera'); rerender(); },
  'confirm-fix': (el) => {
    const r = repo.getReport(el.dataset.ref); repo.confirmResolution(el.dataset.ref, el.dataset.v);
    if (el.dataset.v === 'yes' && !r.urgent && (r.reporterId === repo.state.user.id || r.followers.includes(repo.state.user.id))) { confetti(); toast('Wonderful! Thanks for confirming.', 'sparkle'); }
    else toast(el.dataset.v === 'no' || el.dataset.v === 'partial' ? 'Thanks. If others agree, this goes back for review.' : 'Thanks for your answer.');
    rerender();
  },
  'celebrate': () => { confetti(); },
  'share': () => { navigator.clipboard?.writeText(location.href); toast('Link copied', 'upload'); },
  'read-all': () => { repo.markNotificationsRead(); rerender(); },
  'toggle-pref': (el) => {
    if (el.dataset.k === 'dark') { const d = document.documentElement; d.dataset.theme = d.dataset.theme === 'dark' ? 'light' : 'dark'; try { localStorage.setItem('nw-theme', d.dataset.theme); } catch {} }
    else repo.setPref(el.dataset.k, !repo.state.prefs[el.dataset.k]);
    rerender();
  },
  'toast': (el) => toast(el.dataset.msg),
  'reset': () => { repo.reset(); ui.draft = null; toast('Demo data reset'); go('#/'); },
};
