// Seed data — fictional Nigerian streets, officers and reports. Only the mock adapter imports this.
export const TODAY = new Date('2026-11-14T10:00:00+01:00');
const d = (daysAgo, h = 10) => { const x = new Date(TODAY); x.setDate(x.getDate() - daysAgo); x.setHours(h, (daysAgo * 7) % 60); return x.toISOString(); };
const f = (daysAhead) => d(-daysAhead);
const tl = (daysAgo, status, title, body, actor) => ({ at: d(daysAgo, 9 + (daysAgo % 8)), status, title, body, actor });

export const COMMUNITIES = [
  { slug: 'surulere', name: 'Surulere', lga: 'surulere', lgaName: 'Surulere LGA', state: 'Lagos', residents: 503000, center: { x: 46, y: 58 } },
  { slug: 'yaba',     name: 'Yaba',     lga: 'yaba',     lgaName: 'Yaba LCDA',    state: 'Lagos', residents: 290000, center: { x: 64, y: 40 } },
  { slug: 'ikeja',    name: 'Ikeja',    lga: 'ikeja',    lgaName: 'Ikeja LGA',    state: 'Lagos', residents: 470000, center: { x: 38, y: 18 } },
];

export const PEOPLE = {
  officer:   { id: 'u-off-1', name: 'Mrs. Funmilayo Adebayo', title: 'Senior Works Officer', agency: 'lspwc' },
  inspector: { id: 'u-ins-1', name: 'Engr. Chukwudi Okafor', title: 'Field Inspector', agency: 'lspwc' },
  inspector2:{ id: 'u-ins-2', name: 'Halima Bello', title: 'Field Inspector', agency: 'surulere' },
  inspector3:{ id: 'u-ins-3', name: 'Tunde Akinola', title: 'Field Inspector', agency: 'lsmoe' },
  citizen:   { id: 'u-cit-1', name: 'Adaeze', fullName: 'Adaeze Nwosu', community: 'surulere', points: 145, joined: d(210) },
};

export const CONTRACTORS = [
  { id: 'c-1', name: 'Ọ̀nà Roads & Civil Ltd', kind: 'contractor', speciality: 'Road repair' },
  { id: 'c-2', name: 'LSPWC Rapid Response Team B', kind: 'internal', speciality: 'Potholes & patching' },
  { id: 'c-3', name: 'Clearwater Drainage Services', kind: 'contractor', speciality: 'Drainage & desilting' },
  { id: 'c-4', name: 'Brightway Electrical Works', kind: 'contractor', speciality: 'Streetlights' },
];

