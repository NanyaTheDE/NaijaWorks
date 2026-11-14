import type { Report } from '@/lib/domain/types';
import { PEOPLE } from '@/lib/api/repo';

export const INSPECTORS = [PEOPLE.inspector, PEOPLE.inspector2, PEOPLE.inspector3];

export const QUEUES: Record<string, { label: string; f: (r: Report) => boolean }> = {
  new:        { label: 'New',                 f: (r) => ['reported', 'under_review'].includes(r.status) && !r.rejected },
  urgent:     { label: 'Urgent safety',       f: (r) => !!r.urgent && !['completed', 'monitoring', 'unable'].includes(r.status) },
  assign:     { label: 'Awaiting assignment', f: (r) => r.status === 'verified' || (r.routingState === 'Needs routing review' && ['reported', 'under_review'].includes(r.status)) },
  inspection: { label: 'Inspections',         f: (r) => ['assigned', 'inspection_scheduled'].includes(r.status) },
  decide:     { label: 'Awaiting decision',   f: (r) => r.status === 'inspected' },
  work:       { label: 'Work',                f: (r) => ['work_planned', 'scheduled', 'in_progress'].includes(r.status) },
  review:     { label: 'Resolution review',   f: (r) => r.status === 'reopened' || r.status === 'completed' },
  all:        { label: 'All',                 f: () => true },
};

export const isOverdue = (r: Report) => !!r.delay || (!!r.eta && new Date(r.eta) < new Date() && !['completed', 'monitoring'].includes(r.status));
