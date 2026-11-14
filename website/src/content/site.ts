// All marketing copy and demo numbers live here, not in components, so a CMS or the
// NaijaWorks public-data API can replace this file without touching the UI.
// Names, streets and figures are fictional illustrations.

/** Where the NaijaWorks app lives. Set NEXT_PUBLIC_APP_URL once the app is deployed;
 *  until then, app links go to the on-site "launching soon" page. */
export const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? '').replace(/\/$/, '');
export const appUrl = (path: string) => (APP_URL ? `${APP_URL}${path}` : `/launching?to=${encodeURIComponent(path)}`);

export type Lang = 'en' | 'pcm';

export const NAV = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/who-handles-what', label: 'Who handles what' },
  { href: '/impact', label: 'Impact' },
  { href: '/for-government', label: 'For government' },
] as const;

export const HERO = {
  en: { kicker: 'Civic infrastructure, in the open', title: ['See it.', 'Report it.', 'Watch it get fixed.'], body: 'Snap a pothole, a dead streetlight or a blocked drain. NaijaWorks finds who is responsible, and you follow every step until it is fixed, like tracking a parcel.' },
  pcm: { kicker: 'Wetin spoil for street, make e for public eye', title: ['See am.', 'Report am.', 'Watch dem fix am.'], body: 'Snap the pothole, the light wey no dey work or the gutter wey block. NaijaWorks go find who suppose fix am, and you go follow am step by step until e correct, like say you dey track parcel.' },
};

export const FOUR_QUESTIONS = [
  { q: 'What is wrong?', a: 'Pick a category, add a photo, drop a pin. Done in about two minutes.', icon: 'camera', tone: 'sun' },
  { q: 'Who is responsible?', a: 'We route it to the right LGA, state agency, federal body or utility. You never need to know which.', icon: 'building', tone: 'brand' },
  { q: 'What is happening now?', a: 'Every report has a live status and a timeline of what officials have actually done.', icon: 'eye', tone: 'sky' },
  { q: 'When is the next step?', a: 'Each stage shows the next expected action and a date, and delays must come with a reason.', icon: 'calendar', tone: 'clay' },
] as const;

export const CATEGORIES = [
  { label: 'Potholes', icon: 'road' }, { label: 'Streetlights', icon: 'lamp' }, { label: 'Blocked drains', icon: 'waves' },
  { label: 'Flooding', icon: 'cloudrain' }, { label: 'No public water', icon: 'droplet' }, { label: 'Waste & dumping', icon: 'trash' },
  { label: 'Electricity', icon: 'bolt' }, { label: 'Bus stops', icon: 'bus' }, { label: 'Schools', icon: 'school' },
  { label: 'Health centres', icon: 'health' }, { label: 'Erosion', icon: 'leaf' }, { label: 'Open manholes', icon: 'alert' },
  { label: 'Public parks', icon: 'park' }, { label: 'Abandoned projects', icon: 'crane' }, { label: 'Traffic lights', icon: 'target' },
];

/** The citizen-facing journey, used by the hero tracker demo and How it works. */
export const JOURNEY = [
  { key: 'reported', label: 'Reported', date: '12 Nov', icon: 'flag', text: 'Amaka reported a deep pothole on Adeola Street with 2 photos.', who: 'Citizen' },
  { key: 'verified', label: 'Verified', date: '13 Nov', icon: 'shield', text: '23 neighbours confirmed it. Location checked by the triage team.', who: 'NaijaWorks triage' },
  { key: 'assigned', label: 'Assigned', date: '14 Nov', icon: 'building', text: 'Sent to Lagos State Public Works: Adeola Street is state-managed.', who: 'Routing engine' },
  { key: 'inspection', label: 'Inspected', date: '18 Nov', icon: 'clipboard', text: 'Inspector visited. Outcome: resurfacing needed across 40 metres.', who: 'Field inspector' },
  { key: 'scheduled', label: 'Repair scheduled', date: '27 Nov', icon: 'calendar', text: 'Repair crew booked for 30 Nov. Target completion 2 Dec.', who: 'Works department' },
  { key: 'progress', label: 'Work in progress', date: '30 Nov', icon: 'hammer', text: 'Work has started. Crew uploaded 3 progress photos.', who: 'Maintenance team' },
  { key: 'fixed', label: 'Fixed', date: '2 Dec', icon: 'check', text: 'Completed with photo evidence. 41 residents confirmed it is fixed.', who: 'Community' },
] as const;

