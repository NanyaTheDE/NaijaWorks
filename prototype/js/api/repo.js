// Repository layer. Screens only talk to `repo`. Today: a mock adapter backed by localStorage.
// Later: swap `createMockAdapter` for an HTTP adapter with the same method names.
import * as seed from './seed.js';
import { routeReport, assignmentState, AGENCIES } from '../domain/routing.js';
import { STATUS, INSPECTION_OUTCOMES, REJECT_REASONS, PROGRESS_STAGES } from '../domain/statuses.js';
import { categoryByKey } from '../domain/categories.js';

const KEY = 'naijaworks-state-v1';
const clone = (x) => JSON.parse(JSON.stringify(x));

function freshState() {
  return {
    reports: clone(seed.REPORTS), workOrders: clone(seed.WORK_ORDERS), projects: clone(seed.PROJECTS),
    announcements: clone(seed.ANNOUNCEMENTS), notifications: clone(seed.NOTIFICATIONS), badges: clone(seed.BADGES),
    user: clone(seed.PEOPLE.citizen), audit: [], drafts: null,
    prefs: { locale: 'en', lowData: false, onboarded: false, identity: 'first_name', community: 'surulere' },
    myConfirmations: {},
  };
}

function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch {}
  return freshState();
}

function createMockAdapter() {
  let state = load();
  const listeners = new Set();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} listeners.forEach((l) => l()); };
  const now = () => new Date().toISOString();
  const find = (ref) => state.reports.find((r) => r.ref === ref);

  const push = (r, status, title, body, actor, { notify = true } = {}) => {
    r.timeline.push({ at: now(), status, title, body, actor });
    r.status = status; r.updatedAt = now();
    if (notify && (r.reporterId === state.user.id || r.followers.includes(state.user.id))) {
      state.notifications.unshift({ id: 'n-' + Math.random().toString(36).slice(2, 8), ref: r.ref, kind: status, title, body, at: now(), read: false });
    }
  };
  const audit = (actor, action, subject, detail) => state.audit.unshift({ at: now(), actor, action, subject, detail });

  const genRef = () => 'NW-LA-' + Array.from({ length: 6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 34)]).join('');

  return {
    subscribe: (fn) => (listeners.add(fn), () => listeners.delete(fn)),
    reset() { state = freshState(); save(); },
    get state() { return state; },

    // ---------- reads ----------
    listReports(filter = {}) {
      return state.reports.filter((r) => !r.mergedInto && !r.rejected)
        .filter((r) => !filter.community || r.community === filter.community)
        .filter((r) => !filter.category || r.category === filter.category)
        .filter((r) => !filter.statuses || filter.statuses.includes(r.status))
        .filter((r) => !filter.q || `${r.title} ${r.street} ${r.ref} ${r.landmark} ${AGENCIES[r.agency]?.name}`.toLowerCase().includes(filter.q.toLowerCase()))
        .sort((a, b) => (b.updatedAt || b.timeline.at(-1).at).localeCompare(a.updatedAt || a.timeline.at(-1).at));
    },
    allReportsInternal: () => state.reports,
    getReport: find,
    getWorkOrder: (id) => state.workOrders.find((w) => w.id === id),
    listWorkOrders: () => state.workOrders,
    getProject: (id) => state.projects.find((p) => p.id === id),
    listProjects: (c) => state.projects.filter((p) => !c || p.community === c),
    listAnnouncements: (c) => state.announcements.filter((a) => !c || a.community === c),
    listNotifications: () => state.notifications,
    unreadCount: () => state.notifications.filter((n) => !n.read).length,
    myReports: () => state.reports.filter((r) => r.reporterId === state.user.id),
    following: () => state.reports.filter((r) => r.followers.includes(state.user.id) && r.reporterId !== state.user.id),
    findDuplicates({ category, community, street }) {
      return state.reports.filter((r) => r.category === category && r.community === community && !['monitoring'].includes(r.status) && !r.rejected && !r.mergedInto)
        .sort((a, b) => (b.street === street) - (a.street === street)).slice(0, 2);
    },
    inspections() {
      return state.reports.filter((r) => r.inspection).map((r) => ({ ...r.inspection, report: r }));
    },
    route: routeReport,

    // ---------- citizen commands ----------
    setPref(k, v) { state.prefs[k] = v; save(); },
    saveDraft(d) { state.drafts = d; save(); },
    createReport(draft) {
      const comm = seed.COMMUNITIES.find((c) => c.slug === draft.community) || seed.COMMUNITIES[0];
      const routing = routeReport({ category: draft.category, subtype: draft.subtype, street: draft.street, lga: comm.lga });
      const cat = categoryByKey(draft.category);
      const r = {
        ref: genRef(), category: draft.category, subtype: draft.subtype, title: draft.title || `${draft.subtype || cat.label} on ${draft.street}`,
        description: draft.description, street: draft.street, landmark: draft.landmark, community: comm.slug, lga: comm.lga, pos: draft.pos,
        severity: draft.severity, priority: draft.severity === 'urgent' ? 'urgent' : draft.severity === 'serious' ? 'high' : 'medium', status: 'reported',
        identity: draft.identity, reporterName: draft.identity === 'first_name' ? state.user.name : null, reporterId: state.user.id,
        agency: routing.primary, supporting: routing.supporting, routingState: assignmentState(routing.confidence), routingReason: routing.reason,
        affected: 1, peopleImpacted: 0, followers: [state.user.id], createdAt: now(), urgent: draft.severity === 'urgent',
        answers: draft.answers, photos: draft.photos?.length ? draft.photos : [], timeline: [],
      };
      r.timeline.push({ at: now(), status: 'reported', title: r.urgent ? 'Urgent issue reported' : 'Issue reported', body: `Reported ${r.reporterName ? 'by ' + r.reporterName : 'by a community member'}${r.photos.length ? ` with ${r.photos.length} photo${r.photos.length > 1 ? 's' : ''}` : ''}.`, actor: 'Citizen' });
      r.timeline.push({ at: now(), status: 'under_review', title: 'Checking who is responsible', body: `Likely ${AGENCIES[routing.primary].name.replace(/\.$/, '')}. ${routing.reason}`, actor: 'Routing engine' });
      r.status = 'under_review'; r.updatedAt = now();
      state.reports.unshift(r); state.drafts = null;
      state.notifications.unshift({ id: 'n-' + r.ref, ref: r.ref, kind: 'reported', title: 'Report submitted', body: `We're checking which authority is responsible. Next update within ${r.urgent ? '1 working day' : '3 working days'}.`, at: now(), read: false });
      save(); return r;
    },
    confirmAffected(ref) { const r = find(ref); if (state.myConfirmations[ref]) return; r.affected++; state.myConfirmations[ref] = 'affected'; if (!r.followers.includes(state.user.id)) r.followers.push(state.user.id); save(); },
    toggleFollow(ref) { const r = find(ref); const i = r.followers.indexOf(state.user.id); i >= 0 ? r.followers.splice(i, 1) : r.followers.push(state.user.id); save(); },
    confirmResolution(ref, answer) {
      const r = find(ref); r.confirmations ||= { yes: 0, partial: 0, no: 0, unsure: 0 }; r.confirmations[answer]++;
      state.myConfirmations[ref + ':res'] = answer; state.user.points += 5;
      const c = r.confirmations;
      if (c.no + c.partial >= 3 && c.no + c.partial > c.yes) { push(r, 'reopened', 'Resolution under review', 'Several residents say the problem remains. An officer will re-check.', 'Community'); r.resolutionUnderReview = true; }
      else if (answer === 'yes' && r.status === 'completed' && c.yes >= 3) push(r, 'monitoring', `Fix confirmed by ${c.yes} residents`, 'We will keep watching that the fix holds for 14 days.', 'Community', { notify: false });
      save();
    },
    addEvidence(ref) {
      const r = find(ref); r.photos.push({ phase: 'before', scene: categoryByKey(r.category).key });
      r.timeline.push({ at: now(), status: r.status, title: 'New evidence added', body: 'A resident added a photo.', actor: 'Citizen' }); save();
    },
    markNotificationsRead() { state.notifications.forEach((n) => (n.read = true)); save(); },

    // ---------- government commands (each writes timeline + audit) ----------
    verify(ref, { severity, priority }) {
      const r = find(ref); r.validatedSeverity = severity; r.priority = priority;
      push(r, 'verified', 'Verified', `Confirmed as a genuine public infrastructure issue. Priority: ${priority}.`, AGENCIES[r.agency].short);
      audit(seed.PEOPLE.officer.name, 'verify', ref, { severity, priority }); save();
    },
    assign(ref, agencyId, reason) {
      const r = find(ref); const prev = r.agency; r.agency = agencyId;
      if (prev !== agencyId) { r.routingState = 'Transferred'; push(r, 'assigned', `Transferred to ${AGENCIES[agencyId].name}`, `Initially sent to ${AGENCIES[prev].short}. ${reason || ''}`.trim(), AGENCIES[prev].short); }
      else { r.routingState = 'Assigned by officer'; } if (prev === agencyId) push(r, 'assigned', `Assigned to ${AGENCIES[agencyId].name.replace(/\.$/, '')}`, reason || 'This authority now owns the issue.', 'Routing engine');
      audit(seed.PEOPLE.officer.name, prev !== agencyId ? 'transfer' : 'assign', ref, { from: prev, to: agencyId }); save();
    },
    reject(ref, reasonKey, note) {
      const r = find(ref); r.rejected = { reason: reasonKey, note };
      push(r, 'unable', 'Unable to proceed', REJECT_REASONS[reasonKey].friendly + (note ? ' ' + note : ''), AGENCIES[r.agency].short);
      audit(seed.PEOPLE.officer.name, 'reject', ref, { reasonKey, note }); save();
    },
    merge(ref, intoRef) {
      const r = find(ref), into = find(intoRef); r.mergedInto = intoRef; into.affected += r.affected; into.followers = [...new Set([...into.followers, ...r.followers])];
      into.timeline.push({ at: now(), status: into.status, title: 'Duplicate report merged', body: `A matching report was merged here. ${into.affected} people now affected.`, actor: AGENCIES[into.agency].short });
      audit(seed.PEOPLE.officer.name, 'merge', ref, { into: intoRef }); save();
    },
    scheduleInspection(ref, { inspector, date, window, instructions, priority }) {
      const r = find(ref); r.inspection = { id: 'i-' + ref, inspector, date, window, instructions };
      r.priority = priority || r.priority;
      push(r, 'inspection_scheduled', 'Inspection scheduled', `Inspector visit set for ${fmtDate(date)}, ${window}.`, AGENCIES[r.agency].short);
      audit(seed.PEOPLE.officer.name, 'schedule_inspection', ref, r.inspection); save();
    },
    startInspection(ref, gps) { const r = find(ref); r.inspection.startedAt = now(); r.inspection.gps = gps; audit(seed.PEOPLE.inspector.name, 'start_inspection', ref, { gps }); save(); },
    submitInspection(ref, { outcome, findings, assessedSeverity, scope, photos }) {
      const r = find(ref); Object.assign(r.inspection, { outcome, findings, assessedSeverity, scope, completedAt: now() });
      r.validatedSeverity = assessedSeverity; r.photos.push(...(photos || []).map(() => ({ phase: 'inspection', scene: categoryByKey(r.category).key })));
      push(r, 'inspected', 'Inspection complete', INSPECTION_OUTCOMES[outcome].public + (findings ? ` ${findings}` : ''), `${seed.PEOPLE.inspector.name}, Inspector`);
      audit(seed.PEOPLE.inspector.name, 'submit_inspection', ref, { outcome, assessedSeverity }); save();
    },
    approveWork(ref, { scope, contractor, start, target, estimate, funding, workType }) {
      const r = find(ref); const id = 'WO-' + new Date().toISOString().slice(2, 4) + new Date().toISOString().slice(5, 7) + '-' + String(state.workOrders.length + 20).padStart(3, '0');
      state.workOrders.unshift({ id, reportRef: ref, department: AGENCIES[r.agency].name, contractor, scope, priority: r.priority, status: 'scheduled', start, target, estimate, funding, progress: 0, updates: [] });
      r.workOrder = id; r.eta = target;
      push(r, 'work_planned', `${workType || 'Repair'} approved`, `Expected to start ${fmtDate(start)} and finish by ${fmtDate(target)}.`, AGENCIES[r.agency].short);
      const c = seed.CONTRACTORS.find((x) => x.id === contractor);
      push(r, 'scheduled', 'Work scheduled', `${c.name} booked to start ${fmtDate(start)}.`, AGENCIES[r.agency].short);
      audit(seed.PEOPLE.officer.name, 'approve_work', ref, { id, estimate, funding }); save(); return id;
    },
    startWork(id) { const w = this.getWorkOrder(id); w.status = 'in_progress'; w.updates.push({ at: now(), stage: 'started', note: 'Crew on site.' }); w.progress = 10; push(find(w.reportRef), 'in_progress', 'Work started', `Good news — work has started. ${seed.CONTRACTORS.find((c) => c.id === w.contractor).name} is on site.`, 'Field team'); find(w.reportRef).progress = 10; audit('Field team', 'start_work', id, {}); save(); },
    progressUpdate(id, stageKey, note) {
      const w = this.getWorkOrder(id); const st = PROGRESS_STAGES.find((s) => s.key === stageKey);
      w.updates.push({ at: now(), stage: stageKey, note }); w.progress = st.pct; const r = find(w.reportRef); r.progress = st.pct;
      push(r, 'in_progress', `Progress: ${st.label.toLowerCase()}`, note, 'Field team'); save();
    },
    reportDelay(id, newDate, reason) {
      const w = this.getWorkOrder(id); const r = find(w.reportRef); w.originalTarget ||= w.target; w.target = newDate; r.eta = newDate;
      r.delay = { original: w.originalTarget, updated: newDate, reason };
      push(r, r.status, 'Delay', `${reason} New target: ${fmtDate(newDate)}.`, 'Field team'); audit('Field team', 'delay', id, { newDate, reason }); save();
    },
    completeWork(id, note) {
      const w = this.getWorkOrder(id); w.status = 'completed'; w.actual = now(); w.progress = 100; const r = find(w.reportRef);
      r.completion = { at: now(), note }; r.progress = 100; r.photos.push({ phase: 'after', scene: categoryByKey(r.category).key + '-fixed' });
      r.confirmations = { yes: 0, partial: 0, no: 0, unsure: 0 };
      push(r, 'completed', 'Work completed', `${note} Has this actually been fixed? Tell us.`, 'Field team'); audit('Field team', 'complete_work', id, { note }); save();
    },
    publicUpdate(ref, text) { const r = find(ref); push(r, r.status, 'Update from the authority', text, AGENCIES[r.agency].short); save(); },
    internalNote(ref, text) { const r = find(ref); (r.notes ||= []).push({ at: now(), by: seed.PEOPLE.officer.name, text }); audit(seed.PEOPLE.officer.name, 'internal_note', ref, {}); save(); },
  };
}

export function fmtDate(iso, opts = { day: 'numeric', month: 'short' }) {
  return new Date(iso).toLocaleDateString('en-NG', opts);
}

export const repo = createMockAdapter();
export const { COMMUNITIES, PEOPLE, CONTRACTORS, TODAY } = seed;