export const REPORTS = [
  {
    ref: 'NW-LA-7Q3K2D', category: 'road', subtype: 'Pothole', title: 'Deep potholes outside Adeola Street junction',
    description: 'Three deep potholes right at the junction. Keke and cars swerve into the opposite lane. Water collects inside when it rains.',
    street: 'Adeola Street', landmark: 'Opposite Mama Cass eatery', community: 'surulere', lga: 'surulere', pos: { x: 44, y: 61 },
    severity: 'serious', validatedSeverity: 'serious', priority: 'high', status: 'in_progress', identity: 'first_name', reporterName: 'Adaeze', reporterId: 'u-cit-1',
    agency: 'surulere', routingState: 'Transferred', affected: 48, peopleImpacted: 1200, followers: ['u-cit-1'], createdAt: d(24),
    answers: { duration: 'More than 3 months', access: 'Yes', safety: 'Yes' },
    photos: [{ phase: 'before', scene: 'road' }, { phase: 'inspection', scene: 'road' }, { phase: 'progress', scene: 'road-work' }],
    inspection: { id: 'i-1', inspector: 'u-ins-2', date: d(17), window: '9am – 12pm', completedAt: d(17), outcome: 'repair', findings: 'Three potholes, 1.2m–2m wide, up to 25cm deep. Asphalt failure due to blocked roadside drain.', assessedSeverity: 'serious' },
    workOrder: 'WO-2611-014', eta: f(3),
    delay: { original: d(1), updated: f(3), reason: 'Work paused for two days due to heavy rainfall.' },
    timeline: [
      tl(24, 'reported', 'Issue reported', 'Reported by Adaeze with 2 photos.', 'Citizen'),
      tl(23, 'verified', 'Verified', 'Location confirmed by 12 community confirmations and photo evidence.', 'NaijaWorks review'),
      tl(23, 'assigned', 'Assigned to Lagos State Public Works', 'Routed automatically: road category in Surulere.', 'Routing engine'),
      tl(22, 'assigned', 'Transferred to Surulere LGA Works', 'Adeola Street is a local road managed by the local government.', 'LSPWC'),
      tl(20, 'inspection_scheduled', 'Inspection scheduled', 'Inspector visit set for 28 Oct, 9am – 12pm.', 'Surulere LGA'),
      tl(17, 'inspected', 'Inspection complete', 'The road needs patching and the roadside drain needs clearing.', 'Halima Bello, Inspector'),
      tl(14, 'work_planned', 'Repair approved', 'Pothole patching and drain clearing approved.', 'Surulere LGA'),
      tl(9, 'scheduled', 'Repair crew scheduled', 'Ọ̀nà Roads & Civil Ltd booked to start 5 Nov.', 'Surulere LGA'),
      tl(8, 'in_progress', 'Work started', 'Crew on site. Expect lane closure 8am – 4pm.', 'Ọ̀nà Roads & Civil Ltd'),
      tl(4, 'in_progress', 'Progress: about halfway', 'Two of three potholes patched. Drain clearing ongoing.', 'Ọ̀nà Roads & Civil Ltd'),
      tl(2, 'in_progress', 'Delay: rain', 'Work paused for two days due to heavy rainfall. New target: 17 Nov.', 'Surulere LGA'),
    ],
    progress: 50,
  },
  {
    ref: 'NW-LA-3MX81P', category: 'streetlight', subtype: 'Broken light', title: 'Streetlights out along Bode Thomas Street',
    description: 'About 8 poles in a row have no light. It is very dark after 7pm and people have been robbed here.',
    street: 'Bode Thomas Street', landmark: 'From Shoprite to the roundabout', community: 'surulere', lga: 'surulere', pos: { x: 50, y: 54 },
    severity: 'serious', validatedSeverity: 'serious', priority: 'high', status: 'scheduled', identity: 'community_member', reporterName: null,
    agency: 'surulere', routingState: 'Automatically assigned', affected: 132, peopleImpacted: 3400, followers: ['u-cit-1'], createdAt: d(16),
    photos: [{ phase: 'before', scene: 'streetlight' }],
    inspection: { id: 'i-2', inspector: 'u-ins-2', date: d(9), completedAt: d(9), outcome: 'replacement', findings: '8 lamp heads failed; 2 cable joints burnt.', assessedSeverity: 'serious' },
    workOrder: 'WO-2611-019', eta: f(6),
    timeline: [
      tl(16, 'reported', 'Issue reported', 'Reported by a community member.', 'Citizen'),
      tl(15, 'verified', 'Verified', '86 neighbours confirmed they are affected.', 'Surulere LGA'),
      tl(15, 'assigned', 'Assigned to Surulere LGA Works', 'Local street lighting.', 'Routing engine'),
      tl(12, 'inspection_scheduled', 'Inspection scheduled', 'Night inspection set for 5 Nov.', 'Surulere LGA'),
      tl(9, 'inspected', 'Inspection complete', 'The lamps need replacing and two cable joints need repair.', 'Halima Bello, Inspector'),
      tl(6, 'work_planned', 'Replacement approved', 'LED lamp heads to be installed.', 'Surulere LGA'),
      tl(3, 'scheduled', 'Work scheduled', 'Brightway Electrical Works starts 18 Nov. Expected done 20 Nov.', 'Surulere LGA'),
    ],
  },
  {
    ref: 'NW-LA-9DR4WA', category: 'drainage', subtype: 'Blocked drain', title: 'Blocked drainage flooding Ogunlana Drive',
    description: 'The big gutter is full of sand and plastic. Every rain the road floods up to the knee.',
    street: 'Ogunlana Drive', landmark: 'Near Ogunlana bus stop', community: 'surulere', lga: 'surulere', pos: { x: 38, y: 66 },
    severity: 'serious', priority: 'medium', status: 'inspection_scheduled', identity: 'private', reporterName: null,
    agency: 'lsmoe', routingState: 'Joint responsibility', affected: 64, peopleImpacted: 320, followers: [], createdAt: d(9),
    photos: [{ phase: 'before', scene: 'drainage' }],
    inspection: { id: 'i-3', inspector: 'u-ins-1', date: f(0), window: '10am – 1pm', instructions: 'Check the outfall at the canal end too. Citizens say the blockage starts there.' },
    eta: null,
    timeline: [
      tl(9, 'reported', 'Issue reported', 'Reported privately with 1 photo.', 'Citizen'),
      tl(8, 'verified', 'Verified', 'Matches 3 earlier flooding reports, now merged here.', 'Surulere LGA'),
      tl(8, 'assigned', 'Assigned jointly', 'Lagos State Ministry of Environment (primary channel) with Surulere LGA.', 'Routing engine'),
      tl(5, 'inspection_scheduled', 'Inspection scheduled', 'Inspector visit set for today, 10am – 1pm.', 'LASG Environment'),
    ],
  },
  {
    ref: 'NW-LA-5TB0HN', category: 'water', subtype: 'Burst pipe', title: 'Burst water pipe wasting water on Akerele',
    description: 'Clean water has been gushing out of a broken pipe for one week. The road is getting washed away.',
    street: 'Akerele Street', landmark: 'Beside the pharmacy', community: 'surulere', lga: 'surulere', pos: { x: 54, y: 63 },
    severity: 'moderate', priority: 'medium', status: 'assigned', identity: 'first_name', reporterName: 'Kunle',
    agency: 'lswc', routingState: 'Automatically assigned', affected: 21, peopleImpacted: 260, followers: [], createdAt: d(5),
    photos: [{ phase: 'before', scene: 'water' }],
    timeline: [
      tl(5, 'reported', 'Issue reported', 'Reported by Kunle with 1 photo.', 'Citizen'),
      tl(3, 'verified', 'Verified', 'Confirmed by photo and 21 neighbours.', 'NaijaWorks review'),
      tl(3, 'assigned', 'Assigned to Lagos Water Corporation', 'Public water pipes are run by the state water corporation.', 'Routing engine'),
    ],
  },
  {
    ref: 'NW-LA-2HC7VE', category: 'electricity', subtype: 'Exposed cable', title: 'Exposed live cable near primary school',
    description: 'A cable is hanging low from the pole near the school gate. Children pass here every morning.',
    street: 'Lawanson Road', landmark: 'Gate of Lawanson Primary School', community: 'surulere', lga: 'surulere', pos: { x: 33, y: 55 },
    severity: 'urgent', priority: 'urgent', status: 'under_review', identity: 'community_member', reporterName: null,
    agency: 'eko', supporting: 'nemsa', routingState: 'Automatically assigned', affected: 9, peopleImpacted: 900, followers: [], createdAt: d(0, 7), urgent: true,
    photos: [{ phase: 'before', scene: 'electricity' }],
    timeline: [
      tl(0, 'reported', 'Urgent issue reported', 'Marked as a potential safety risk by the reporter.', 'Citizen'),
      tl(0, 'under_review', 'Under urgent review', 'Sent to Eko DisCo and flagged to NEMSA for safety.', 'Routing engine'),
    ],
  },
  {
    ref: 'NW-LA-8PA6YC', category: 'road', subtype: 'Pothole', title: 'Pothole patched on Masha Road',
    description: 'Large pothole that damaged many cars.', street: 'Masha Road', landmark: 'Masha roundabout', community: 'surulere', lga: 'surulere', pos: { x: 57, y: 50 },
    severity: 'moderate', priority: 'medium', status: 'completed', identity: 'first_name', reporterName: 'Adaeze', reporterId: 'u-cit-1',
    agency: 'surulere', routingState: 'Automatically assigned', affected: 37, peopleImpacted: 640, followers: ['u-cit-1'], createdAt: d(40),
    photos: [{ phase: 'before', scene: 'road' }, { phase: 'after', scene: 'road-fixed' }],
    confirmations: { yes: 14, partial: 2, no: 0, unsure: 1 },
    completion: { at: d(3), note: 'Pothole excavated, base re-compacted and resurfaced with asphalt. Road markings restored.' },
    timeline: [
      tl(40, 'reported', 'Issue reported', 'Reported by Adaeze.', 'Citizen'),
      tl(38, 'verified', 'Verified', '', 'Surulere LGA'),
      tl(38, 'assigned', 'Assigned to Surulere LGA Works', '', 'Routing engine'),
      tl(33, 'inspection_scheduled', 'Inspection scheduled', '', 'Surulere LGA'),
      tl(30, 'inspected', 'Inspection complete', 'Needs excavation and resurfacing.', 'Halima Bello, Inspector'),
      tl(24, 'work_planned', 'Repair approved', '', 'Surulere LGA'),
      tl(10, 'scheduled', 'Work scheduled', '', 'Surulere LGA'),
      tl(7, 'in_progress', 'Work started', '', 'LSPWC Rapid Response Team B'),
      tl(3, 'completed', 'Repair completed', 'Completion photos uploaded. Is it really fixed? Tell us.', 'LSPWC Rapid Response Team B'),
    ],
  },
  {
    ref: 'NW-LA-4WS2LQ', category: 'waste', subtype: 'Illegal dumping', title: 'Refuse heap blocking Iponri market road',
    description: 'Huge heap of refuse has blocked half the road for weeks.', street: 'Iponri Market Road', landmark: 'Iponri market back gate', community: 'surulere', lga: 'surulere', pos: { x: 62, y: 70 },
    severity: 'moderate', priority: 'medium', status: 'monitoring', identity: 'first_name', reporterName: 'Bisi',
    agency: 'lawma', routingState: 'Automatically assigned', affected: 88, peopleImpacted: 2100, followers: [], createdAt: d(30),
    photos: [{ phase: 'before', scene: 'waste' }, { phase: 'after', scene: 'waste-fixed' }],
    confirmations: { yes: 41, partial: 3, no: 1, unsure: 2 },
    completion: { at: d(12), note: 'Refuse evacuated. Weekly collection added for this route.' },
    timeline: [
      tl(30, 'reported', 'Issue reported', '', 'Citizen'), tl(29, 'verified', 'Verified', '', 'LAWMA'), tl(29, 'assigned', 'Assigned to LAWMA', '', 'Routing engine'),
      tl(25, 'inspected', 'Inspection complete', 'Evacuation required, ~14 trucks.', 'LAWMA Inspector'), tl(22, 'work_planned', 'Evacuation approved', '', 'LAWMA'),
      tl(15, 'in_progress', 'Evacuation started', '', 'LAWMA'), tl(12, 'completed', 'Refuse cleared', '', 'LAWMA'), tl(9, 'monitoring', 'Fix confirmed by 41 residents', 'We will keep watching for 14 days.', 'Community'),
    ],
  },
  {
    ref: 'NW-LA-6KJ9RF', category: 'school', subtype: 'Leaking roof', title: 'Leaking roof at Aguda Junior School',
    description: 'Two classrooms cannot be used when it rains.', street: 'Aguda Road', landmark: 'Aguda Junior School', community: 'surulere', lga: 'surulere', pos: { x: 28, y: 48 },
    severity: 'moderate', priority: 'medium', status: 'work_planned', identity: 'community_member', reporterName: null,
    agency: 'lsubeb', routingState: 'Automatically assigned', affected: 19, peopleImpacted: 640, followers: [], createdAt: d(21),
    photos: [{ phase: 'before', scene: 'school' }],
    inspection: { id: 'i-6', inspector: 'u-ins-1', date: d(11), completedAt: d(11), outcome: 'repair', findings: 'Roofing sheets corroded over 2 classrooms.' },
    eta: f(20),
    timeline: [
      tl(21, 'reported', 'Issue reported', '', 'Citizen'), tl(19, 'verified', 'Verified', '', 'LASUBEB'), tl(19, 'assigned', 'Assigned to LASUBEB', '', 'Routing engine'),
      tl(14, 'inspection_scheduled', 'Inspection scheduled', '', 'LASUBEB'), tl(11, 'inspected', 'Inspection complete', 'Roofing sheets over 2 classrooms need replacing.', 'Inspector'),
      tl(6, 'work_planned', 'Roof repair approved', 'Expected start: early December, during the holiday.', 'LASUBEB'),
    ],
  },
  {
    ref: 'NW-LA-1YB5MT', category: 'road', subtype: 'Road failure', title: 'Road caving in on Herbert Macaulay Way',
    description: 'Part of the road edge is breaking off into the canal.', street: 'Herbert Macaulay Way', landmark: 'By Yaba bus stop', community: 'yaba', lga: 'yaba', pos: { x: 66, y: 36 },
    severity: 'urgent', priority: 'urgent', status: 'verified', identity: 'first_name', reporterName: 'Emeka',
    agency: 'lspwc', routingState: 'Automatically assigned', affected: 210, peopleImpacted: 15000, followers: [], createdAt: d(2), urgent: true,
    photos: [{ phase: 'before', scene: 'road' }],
    timeline: [ tl(2, 'reported', 'Urgent issue reported', '', 'Citizen'), tl(1, 'verified', 'Verified as urgent', 'Barriers requested while inspection is arranged.', 'LSPWC') ],
  },
  {
    ref: 'NW-LA-0NE3GX', category: 'flooding', subtype: 'Street flooding', title: 'Flooding at Alagomeji after every rain',
    description: 'Water stays for 2 days. Shops close.', street: 'Alagomeji Street', landmark: 'Alagomeji junction', community: 'yaba', lga: 'yaba', pos: { x: 70, y: 46 },
    severity: 'serious', priority: 'high', status: 'reported', identity: 'private', reporterName: null,
    agency: 'yaba', routingState: 'Needs routing review', affected: 5, peopleImpacted: 400, followers: [], createdAt: d(0, 8),
    photos: [{ phase: 'before', scene: 'drainage' }],
    timeline: [ tl(0, 'reported', 'Issue reported', 'Routing being checked: primary or secondary drain?', 'Citizen') ],
  },
  {
    ref: 'NW-LA-3GT8ZU', category: 'transport', subtype: 'Damaged bus stop', title: 'Collapsed bus shelter at Allen Avenue',
    description: 'The roof of the shelter fell in. People stand in the sun and rain.', street: 'Allen Avenue', landmark: 'Allen roundabout', community: 'ikeja', lga: 'ikeja', pos: { x: 42, y: 22 },
    severity: 'moderate', priority: 'low', status: 'reported', identity: 'first_name', reporterName: 'Zainab',
    agency: 'ikeja', routingState: 'Automatically assigned', affected: 12, peopleImpacted: 800, followers: [], createdAt: d(1),
    photos: [{ phase: 'before', scene: 'building' }],
    timeline: [ tl(1, 'reported', 'Issue reported', '', 'Citizen') ],
  },
  {
    ref: 'NW-LA-7VU1QS', category: 'streetlight', subtype: 'No streetlights', title: 'Streetlights restored on Opebi Road',
    description: 'Opebi had no lights for months.', street: 'Opebi Road', landmark: 'Opebi link bridge', community: 'ikeja', lga: 'ikeja', pos: { x: 48, y: 15 },
    severity: 'serious', priority: 'high', status: 'monitoring', identity: 'first_name', reporterName: 'Tolu',
    agency: 'lslights', routingState: 'Automatically assigned', affected: 160, peopleImpacted: 5200, followers: [], createdAt: d(50),
    photos: [{ phase: 'before', scene: 'streetlight' }, { phase: 'after', scene: 'streetlight-fixed' }],
    confirmations: { yes: 72, partial: 6, no: 2, unsure: 3 },
    completion: { at: d(18), note: '24 LED lamps installed.' },
    timeline: [ tl(50, 'reported', 'Issue reported', '', 'Citizen'), tl(30, 'in_progress', 'Work started', '', 'LSEB'), tl(18, 'completed', 'Lights restored', '', 'LSEB'), tl(14, 'monitoring', 'Fix confirmed by residents', '', 'Community') ],
  },
];