export const STATUSES = [
  { name: 'Reported', group: 'new', meaning: 'Your report is in and has a reference number.', who: 'You', next: 'A quick check that it is real and in the right place.' },
  { name: 'Under review', group: 'new', meaning: 'The triage team is checking location, photos and duplicates.', who: 'NaijaWorks triage', next: 'Verified, or a friendly request for more detail.' },
  { name: 'Verified', group: 'confirmed', meaning: 'Confirmed as a real public infrastructure problem.', who: 'NaijaWorks triage', next: 'Routed to the authority responsible.' },
  { name: 'Assigned', group: 'confirmed', meaning: 'An LGA, state agency, federal body or utility now owns it.', who: 'Responsible authority', next: 'An inspection is booked.' },
  { name: 'Inspection scheduled', group: 'inspection', meaning: 'A field inspector has a date to visit.', who: 'Field inspector', next: 'Site visit with photos, GPS and notes.' },
  { name: 'Inspected', group: 'inspection', meaning: 'The site was checked and the needed work written up.', who: 'Field inspector', next: 'A decision on what work to do.' },
  { name: 'Work planned', group: 'planned', meaning: 'Work is approved and a team or contractor is picked.', who: 'Government department', next: 'A start date.' },
  { name: 'Scheduled', group: 'planned', meaning: 'A crew has a start date and a target finish date.', who: 'Contractor or works team', next: 'Work starts.' },
  { name: 'In progress', group: 'active', meaning: 'Crew is on site. Progress photos are shared.', who: 'Contractor or works team', next: 'Completion with photo evidence.' },
  { name: 'Completed', group: 'done', meaning: 'Marked done, with completion photos and a note.', who: 'Government department', next: 'Neighbours confirm whether it is really fixed.' },
  { name: 'Monitoring', group: 'done', meaning: 'Fixed and being watched in case it comes back.', who: 'Community', next: 'Closed, or reopened if it fails again.' },
  { name: 'Reopened', group: 'attention', meaning: 'Several people said the problem remains.', who: 'Government department', next: 'A fresh review of the work.' },
  { name: 'Unable to proceed', group: 'blocked', meaning: 'Something blocks the work. The reason is always shown.', who: 'Government department', next: 'An update when the blocker clears.' },
] as const;

export const GROUP_COLOR: Record<string, string> = {
  new: '#5B6B7F', confirmed: '#4F46E5', inspection: '#8B5CF6', planned: '#C77700', active: '#0284C7', done: '#15803D', attention: '#D9481F', blocked: '#78716C',
};

export const LEVELS = [
  { key: 'federal', name: 'Federal', color: '#4F46E5', icon: 'globe', blurb: 'Big national roads and bridges, plus regulators.', items: ['Federal highways and trunk roads', 'Major bridges on federal roads', 'Rules for the electricity sector (NERC)', 'National agencies for flooding and erosion'] },
  { key: 'state', name: 'State', color: '#0B7A4B', icon: 'building', blurb: 'Most busy city roads, drainage channels and state water.', items: ['State roads and major streets', 'Primary drainage channels', 'Public water supply in many states', 'Streetlights on state roads', 'State schools and hospitals'] },
  { key: 'lga', name: 'Local Government', color: '#C77700', icon: 'home', blurb: 'The closest government to you: local streets and services.', items: ['Local and estate roads', 'Waste collection in many areas', 'Small drains and gutters', 'Markets, motor parks and primary health centres', 'Primary schools (with the state)'] },
  { key: 'utility', name: 'Utilities', color: '#0284C7', icon: 'bolt', blurb: 'Companies that run power and some water services.', items: ['Electricity distribution companies (DisCos)', 'Fallen poles, exposed cables, faulty transformers', 'Water boards and utility corporations'] },
] as const;

