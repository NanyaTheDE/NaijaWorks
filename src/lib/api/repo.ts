// Repository layer. UI talks only to the `Repository` interface.
// Today: MockRepository (seeded, persisted to localStorage). Later: an HttpRepository with the same methods.
import * as seed from './seed';
import { routeReport, assignmentState, AGENCIES } from '../domain/routing';
import { INSPECTION_OUTCOMES, REJECT_REASONS, PROGRESS_STAGES } from '../domain/statuses';
import { categoryByKey } from '../domain/categories';
import { fmtDate } from '../format';
import type {
  Report, WorkOrder, Project, Announcement, Notification, Badge, Person, AuditEntry, Prefs, ReportDraft, Contractor,
  StatusKey, Severity, Priority, InspectionOutcome, RejectReason, ResolutionAnswer, Inspection,
} from '../domain/types';

export interface State {
  reports: Report[]; workOrders: WorkOrder[]; projects: Project[]; announcements: Announcement[];
  notifications: Notification[]; badges: Badge[]; contractors: Contractor[]; user: Person & { points: number; fullName: string; joined: string };
  audit: AuditEntry[]; drafts: ReportDraft | null; prefs: Prefs; myConfirmations: Record<string, string>;
}
export interface ReportFilter { community?: string; category?: string | null; statuses?: StatusKey[]; q?: string }

export interface Repository {
  readonly state: State;
  subscribe(fn: () => void): () => void;
  version(): number;
  reset(): void;
  // reads
  listReports(filter?: ReportFilter): Report[];
  allReportsInternal(): Report[];
  getReport(ref: string): Report | undefined;
  getWorkOrder(id: string): WorkOrder | undefined;
  listWorkOrders(): WorkOrder[];
  getProject(id: string): Project | undefined;
  listProjects(community?: string): Project[];
  listAnnouncements(community?: string): Announcement[];
  listNotifications(): Notification[];
  unreadCount(): number;
  myReports(): Report[];
  following(): Report[];
  findDuplicates(q: { category: string | null; community: string; street: string }): Report[];
  inspections(): (Inspection & { report: Report })[];
  listContractors(): Contractor[];
  getContractor(id: string): Contractor;
  // citizen commands
  setPref<K extends keyof Prefs>(k: K, v: Prefs[K]): void;
  saveDraft(d: ReportDraft | null): void;
  createReport(d: ReportDraft): Report;
  confirmAffected(ref: string): void;
  toggleFollow(ref: string): void;
  confirmResolution(ref: string, answer: ResolutionAnswer): void;
  addEvidence(ref: string): void;
  markNotificationsRead(): void;
  // government / field commands
  verify(ref: string, v: { severity: Severity; priority: Priority }): void;
  assign(ref: string, agencyId: string, reason?: string): void;
  reject(ref: string, reason: RejectReason, note?: string): void;
  merge(ref: string, intoRef: string): void;
  scheduleInspection(ref: string, v: { inspector: string; date: string; window: string; instructions?: string; priority?: Priority }): void;
  startInspection(ref: string, gps: string): void;
  submitInspection(ref: string, v: { outcome: InspectionOutcome; findings: string; assessedSeverity: Severity; scope?: string; photos: number }): void;
  approveWork(ref: string, v: { scope: string; contractor: string; start: string; target: string; estimate: number; funding: string; workType: string }): string;
  startWork(id: string): void;
  progressUpdate(id: string, stageKey: string, note: string): void;
  reportDelay(id: string, newDate: string, reason: string): void;
  completeWork(id: string, note: string): void;
  publicUpdate(ref: string, text: string): void;
  internalNote(ref: string, text: string): void;
  // portal management
  addContractor(c: Omit<Contractor, 'id'>): Contractor;
  publishAnnouncement(a: Omit<Announcement, 'id' | 'at'>): Announcement;
  withdrawAnnouncement(id: string): void;
  updateProject(id: string, u: { latest?: string; stage?: number; stalled?: boolean; expected?: string; delayReason?: string }): void;
}

const KEY = 'naijaworks-state-v2';
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));
const now = () => new Date().toISOString();
const randId = () => Math.random().toString(36).slice(2, 8);

function freshState(): State {
  return {
    reports: clone(seed.REPORTS), workOrders: clone(seed.WORK_ORDERS), projects: clone(seed.PROJECTS),
    announcements: clone(seed.ANNOUNCEMENTS), notifications: clone(seed.NOTIFICATIONS), badges: clone(seed.BADGES), contractors: clone(seed.CONTRACTORS),
    user: clone(seed.PEOPLE.citizen) as State['user'], audit: [], drafts: null,
    prefs: { locale: 'en', lowData: false, onboarded: false, identity: 'first_name', community: 'surulere' },
    myConfirmations: {},
  };
}