export const WORK_ORDERS = [
  { id: 'WO-2611-014', reportRef: 'NW-LA-7Q3K2D', department: 'Surulere LGA Works', contractor: 'c-1', scope: 'Patch 3 potholes (≈ 9 m²) and desilt 40 m of roadside drain.', priority: 'high', status: 'in_progress', start: d(8), target: f(3), originalTarget: d(1), estimate: 4850000, funding: 'LGA maintenance budget 2026', progress: 50,
    updates: [ { at: d(8), stage: 'started', note: 'Crew on site, area barricaded.' }, { at: d(4), stage: 'half', note: 'Two of three potholes patched.' } ] },
  { id: 'WO-2611-019', reportRef: 'NW-LA-3MX81P', department: 'Surulere LGA Works', contractor: 'c-4', scope: 'Replace 8 lamp heads with LED, repair 2 cable joints.', priority: 'high', status: 'scheduled', start: f(4), target: f(6), estimate: 2300000, funding: 'LGA streetlight fund', progress: 0, updates: [] },
];

export const PROJECTS = [
  { id: 'p-1', name: 'Bode Thomas Corridor Drainage Upgrade', community: 'surulere', agency: 'lsmoe', description: 'Rebuilding 1.4 km of covered drains along Bode Thomas and Adelabu to reduce flooding.', start: d(120), expected: f(90), stage: 4, latest: 'Culvert works are 60% done between Adelabu and Shoprite.', followers: 812,
    milestones: ['Inspection', 'Design assessment', 'Approval', 'Contractor assigned', 'Materials mobilisation', 'Construction started', 'Construction progress', 'Final inspection', 'Completed'] },
  { id: 'p-2', name: 'Yaba Streetlight Modernisation', community: 'yaba', agency: 'lslights', description: '320 solar-hybrid streetlights across Yaba inner roads.', start: d(60), expected: f(40), stage: 6, latest: '190 of 320 poles installed.', followers: 433,
    milestones: ['Inspection', 'Design assessment', 'Approval', 'Contractor assigned', 'Materials mobilisation', 'Construction started', 'Construction progress', 'Final inspection', 'Completed'] },
  { id: 'p-3', name: 'Ikeja Primary Health Centre Renovation', community: 'ikeja', agency: 'lsuhealth', description: 'Roof, water and solar power at Oregun PHC.', start: d(200), expected: d(20), stage: 5, latest: 'Work has slowed. Revised completion date to be announced.', followers: 128, stalled: true,
    milestones: ['Inspection', 'Design assessment', 'Approval', 'Contractor assigned', 'Materials mobilisation', 'Construction started', 'Construction progress', 'Final inspection', 'Completed'] },
];