/** "Who fixes this?" explainer. Simplified: the real routing engine also checks road ownership and service areas. */
export const ROUTES = [
  { icon: 'road', label: 'Pothole on a big city road', level: 'state', example: 'Lagos State Public Works', why: 'Most major city roads are owned by the state, so state works teams repair them.' },
  { icon: 'road', label: 'Pothole on a small estate street', level: 'lga', example: 'Surulere LGA Works', why: 'Small local streets usually belong to the Local Government.' },
  { icon: 'road', label: 'Crack on a federal highway', level: 'federal', example: 'Federal Roads Maintenance Agency', why: 'Highways that link states are federal roads.' },
  { icon: 'lamp', label: 'Streetlight not working', level: 'state', example: 'State Electricity Board / LGA', why: 'It depends on the road. We check who owns that road and send it there.' },
  { icon: 'bolt', label: 'Fallen electricity pole', level: 'utility', example: 'Your electricity distribution company', why: 'Poles, cables and transformers belong to the DisCo that serves your area.' },
  { icon: 'trash', label: 'Refuse not collected', level: 'lga', example: 'LGA / State Waste Agency', why: 'Waste collection is often run by the LGA or a state waste agency.' },
  { icon: 'waves', label: 'Blocked drainage channel', level: 'state', example: 'State Drainage Services', why: 'Large channels are state-managed. Small gutters are often LGA.' },
  { icon: 'droplet', label: 'Public tap dry for weeks', level: 'state', example: 'State Water Corporation', why: 'Public water supply is usually run by a state water board.' },
] as const;

export const STATS = [
  { value: 12480, label: 'Issues reported', context: 'Potholes, drains, streetlights, water and more, across 6 pilot states.', suffix: '' },
  { value: 7215, label: 'Fixed and confirmed', context: 'Closed with completion photos and a yes from neighbours.', suffix: '' },
  { value: 6, label: 'Days to first inspection', context: 'Median time from report to an inspector on site.', suffix: '' },
  { value: 1.9, label: 'Residents affected', context: 'People living near the issues that were fixed.', suffix: 'M', decimals: 1 },
];

export const IMPACT_TILES = [
  { icon: 'road', value: 1840, label: 'Roads repaired', tone: '#0B7A4B' },
  { icon: 'lamp', value: 2310, label: 'Streetlights restored', tone: '#C77700' },
  { icon: 'waves', value: 960, label: 'Drains cleared', tone: '#0284C7' },
  { icon: 'droplet', value: 412, label: 'Water issues resolved', tone: '#4F46E5' },
  { icon: 'trash', value: 1385, label: 'Dumpsites cleared', tone: '#D9481F' },
  { icon: 'users', value: 318, label: 'Communities reached', tone: '#8B5CF6' },
];

export const STORIES = [
  { before: 'road-work', after: 'road-fixed', place: 'Adeola Street, Surulere', title: 'A 40-metre pothole stretch, resurfaced', days: 20, confirmations: 41, authority: 'Lagos State Public Works' },
  { before: 'streetlight', after: 'streetlight-fixed', place: 'Allen Avenue, Ikeja', title: '9 dark streetlights back on', days: 11, confirmations: 63, authority: 'Lagos State Electricity Board' },
  { before: 'drainage', after: 'drainage-fixed', place: 'Ogui Road, Enugu', title: 'Flooded drain cleared and covered', days: 16, confirmations: 28, authority: 'Enugu Capital Territory Dev. Authority' },
  { before: 'waste', after: 'waste-fixed', place: 'Wuse Market, Abuja', title: 'Illegal dumpsite cleared, bins installed', days: 8, confirmations: 35, authority: 'AEPB Abuja' },
] as const;

export const QUOTES = [
  { text: 'I reported the streetlight in March and could see every step. When they fixed it, I got a message before I even got home.', name: 'Chiamaka', area: 'Ikeja, Lagos' },
  { text: 'Before, we would complain on WhatsApp and nothing happened. Now our CDA shows the timeline at every meeting.', name: 'Alhaji Musa', area: 'Community rep, Kaduna North' },
  { text: 'Inspection used to be paper and memory. Now photos, GPS and time are recorded on site and go straight to the work order.', name: 'Engr. Bisi', area: 'Field inspector, Oyo State' },
] as const;

export const BADGES = [
  { name: 'First Reporter', icon: 'flag', how: 'Your first verified report' },
  { name: 'Neighbourhood Helper', icon: 'hand', how: 'Added useful evidence to others’ reports' },
  { name: 'Community Observer', icon: 'binoculars', how: 'Confirmed repairs were really done' },
  { name: 'Infrastructure Watcher', icon: 'eye', how: 'Kept old reports up to date' },
  { name: 'Local Champion', icon: 'star', how: 'Reports that helped 1,000+ people' },
] as const;