export class MockRepository implements Repository {
  state: State;
  private listeners = new Set<() => void>();
  private v = 0;

  constructor(initial?: State) { this.state = initial ?? freshState(); }

  static load(): MockRepository {
    try { const raw = localStorage.getItem(KEY); if (raw) return new MockRepository({ ...freshState(), ...JSON.parse(raw) }); } catch { /* storage unavailable */ }
    return new MockRepository();
  }

  subscribe = (fn: () => void) => { this.listeners.add(fn); return () => { this.listeners.delete(fn); }; };
  version = () => this.v;
  private save() {
    // New object identity so React consumers re-render.
    this.state = { ...this.state }; this.v++;
    try { localStorage.setItem(KEY, JSON.stringify(this.state)); } catch { /* quota / private mode */ }
    this.listeners.forEach((l) => l());
  }
  reset() { this.state = freshState(); this.save(); }

  private find(ref: string): Report { const r = this.state.reports.find((x) => x.ref === ref); if (!r) throw new Error(`Report ${ref} not found`); return r; }
  private push(r: Report, status: StatusKey, title: string, body: string, actor: string, notify = true) {
    r.timeline.push({ at: now(), status, title, body, actor }); r.status = status; r.updatedAt = now();
    if (notify && (r.reporterId === this.state.user.id || r.followers.includes(this.state.user.id))) {
      this.state.notifications.unshift({ id: 'n-' + randId(), ref: r.ref, kind: status, title, body, at: now(), read: false });
    }
  }
  private audit(actor: string, action: string, subject: string, detail: unknown) { this.state.audit.unshift({ at: now(), actor, action, subject, detail }); }
  private officer = seed.PEOPLE.officer.name;
  private short = (id: string) => AGENCIES[id]?.short ?? id;

  // ---------- reads ----------
  listReports(f: ReportFilter = {}) {
    return this.state.reports.filter((r) => !r.mergedInto && !r.rejected)
      .filter((r) => !f.community || r.community === f.community)
      .filter((r) => !f.category || r.category === f.category)
      .filter((r) => !f.statuses || f.statuses.includes(r.status))
      .filter((r) => !f.q || `${r.title} ${r.street} ${r.ref} ${r.landmark} ${AGENCIES[r.agency]?.name}`.toLowerCase().includes(f.q.toLowerCase()))
      .sort((a, b) => (b.updatedAt || b.timeline.at(-1)!.at).localeCompare(a.updatedAt || a.timeline.at(-1)!.at));
  }
  allReportsInternal() { return this.state.reports; }
  getReport(ref: string) { return this.state.reports.find((r) => r.ref === ref); }
  getWorkOrder(id: string) { return this.state.workOrders.find((w) => w.id === id); }
  listWorkOrders() { return this.state.workOrders; }
  getProject(id: string) { return this.state.projects.find((p) => p.id === id); }
  listProjects(c?: string) { return this.state.projects.filter((p) => !c || p.community === c); }
  listAnnouncements(c?: string) { return this.state.announcements.filter((a) => !c || a.community === c); }
  listNotifications() { return this.state.notifications; }
  unreadCount() { return this.state.notifications.filter((n) => !n.read).length; }
  myReports() { return this.state.reports.filter((r) => r.reporterId === this.state.user.id); }
  following() { return this.state.reports.filter((r) => r.followers.includes(this.state.user.id) && r.reporterId !== this.state.user.id); }
  findDuplicates({ category, community, street }: { category: string | null; community: string; street: string }) {
    return this.state.reports.filter((r) => r.category === category && r.community === community && r.status !== 'monitoring' && !r.rejected && !r.mergedInto)
      .sort((a, b) => Number(b.street === street) - Number(a.street === street)).slice(0, 2);
  }
  inspections() { return this.state.reports.filter((r) => r.inspection).map((r) => ({ ...r.inspection!, report: r })); }
  listContractors() { return this.state.contractors; }
  getContractor(id: string): Contractor { return this.state.contractors.find((c) => c.id === id) ?? { id, name: 'Unknown team', kind: 'contractor', speciality: '' }; }