export const ANNOUNCEMENTS = [
  { id: 'a-1', agency: 'lsmoe', kind: 'Drainage clearing', title: 'Drain desilting on Ogunlana Drive', body: 'Expect partial lane closure Mon 17 – Wed 19 Nov, 7am – 3pm.', community: 'surulere', at: d(1) },
  { id: 'a-2', agency: 'lswc', kind: 'Water maintenance', title: 'Low water pressure in Surulere', body: 'Pump maintenance at Adiyan plant on Saturday 22 Nov. Supply may be low 6am – 6pm.', community: 'surulere', at: d(2) },
  { id: 'a-3', agency: 'lslights', kind: 'Streetlight maintenance', title: 'Night maintenance on Ikorodu Road', body: 'Crews will work on lights from 10pm. Drive carefully.', community: 'yaba', at: d(3) },
];

export const NOTIFICATIONS = [
  { id: 'n-1', ref: 'NW-LA-7Q3K2D', kind: 'delay', title: 'Short delay on Adeola Street', body: 'Work paused for two days due to heavy rainfall. New target: 17 Nov.', at: d(2), read: false },
  { id: 'n-2', ref: 'NW-LA-8PA6YC', kind: 'completed', title: 'Good news — Masha Road is fixed', body: 'The team marked the pothole you reported as repaired. Is it really fixed?', at: d(3), read: false },
  { id: 'n-3', ref: 'NW-LA-3MX81P', kind: 'scheduled', title: 'Streetlight work scheduled', body: 'Brightway Electrical Works starts on Bode Thomas Street on 18 Nov.', at: d(3), read: true },
  { id: 'n-4', ref: 'NW-LA-7Q3K2D', kind: 'progress', title: 'Progress on Adeola Street', body: 'Two of three potholes patched.', at: d(4), read: true },
];

export const BADGES = [
  { key: 'first', label: 'First Reporter', desc: 'Your first report was verified', earned: true, icon: 'flag' },
  { key: 'helper', label: 'Neighbourhood Helper', desc: 'Added useful evidence to 3 reports', earned: true, icon: 'hand' },
  { key: 'verified', label: 'Verified Reporter', desc: '5 verified reports', earned: true, icon: 'check' },
  { key: 'observer', label: 'Community Observer', desc: 'Confirmed 5 completed repairs', earned: false, icon: 'eye', progress: 3, total: 5 },
  { key: 'watcher', label: 'Infrastructure Watcher', desc: 'Followed 10 issues to completion', earned: false, icon: 'binoculars', progress: 6, total: 10 },
  { key: 'champion', label: 'Local Champion', desc: 'Helped resolve 10 issues', earned: false, icon: 'star', progress: 5, total: 10 },
];