export const GOV_FEATURES = [
  { icon: 'inbox', title: 'A triage queue, not a complaint inbox', body: 'Reports arrive routed, de-duplicated and ranked by safety risk and people affected, not by how loud they are.' },
  { icon: 'clipboard', title: 'Inspections with proof', body: 'Assign inspectors, book time windows, and get photos, GPS and timestamps captured on site from a mobile app that works offline.' },
  { icon: 'wrench', title: 'Work orders end to end', body: 'Approve work, set budgets and funding sources internally, assign contractors or in-house teams, and track progress.' },
  { icon: 'refresh', title: 'Transparent transfers', body: 'Wrong department? Transfer it with a reason. Citizens see "Transferred to State Works because the road is state-managed".' },
  { icon: 'chart', title: 'Analytics for planning', body: 'Hotspots, recurring failures, seasonal flooding patterns and contractor performance, so maintenance becomes proactive.' },
  { icon: 'shield', title: 'Audit log on every action', body: 'Who verified, assigned, approved and closed each report is recorded. Internal notes stay internal.' },
] as const;

export const PIPELINE = [
  { label: 'New', count: 42, sub: '6 urgent', color: '#5B6B7F' },
  { label: 'Verified', count: 31, sub: '9 to assign', color: '#4F46E5' },
  { label: 'Inspection', count: 27, sub: '4 due today', color: '#8B5CF6' },
  { label: 'Work', count: 58, sub: '3 overdue', color: '#C77700' },
  { label: 'Done', count: 214, sub: 'this month', color: '#15803D' },
] as const;

export const BY_CATEGORY = [
  { label: 'Roads', value: 128 }, { label: 'Drainage', value: 94 }, { label: 'Streetlights', value: 71 }, { label: 'Waste', value: 56 }, { label: 'Water', value: 38 }, { label: 'Other', value: 21 },
];

export const PRINCIPLES = [
  { icon: 'lock', title: 'Your identity, your choice', body: 'Show your first name, appear as "community member", or stay private. Phone numbers and home addresses are never public.' },
  { icon: 'shield', title: 'Severity beats popularity', body: 'An open manhole with 2 reports outranks a cosmetic issue with 200. Confirmations measure impact, they are not votes.' },
  { icon: 'check', title: 'No fix without proof', body: 'Work cannot be marked complete without completion photos, a date and a note. Then neighbours confirm it.' },
  { icon: 'users', title: 'Built for contribution, not comments', body: 'Structured actions like "I’m affected too" and "Add evidence" instead of open comment threads. No political campaigning.' },
] as const;

export const ACCESS = [
  { icon: 'globe', title: 'English & Naija Pidgin', body: 'More Nigerian languages can be added without redesigning anything.' },
  { icon: 'wifi', title: 'Low-data mode', body: 'Compressed photos, a text-first view and a simple list instead of a heavy map.' },
  { icon: 'upload', title: 'Works offline', body: 'Save a draft without network. It sends itself when your connection returns.' },
  { icon: 'eye', title: 'Easy to see and tap', body: 'Large tap areas, high contrast, clear icons and screen reader labels.' },
] as const;

export const FAQ = [
  { q: 'Do I need to know which government office to contact?', a: 'No. That is our job. Pick what is wrong and where. NaijaWorks works out whether it belongs to your LGA, the state, a federal agency or a utility, and shows you who it was sent to.' },
  { q: 'Is it free?', a: 'Yes, reporting and tracking are free for citizens. The app is designed to use very little data.' },
  { q: 'Will my name or phone number be public?', a: 'Only if you choose to show your first name. Phone numbers, home addresses and ID documents are never shown on public reports. Officials may contact you privately for follow-up.' },
  { q: 'What if someone already reported the same problem?', a: 'We show you matching reports nearby. Tap "I’m affected too" or add a photo. Your confirmation adds weight to the existing report instead of creating a duplicate.' },
  { q: 'What if they say it is fixed but it is not?', a: 'Nearby residents are asked "Has this actually been fixed?". If several credible people say no, the report moves to "Resolution under review" and goes back to the department.' },
  { q: 'Is this for emergencies?', a: 'No. If someone’s life is in danger, call the emergency services first. You can still mark a report as a potential urgent safety risk so it is triaged faster.' },
  { q: 'Can I report an abandoned government project?', a: 'Yes. There is a specific report type for stalled or abandoned public projects, including how long work has appeared stopped and the impact on your community.' },
] as const;