  // ---------- citizen ----------
  setPref<K extends keyof Prefs>(k: K, v: Prefs[K]) { this.state.prefs = { ...this.state.prefs, [k]: v }; this.save(); }
  saveDraft(d: ReportDraft | null) { this.state.drafts = d; this.save(); }
  createReport(d: ReportDraft): Report {
    const comm = seed.COMMUNITIES.find((c) => c.slug === d.community) ?? seed.COMMUNITIES[0];
    const routing = routeReport({ category: d.category, subtype: d.subtype, street: d.street, lga: comm.lga });
    const cat = categoryByKey(d.category);
    const ref = 'NW-LA-' + Array.from({ length: 6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 34)]).join('');
    const severity = d.severity ?? 'moderate';
    const u = this.state.user;
    const r: Report = {
      ref, category: d.category ?? 'other', subtype: d.subtype ?? undefined, title: d.title || `${d.subtype || cat.label} on ${d.street}`,
      description: d.description, street: d.street, landmark: d.landmark, community: comm.slug, lga: comm.lga, pos: d.pos ?? comm.center,
      severity, priority: severity === 'urgent' ? 'urgent' : severity === 'serious' ? 'high' : 'medium', status: 'under_review',
      identity: d.identity, reporterName: d.identity === 'first_name' ? u.name : null, reporterId: u.id,
      agency: routing.primary, supporting: routing.supporting, routingState: assignmentState(routing.confidence), routingReason: routing.reason,
      affected: 1, peopleImpacted: 0, followers: [u.id], createdAt: now(), updatedAt: now(), urgent: severity === 'urgent',
      answers: d.answers, photos: d.photos, timeline: [],
    };
    const n = r.photos.filter((p) => !p.kind).length;
    r.timeline.push({ at: now(), status: 'reported', title: r.urgent ? 'Urgent issue reported' : 'Issue reported', body: `Reported ${r.reporterName ? 'by ' + r.reporterName : 'by a community member'}${n ? ` with ${n} photo${n > 1 ? 's' : ''}` : ''}.`, actor: 'Citizen' });
    r.timeline.push({ at: now(), status: 'under_review', title: 'Checking who is responsible', body: `Likely ${AGENCIES[routing.primary].name.replace(/\.$/, '')}. ${routing.reason}`, actor: 'Routing engine' });
    this.state.reports = [r, ...this.state.reports]; this.state.drafts = null;
    this.state.notifications.unshift({ id: 'n-' + ref, ref, kind: 'reported', title: 'Report submitted', body: `We're checking which authority is responsible. Next update within ${r.urgent ? '1 working day' : '3 working days'}.`, at: now(), read: false });
    this.save(); return r;
  }
  confirmAffected(ref: string) {
    if (this.state.myConfirmations[ref]) return; const r = this.find(ref); r.affected++;
    this.state.myConfirmations[ref] = 'affected'; if (!r.followers.includes(this.state.user.id)) r.followers.push(this.state.user.id); this.save();
  }
  toggleFollow(ref: string) { const r = this.find(ref); const i = r.followers.indexOf(this.state.user.id); if (i >= 0) r.followers.splice(i, 1); else r.followers.push(this.state.user.id); this.save(); }
  confirmResolution(ref: string, answer: ResolutionAnswer) {
    const r = this.find(ref); r.confirmations ??= { yes: 0, partial: 0, no: 0, unsure: 0 }; r.confirmations[answer]++;
    this.state.myConfirmations[ref + ':res'] = answer; this.state.user.points += 5;
    const c = r.confirmations;
    if (c.no + c.partial >= 3 && c.no + c.partial > c.yes) this.push(r, 'reopened', 'Resolution under review', 'Several residents say the problem remains. An officer will re-check.', 'Community');
    else if (answer === 'yes' && r.status === 'completed' && c.yes >= 3) this.push(r, 'monitoring', `Fix confirmed by ${c.yes} residents`, 'We will keep watching that the fix holds for 14 days.', 'Community', false);
    this.save();
  }
  addEvidence(ref: string) {
    const r = this.find(ref); r.photos.push({ phase: 'before', scene: categoryByKey(r.category).key });
    r.timeline.push({ at: now(), status: r.status, title: 'New evidence added', body: 'A resident added a photo.', actor: 'Citizen' }); this.save();
  }
  markNotificationsRead() { this.state.notifications.forEach((n) => (n.read = true)); this.save(); }

  // ---------- government ----------
  verify(ref: string, { severity, priority }: { severity: Severity; priority: Priority }) {
    const r = this.find(ref); r.validatedSeverity = severity; r.priority = priority;
    this.push(r, 'verified', 'Verified', `Confirmed as a genuine public infrastructure issue. Priority: ${priority}.`, this.short(r.agency));
    this.audit(this.officer, 'verify', ref, { severity, priority }); this.save();
  }
  assign(ref: string, agencyId: string, reason?: string) {
    const r = this.find(ref); const prev = r.agency; r.agency = agencyId;
    if (prev !== agencyId) { r.routingState = 'Transferred'; this.push(r, 'assigned', `Transferred to ${AGENCIES[agencyId].name.replace(/\.$/, '')}`, `Initially sent to ${this.short(prev)}. ${reason || ''}`.trim(), this.short(prev)); }
    else { r.routingState = 'Assigned by officer'; this.push(r, 'assigned', `Assigned to ${AGENCIES[agencyId].name.replace(/\.$/, '')}`, reason || 'This authority now owns the issue.', this.short(agencyId)); }
    this.audit(this.officer, prev !== agencyId ? 'transfer' : 'assign', ref, { from: prev, to: agencyId }); this.save();
  }
  reject(ref: string, reason: RejectReason, note?: string) {
    const r = this.find(ref); r.rejected = { reason, note };
    this.push(r, 'unable', 'Unable to proceed', REJECT_REASONS[reason].friendly + (note ? ' ' + note : ''), this.short(r.agency));
    this.audit(this.officer, 'reject', ref, { reason, note }); this.save();
  }
  merge(ref: string, intoRef: string) {
    const r = this.find(ref), into = this.find(intoRef); r.mergedInto = intoRef; into.affected += r.affected; into.followers = [...new Set([...into.followers, ...r.followers])];
    into.timeline.push({ at: now(), status: into.status, title: 'Duplicate report merged', body: `A matching report was merged here. ${into.affected} people now affected.`, actor: this.short(into.agency) });
    this.audit(this.officer, 'merge', ref, { into: intoRef }); this.save();
  }
  scheduleInspection(ref: string, { inspector, date, window, instructions, priority }: { inspector: string; date: string; window: string; instructions?: string; priority?: Priority }) {
    const r = this.find(ref); r.inspection = { id: 'i-' + ref, inspector, date, window, instructions }; if (priority) r.priority = priority;
    this.push(r, 'inspection_scheduled', 'Inspection scheduled', `Inspector visit set for ${fmtDate(date)}, ${window}.`, this.short(r.agency));
    this.audit(this.officer, 'schedule_inspection', ref, r.inspection); this.save();
  }
  startInspection(ref: string, gps: string) { const r = this.find(ref); if (!r.inspection) return; r.inspection.startedAt = now(); r.inspection.gps = gps; this.audit(seed.PEOPLE.inspector.name, 'start_inspection', ref, { gps }); this.save(); }
  submitInspection(ref: string, { outcome, findings, assessedSeverity, scope, photos }: { outcome: InspectionOutcome; findings: string; assessedSeverity: Severity; scope?: string; photos: number }) {
    const r = this.find(ref); if (!r.inspection) return; Object.assign(r.inspection, { outcome, findings, assessedSeverity, scope, completedAt: now() });
    r.validatedSeverity = assessedSeverity;
    for (let i = 0; i < photos; i++) r.photos.push({ phase: 'inspection', scene: categoryByKey(r.category).key });
    this.push(r, 'inspected', 'Inspection complete', INSPECTION_OUTCOMES[outcome].public + (findings ? ` ${findings}` : ''), `${seed.PEOPLE.inspector.name}, Inspector`);
    this.audit(seed.PEOPLE.inspector.name, 'submit_inspection', ref, { outcome, assessedSeverity }); this.save();
  }
  approveWork(ref: string, { scope, contractor, start, target, estimate, funding, workType }: { scope: string; contractor: string; start: string; target: string; estimate: number; funding: string; workType: string }) {
    const r = this.find(ref); const iso = new Date().toISOString();
    const id = `WO-${iso.slice(2, 4)}${iso.slice(5, 7)}-${String(this.state.workOrders.length + 20).padStart(3, '0')}`;
    this.state.workOrders = [{ id, reportRef: ref, department: AGENCIES[r.agency].name, contractor, scope, priority: r.priority, status: 'scheduled', start, target, estimate, funding, progress: 0, updates: [] }, ...this.state.workOrders];
    r.workOrder = id; r.eta = target;
    this.push(r, 'work_planned', `${workType || 'Repair'} approved`, `Expected to start ${fmtDate(start)} and finish by ${fmtDate(target)}.`, this.short(r.agency));
    const c = this.getContractor(contractor);
    this.push(r, 'scheduled', 'Work scheduled', `${c.name} booked to start ${fmtDate(start)}.`, this.short(r.agency));
    this.audit(this.officer, 'approve_work', ref, { id, estimate, funding }); this.save(); return id;
  }
  private wo(id: string): WorkOrder { const w = this.getWorkOrder(id); if (!w) throw new Error(`Work order ${id} not found`); return w; }
  startWork(id: string) {
    const w = this.wo(id); const r = this.find(w.reportRef); w.status = 'in_progress'; w.updates.push({ at: now(), stage: 'started', note: 'Crew on site.' }); w.progress = 10; r.progress = 10;
    this.push(r, 'in_progress', 'Work started', `Good news — work has started. ${this.getContractor(w.contractor).name} is on site.`, 'Field team');
    this.audit('Field team', 'start_work', id, {}); this.save();
  }
  progressUpdate(id: string, stageKey: string, note: string) {
    const w = this.wo(id); const st = PROGRESS_STAGES.find((s) => s.key === stageKey)!; const r = this.find(w.reportRef);
    w.updates.push({ at: now(), stage: stageKey, note }); w.progress = st.pct; r.progress = st.pct;
    this.push(r, 'in_progress', `Progress: ${st.label.toLowerCase()}`, note, 'Field team'); this.save();
  }
  reportDelay(id: string, newDate: string, reason: string) {
    const w = this.wo(id); const r = this.find(w.reportRef); w.originalTarget ??= w.target; w.target = newDate; r.eta = newDate;
    r.delay = { original: w.originalTarget, updated: newDate, reason };
    this.push(r, r.status, 'Delay', `${reason} New target: ${fmtDate(newDate)}.`, 'Field team'); this.audit('Field team', 'delay', id, { newDate, reason }); this.save();
  }
  completeWork(id: string, note: string) {
    const w = this.wo(id); const r = this.find(w.reportRef); w.status = 'completed'; w.actual = now(); w.progress = 100;
    r.completion = { at: now(), note }; r.progress = 100; r.photos.push({ phase: 'after', scene: categoryByKey(r.category).key + '-fixed' });
    r.confirmations = { yes: 0, partial: 0, no: 0, unsure: 0 };
    this.push(r, 'completed', 'Work completed', `${note} Has this actually been fixed? Tell us.`, 'Field team'); this.audit('Field team', 'complete_work', id, { note }); this.save();
  }
  publicUpdate(ref: string, text: string) { const r = this.find(ref); this.push(r, r.status, 'Update from the authority', text, this.short(r.agency)); this.save(); }
  // ---------- portal management ----------
  addContractor(c: Omit<Contractor, 'id'>) {
    const n: Contractor = { ...c, id: 'c-' + randId() }; this.state.contractors = [...this.state.contractors, n];
    this.audit(this.officer, 'add_contractor', n.id, c); this.save(); return n;
  }
  publishAnnouncement(a: Omit<Announcement, 'id' | 'at'>) {
    const n: Announcement = { ...a, id: 'a-' + randId(), at: now() }; this.state.announcements = [n, ...this.state.announcements];
    // Citizens following this area get a notification.
    if (a.community === this.state.prefs.community) this.state.notifications.unshift({ id: 'n-' + randId(), ref: '', kind: 'announcement', title: a.title, body: a.body, at: now(), read: false });
    this.audit(this.officer, 'publish_announcement', n.id, { title: a.title, community: a.community }); this.save(); return n;
  }
  withdrawAnnouncement(id: string) {
    this.state.announcements = this.state.announcements.filter((a) => a.id !== id);
    this.audit(this.officer, 'withdraw_announcement', id, {}); this.save();
  }
  updateProject(id: string, u: { latest?: string; stage?: number; stalled?: boolean; expected?: string; delayReason?: string }) {
    const p = this.state.projects.find((x) => x.id === id); if (!p) return;
    const before = { stage: p.stage, expected: p.expected, stalled: p.stalled };
    if (u.expected && u.expected !== p.expected) { p.originalExpected ??= p.expected; p.delayReason = u.delayReason; }
    Object.assign(p, Object.fromEntries(Object.entries({ latest: u.latest, stage: u.stage, stalled: u.stalled, expected: u.expected }).filter(([, v]) => v !== undefined)));
    (p.updates ??= []).unshift({ at: now(), text: u.latest ?? `Moved to: ${p.milestones[p.stage]}` });
    this.state.projects = [...this.state.projects];
    this.audit(this.officer, 'update_project', id, { before, after: { stage: p.stage, expected: p.expected, stalled: p.stalled } }); this.save();
  }
  internalNote(ref: string, text: string) { const r = this.find(ref); (r.notes ??= []).push({ at: now(), by: this.officer, text }); this.audit(this.officer, 'internal_note', ref, {}); this.save(); }
}

export const { COMMUNITIES, PEOPLE, CONTRACTORS, TODAY } = seed;
