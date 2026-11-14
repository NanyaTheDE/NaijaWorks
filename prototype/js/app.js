// App entry: hash router, role switcher, event delegation.
import { repo } from './api/repo.js';
import { ui, setRerender, closeModal } from './ctx.js';
import { icon } from './ui/icons.js';
import * as C from './screens/citizen.js';
import * as G from './screens/gov.js';
import * as F from './screens/field.js';

try { const th = localStorage.getItem('nw-theme'); if (th) document.documentElement.dataset.theme = th; } catch {}

const routes = [
  [/^\/onboarding$/, () => C.onboarding(), 'citizen'],
  [/^\/$/, () => (repo.state.prefs.onboarded ? C.home() : C.onboarding()), 'citizen'],
  [/^\/explore$/, (m, q) => C.explore(q), 'citizen'],
  [/^\/report$/, () => C.report(), 'citizen'],
  [/^\/report\/success\/(.+)$/, (m) => C.reportSuccess(m[1]), 'citizen'],
  [/^\/issue\/(.+)$/, (m) => C.issue(m[1]), 'citizen'],
  [/^\/my-reports$/, () => C.myReports(), 'citizen'],
  [/^\/community\/(.+)$/, (m) => C.community(m[1]), 'citizen'],
  [/^\/impact$/, () => C.impact(), 'citizen'],
  [/^\/notifications$/, () => C.notifications(), 'citizen'],
  [/^\/profile$/, () => C.profile(), 'citizen'],
  [/^\/learn$/, () => C.learn(), 'citizen'],
  [/^\/projects\/(.+)$/, (m) => C.project(m[1]), 'citizen'],
  [/^\/data$/, () => G.publicData(), 'public'],
  [/^\/gov$/, () => G.dashboard(), 'gov'],
  [/^\/gov\/reports$/, (m, q) => G.reports(q), 'gov'],
  [/^\/gov\/reports\/(.+)$/, (m) => G.reportReview(m[1]), 'gov'],
  [/^\/gov\/inspections$/, () => G.inspections(), 'gov'],
  [/^\/gov\/work-orders$/, () => G.workOrders(), 'gov'],
  [/^\/gov\/work-orders\/(.+)$/, (m) => G.workOrder(m[1]), 'gov'],
  [/^\/gov\/map$/, () => G.govMap(), 'gov'],
  [/^\/gov\/analytics$/, () => G.analytics(), 'gov'],
  [/^\/gov\/audit$/, () => G.audit(), 'gov'],
  [/^\/gov\/(projects|communities|contractors|announcements)$/, (m) => G.placeholder(m[1], m[1][0].toUpperCase() + m[1].slice(1), 'Planned for the next iteration of the portal.'), 'gov'],
  [/^\/inspector$/, () => F.inspectorHome(), 'inspector'],
  [/^\/inspector\/(.+)$/, (m) => F.inspection(m[1]), 'inspector'],
  [/^\/team$/, () => F.teamHome(), 'team'],
  [/^\/team\/(.+)$/, (m) => F.teamJob(m[1]), 'team'],
];

const ROLES = [['citizen', '#/', 'user', 'Citizen app'], ['gov', '#/gov', 'building', 'Government portal'], ['inspector', '#/inspector', 'clipboard', 'Field inspector'], ['team', '#/team', 'hammer', 'Field team'], ['public', '#/data', 'globe', 'Public data']];
const roleSwitcher = (cur) => `<nav class="roles ${cur === 'gov' || cur === 'public' ? 'compact' : ''}" aria-label="Switch role (demo)"><div class="hd">Viewing as</div>${ROLES.map(([k, h, ic, l]) => `<a href="${h}" aria-current="${k === cur}" title="${l}">${icon(ic, 17)}<span>${l}</span></a>`).join('')}</nav>`;

const actions = { ...C.actions, ...G.actions, ...F.actions, 'close-modal': () => closeModal(), 'close-modal-bg': (el, e) => { if (e.target === el) closeModal(); } };

function render() {
  const [path, qs = ''] = location.hash.slice(1).split('?');
  const p = path || '/'; const params = new URLSearchParams(qs);
  const root = document.getElementById('app');
  const scrollY = document.getElementById('scroller')?.scrollTop; const winY = window.scrollY; const samePath = render.last === p;
  for (const [re, fn, role] of routes) {
    const m = p.match(re); if (!m) continue;
    root.innerHTML = fn(m, params) + roleSwitcher(role);
    document.title = `NaijaWorks${role === 'gov' ? ' · Operations' : role === 'inspector' ? ' · Inspector' : role === 'team' ? ' · Field team' : ''}`;
    if (samePath) { const s = document.getElementById('scroller'); if (s && scrollY) s.scrollTop = scrollY; window.scrollTo(0, winY); } else window.scrollTo(0, 0);
    render.last = p; return;
  }
  root.innerHTML = C.notFound();
}
setRerender(render);
window.addEventListener('hashchange', () => { if (!location.hash.startsWith('#/report')) { if (ui.draft && !location.hash.includes('success')) {} } render(); });
repo.subscribe(() => {});

// Event delegation
const run = (el, e) => { const fn = actions[el.dataset.action]; if (fn) { fn(el, e); return true; } return false; };
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]'); if (!el || el.tagName === 'FORM' || el.tagName === 'SELECT' || el.tagName === 'INPUT') return;
  if (el.dataset.action === 'map-click' && e.target.closest('[data-action]') !== el) return;
  run(el, e);
});
document.addEventListener('submit', (e) => { const f = e.target.closest('form[data-action]'); if (f) { e.preventDefault(); run(f, e); } });
document.addEventListener('change', (e) => { const el = e.target; if ((el.tagName === 'SELECT' || el.type === 'file') && el.dataset.action) run(el, e);
  if (el.dataset.bind && ui.draft) { ui.draft[el.dataset.bind] = el.value; if (el.dataset.bind === 'community' || el.dataset.bind === 'street') { ui.dupDismissed = false; render(); } } });
document.addEventListener('input', (e) => {
  const el = e.target;
  if (el.dataset.bind && ui.draft) { ui.draft[el.dataset.bind] = el.value; const btn = document.querySelector('[data-action="step-next"]'); if (btn) btn.disabled = !(ui.reportStep === 2 ? ui.draft.street : ui.reportStep === 3 ? ui.draft.severity && (ui.draft.title || ui.draft.description) : true); }
  if (el.dataset.insbind) ui.inspection[el.dataset.ref][el.dataset.insbind] = el.value;
  if (el.dataset.ba) document.getElementById(el.dataset.ba).style.setProperty('--pos', el.value + '%');
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

render();
