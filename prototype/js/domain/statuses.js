// Citizen-facing status architecture. Every status: meaning, who acts, next step, group (colour + pin).
export const STATUS = {
  reported:             { label: 'Reported',             group: 'new',        icon: 'flag',     meaning: 'We have received your report.',                                   who: 'NaijaWorks',          next: 'A government officer reviews it',         slaDays: 1 },
  under_review:         { label: 'Under Review',         group: 'new',        icon: 'search',   meaning: 'An officer is checking the details and who is responsible.',     who: 'Government officer',  next: 'Verification and routing',               slaDays: 3 },
  verified:             { label: 'Verified',             group: 'confirmed',  icon: 'check',    meaning: 'Confirmed as a real public infrastructure issue.',               who: 'Government officer',  next: 'Assigned to the responsible authority',   slaDays: 2 },
  assigned:             { label: 'Assigned',             group: 'confirmed',  icon: 'building', meaning: 'A named authority now owns this issue.',                         who: 'Responsible agency',  next: 'An inspection gets scheduled',            slaDays: 3 },
  inspection_scheduled: { label: 'Inspection Scheduled', group: 'inspection', icon: 'calendar', meaning: 'An inspector will visit the site on a set date.',                who: 'Field inspector',     next: 'Site visit',                              slaDays: 0 },
  inspected:            { label: 'Inspected',            group: 'inspection', icon: 'clipboard',meaning: 'The site was visited and findings recorded.',                    who: 'Government officer',  next: 'Decide on repair work',                   slaDays: 5 },
  work_planned:         { label: 'Work Planned',         group: 'planned',    icon: 'tools',    meaning: 'Repair work has been approved.',                                 who: 'Responsible agency',  next: 'A team and dates get booked',             slaDays: 7 },
  scheduled:            { label: 'Scheduled',            group: 'planned',    icon: 'calendar', meaning: 'A team and dates are set for the work.',                         who: 'Field team',          next: 'Work starts on site',                     slaDays: 0 },
  in_progress:          { label: 'In Progress',          group: 'active',     icon: 'hammer',   meaning: 'Work is happening on site.',                                     who: 'Field team',          next: 'Work is completed',                       slaDays: 0 },
  completed:            { label: 'Completed',            group: 'done',       icon: 'sparkle',  meaning: 'The team says it is fixed and shared photos.',                   who: 'You and your neighbours', next: 'Confirm whether it is really fixed', slaDays: 14 },
  monitoring:           { label: 'Monitoring',           group: 'done',       icon: 'eye',      meaning: 'Citizens confirmed the fix. We keep watching that it holds.',    who: 'Community',           next: 'Closed after 14 days',                    slaDays: 14 },
  reopened:             { label: 'Reopened',             group: 'attention',  icon: 'refresh',  meaning: 'Citizens say the problem remains. It is back under review.',      who: 'Government officer',  next: 'Re-inspection',                           slaDays: 3 },
  unable:               { label: 'Unable to Proceed',    group: 'blocked',    icon: 'pause',    meaning: 'Action cannot happen right now. The reason is always shown.',    who: 'Government officer',  next: 'See explanation',                         slaDays: 0 },
};

// The visible journey for the progress tracker.
export const JOURNEY = ['reported', 'verified', 'assigned', 'inspection_scheduled', 'inspected', 'work_planned', 'scheduled', 'in_progress', 'completed', 'monitoring'];

export const GROUPS = {
  new:        { label: 'Needs attention',   color: 'var(--st-new)' },
  confirmed:  { label: 'Verified',          color: 'var(--st-confirmed)' },
  inspection: { label: 'Being inspected',   color: 'var(--st-inspection)' },
  planned:    { label: 'Work scheduled',    color: 'var(--st-planned)' },
  active:     { label: 'Work in progress',  color: 'var(--st-active)' },
  done:       { label: 'Recently fixed',    color: 'var(--st-done)' },
  attention:  { label: 'Reopened',          color: 'var(--st-attention)' },
  blocked:    { label: 'Unable to proceed', color: 'var(--st-blocked)' },
};

export function journeyIndex(status) {
  if (status === 'under_review') return 0;
  if (status === 'reopened') return JOURNEY.indexOf('completed') - 1;
  return JOURNEY.indexOf(status);
}

export const SEVERITY = {
  low:      { label: 'Low',                   tone: 'low' },
  moderate: { label: 'Moderate',              tone: 'moderate' },
  serious:  { label: 'Serious',               tone: 'serious' },
  urgent:   { label: 'Urgent safety concern', tone: 'urgent' },
};

export const REJECT_REASONS = {
  duplicate:        { label: 'Duplicate',                       friendly: 'Someone already reported this. We linked your report to the existing one so your voice still counts.' },
  insufficient:     { label: 'Insufficient information',        friendly: 'We could not confirm the problem from the details given. Adding a photo or a nearby landmark helps a lot.' },
  private_property: { label: 'Private property issue',          friendly: 'This looks like it is on private property, so a government agency cannot fix it.' },
  wrong_location:   { label: 'Incorrect location',              friendly: 'The pin did not match what we found. Please report again with the correct location.' },
  not_gov:          { label: 'Not government responsibility',   friendly: 'This is not something a public authority handles. We have explained who usually does.' },
  no_longer:        { label: 'Issue no longer exists',          friendly: 'When we checked, the problem had already been sorted. Thank you for looking out.' },
  spam:             { label: 'Spam',                            friendly: 'This report did not describe a public infrastructure issue.' },
  outside:          { label: 'Outside jurisdiction',            friendly: 'This location is outside the areas currently on NaijaWorks.' },
};

export const INSPECTION_OUTCOMES = {
  none:        { label: 'No action required',         public: 'Inspection complete. No repair is needed right now.' },
  maintenance: { label: 'Maintenance required',       public: 'Inspection complete. Routine maintenance is needed.' },
  repair:      { label: 'Repair required',            public: 'Inspection complete. A repair is needed.' },
  replacement: { label: 'Replacement required',       public: 'Inspection complete. The damaged part needs replacing.' },
  major:       { label: 'Major project required',     public: 'Inspection complete. This needs a larger project.' },
  emergency:   { label: 'Emergency intervention',     public: 'Inspection complete. Emergency work is being arranged.' },
  transfer:    { label: 'Transfer to another authority', public: 'Inspection complete. Another authority is responsible.' },
};

export const WORK_ORDER_STATUS = ['draft', 'awaiting_approval', 'approved', 'scheduled', 'in_progress', 'paused', 'completed', 'cancelled'];

export const PROGRESS_STAGES = [
  { key: 'started', label: 'Work started', pct: 10 },
  { key: 'quarter', label: 'Early work done', pct: 25 },
  { key: 'half',    label: 'About halfway', pct: 50 },
  { key: 'nearly',  label: 'Nearly done', pct: 75 },
];
