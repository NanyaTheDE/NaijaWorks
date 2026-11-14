// Report categories shown in step 1 of the report flow.
export const CATEGORIES = [
  { key: 'road',        label: 'Road',                 icon: 'road',      hue: '#E8A33D', hint: 'Potholes, bad roads, erosion, unsafe roads', subtypes: ['Pothole', 'Road failure', 'Erosion', 'Missing road sign', 'Damaged bridge'] },
  { key: 'water',       label: 'Water',                icon: 'droplet',   hue: '#2B8FD6', hint: 'No public water, burst pipes, leaks',          subtypes: ['No public water', 'Burst pipe', 'Leak', 'Broken borehole'] },
  { key: 'electricity', label: 'Electricity',          icon: 'bolt',      hue: '#F5B301', hint: 'Fallen poles, transformers, exposed cables',   subtypes: ['Exposed cable', 'Fallen pole', 'Faulty transformer', 'Long outage'] },
  { key: 'streetlight', label: 'Streetlight',          icon: 'lamp',      hue: '#9B6BF0', hint: 'Broken lights or dark streets',                 subtypes: ['Broken light', 'No streetlights', 'Flickering'] },
  { key: 'drainage',    label: 'Drainage',             icon: 'waves',     hue: '#1A9E8F', hint: 'Blocked gutters, open manholes, sewage',       subtypes: ['Blocked drain', 'Open manhole', 'Sewage overflow', 'Collapsed drain'] },
  { key: 'flooding',    label: 'Flooding',             icon: 'cloudrain', hue: '#3B6FD9', hint: 'Streets or homes under water',                  subtypes: ['Street flooding', 'Severe flooding'] },
  { key: 'waste',       label: 'Waste',                icon: 'trash',     hue: '#6B8E23', hint: 'Refuse heaps, illegal dumping',                 subtypes: ['Uncollected refuse', 'Illegal dumping'] },
  { key: 'building',    label: 'Public Building',      icon: 'building',  hue: '#B5651D', hint: 'Damaged or unsafe public buildings',            subtypes: ['Damaged building', 'Collapsed structure'] },
  { key: 'transport',   label: 'Public Transport',     icon: 'bus',       hue: '#D1495B', hint: 'Bus stops, shelters, terminals',                subtypes: ['Damaged bus stop', 'Unsafe terminal'] },
  { key: 'safety',      label: 'Safety Infrastructure',icon: 'shield',    hue: '#E2572B', hint: 'Traffic lights, guard rails, crossings',        subtypes: ['Broken traffic light', 'Unsafe crossing', 'Damaged sidewalk'] },
  { key: 'school',      label: 'School',               icon: 'school',    hue: '#2F9E44', hint: 'Public schools needing repair',                 subtypes: ['Leaking roof', 'Broken classrooms', 'No toilets'] },
  { key: 'health',      label: 'Health Centre',        icon: 'health',    hue: '#C2255C', hint: 'Primary health centres, clinics',               subtypes: ['Damaged facility', 'No water/power'] },
  { key: 'environment', label: 'Environment',          icon: 'leaf',      hue: '#37B24D', hint: 'Erosion, gullies, fallen trees',                subtypes: ['Gully erosion', 'Fallen tree'] },
  { key: 'space',       label: 'Public Space',         icon: 'park',      hue: '#12B886', hint: 'Parks, markets, playgrounds',                   subtypes: ['Park maintenance', 'Market facilities'] },
  { key: 'abandoned',   label: 'Stalled Project',      icon: 'crane',     hue: '#868E96', hint: 'Abandoned or stalled public projects',          subtypes: ['Abandoned project', 'Stalled project'] },
  { key: 'other',       label: 'Other',                icon: 'dots',      hue: '#495057', hint: 'Something else public',                         subtypes: ['Other'] },
];

export const categoryByKey = (k) => CATEGORIES.find((c) => c.key === k) || CATEGORIES[CATEGORIES.length - 1];

// Subtypes that trigger the emergency banner.
export const URGENT_SUBTYPES = ['Damaged bridge', 'Road failure', 'Exposed cable', 'Fallen pole', 'Open manhole', 'Severe flooding', 'Collapsed structure', 'Collapsed drain'];
