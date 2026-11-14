// Core domain types. These mirror the database model in docs/03-status-routing-data.md.
export type StatusKey =
  | 'reported' | 'under_review' | 'verified' | 'assigned' | 'inspection_scheduled' | 'inspected'
  | 'work_planned' | 'scheduled' | 'in_progress' | 'completed' | 'monitoring' | 'reopened' | 'unable';
export type StatusGroup = 'new' | 'confirmed' | 'inspection' | 'planned' | 'active' | 'done' | 'attention' | 'blocked';
export type Severity = 'low' | 'moderate' | 'serious' | 'urgent';
export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type IdentityMode = 'first_name' | 'community_member' | 'private';
export type AgencyLevel = 'federal' | 'state' | 'lga' | 'utility' | 'regulator' | 'platform';
export type InspectionOutcome = 'none' | 'maintenance' | 'repair' | 'replacement' | 'major' | 'emergency' | 'transfer';
export type RejectReason = 'duplicate' | 'insufficient' | 'private_property' | 'wrong_location' | 'not_gov' | 'no_longer' | 'spam' | 'outside';
export type ResolutionAnswer = 'yes' | 'partial' | 'no' | 'unsure';

export interface Evidence { phase: 'before' | 'inspection' | 'progress' | 'after'; scene?: string; src?: string; kind?: 'video' | 'voice' }
export interface TimelineEntry { at: string; status: StatusKey; title: string; body: string; actor: string }
export interface Inspection {
  id: string; inspector: string; date: string; window?: string; instructions?: string;
  startedAt?: string; completedAt?: string; gps?: string; outcome?: InspectionOutcome; findings?: string; assessedSeverity?: Severity; scope?: string;
}
export interface Delay { original: string; updated: string; reason: string }
export interface Report {
  ref: string; category: string; subtype?: string; title: string; description: string;
  street: string; landmark?: string; community: string; lga: string; pos: { x: number; y: number };
  severity: Severity; validatedSeverity?: Severity; priority: Priority; status: StatusKey;
  identity: IdentityMode; reporterName: string | null; reporterId?: string;
  agency: string; supporting?: string; routingState: string; routingReason?: string;
  affected: number; peopleImpacted: number; followers: string[]; createdAt: string; updatedAt?: string; urgent?: boolean;
  answers?: Record<string, string>; photos: Evidence[]; timeline: TimelineEntry[];
  inspection?: Inspection; workOrder?: string; eta?: string | null; delay?: Delay; progress?: number;
  confirmations?: Record<ResolutionAnswer, number>; completion?: { at: string; note: string };
  rejected?: { reason: RejectReason; note?: string }; mergedInto?: string; notes?: { at: string; by: string; text: string }[];
}
export interface WorkOrder {
  id: string; reportRef: string; department: string; contractor: string; scope: string; priority: Priority;
  status: 'draft' | 'awaiting_approval' | 'approved' | 'scheduled' | 'in_progress' | 'paused' | 'completed' | 'cancelled';
  start: string; target: string; originalTarget?: string; actual?: string; estimate: number; funding: string; progress: number;
  updates: { at: string; stage: string; note: string }[];
}
export interface Project {
  id: string; name: string; community: string; agency: string; description: string; start: string; expected: string; stage: number; latest: string;
  followers: number; stalled?: boolean; milestones: string[]; originalExpected?: string; delayReason?: string; updates?: { at: string; text: string }[];
}
export interface Announcement { id: string; agency: string; kind: string; title: string; body: string; community: string; at: string }
export interface Notification { id: string; ref: string; kind: string; title: string; body: string; at: string; read: boolean }
export interface Badge { key: string; label: string; desc: string; earned: boolean; icon: string; progress?: number; total?: number }
export interface Community { slug: string; name: string; lga: string; lgaName: string; state: string; residents: number; center: { x: number; y: number } }
export interface Person { id: string; name: string; title?: string; agency?: string; fullName?: string; community?: string; points?: number; joined?: string }
export interface Contractor { id: string; name: string; kind: 'contractor' | 'internal'; speciality: string }
export interface AuditEntry { at: string; actor: string; action: string; subject: string; detail: unknown }

export interface ReportDraft {
  category: string | null; subtype: string | null; photos: Evidence[]; pos: { x: number; y: number } | null;
  street: string; landmark: string; community: string; title: string; description: string;
  answers: Record<string, string>; severity: Severity | null; identity: IdentityMode;
}
export interface Prefs { locale: 'en' | 'pcm'; lowData: boolean; onboarded: boolean; identity: IdentityMode; community: string }
