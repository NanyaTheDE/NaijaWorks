import type { AgencyLevel } from './types';

export interface Agency { id: string; name: string; short: string; level: AgencyLevel }
export interface RoutingResult { primary: string; confidence: number; reason: string; level: AgencyLevel; supporting?: string }

// Responsible-authority routing engine. Pure function: (report draft, jurisdiction data) → assignment.
// Rules are ordered by specificity: road segment > LGA > state > federal > category default.

export const AGENCIES: Record<string, Agency> = {
  fmw:      { id: 'fmw',      name: 'Federal Ministry of Works (FERMA)',      short: 'FERMA',          level: 'federal' },
  lspwc:    { id: 'lspwc',    name: 'Lagos State Public Works Corporation',  short: 'LSPWC',          level: 'state' },
  lsmoe:    { id: 'lsmoe',    name: 'Lagos State Ministry of Environment',   short: 'LASG Environment', level: 'state' },
  lawma:    { id: 'lawma',    name: 'Lagos Waste Management Authority',      short: 'LAWMA',          level: 'state' },
  lswc:     { id: 'lswc',     name: 'Lagos Water Corporation',               short: 'Lagos Water',    level: 'state' },
  lslights: { id: 'lslights', name: 'Lagos State Electricity Board (Streetlights)', short: 'LSEB',     level: 'state' },
  lsuhealth:{ id: 'lsuhealth',name: 'Lagos Primary Health Care Board',       short: 'LSPHCB',         level: 'state' },
  lsubeb:   { id: 'lsubeb',   name: 'Lagos State Universal Basic Education Board', short: 'LASUBEB',   level: 'state' },
  surulere: { id: 'surulere', name: 'Surulere Local Government Works Dept.', short: 'Surulere LGA',   level: 'lga' },
  yaba:     { id: 'yaba',     name: 'Yaba LCDA Works Dept.',                 short: 'Yaba LCDA',      level: 'lga' },
  ikeja:    { id: 'ikeja',    name: 'Ikeja Local Government Works Dept.',    short: 'Ikeja LGA',      level: 'lga' },
  eko:      { id: 'eko',      name: 'Eko Electricity Distribution Company',  short: 'Eko DisCo',      level: 'utility' },
  ie:       { id: 'ie',       name: 'Ikeja Electric',                        short: 'Ikeja Electric', level: 'utility' },
  nemsa:    { id: 'nemsa',    name: 'NEMSA (Electricity safety regulator)',  short: 'NEMSA',          level: 'regulator' },
  triage:   { id: 'triage',   name: 'NaijaWorks Triage Desk',                short: 'Triage',         level: 'platform' },
};

export const LEVEL_EXPLAINER: Record<AgencyLevel, string> = {
  federal:   'Federal roads and highways that connect states are looked after by the Federal Government.',
  state:     'This appears to be managed by the state government.',
  lga:       'This may fall under your local government.',
  utility:   'This electricity issue goes to the distribution company that serves this area.',
  regulator: 'A regulator is notified because there may be a safety risk.',
  platform:  'We could not tell for sure who is responsible, so our triage team will route it.',
};

// Road ownership layer (fictional segments).
const ROAD_OWNERSHIP: Record<string, 'state' | 'federal'> = {
  'Ikorodu Road': 'state', 'Herbert Macaulay Way': 'state', 'Western Avenue': 'state', 'Funsho Williams Avenue': 'state',
  'Lagos–Ibadan Expressway': 'federal', 'Third Mainland Bridge': 'federal', 'Apapa–Oshodi Expressway': 'federal',
};

const DISCO_BY_LGA: Record<string, string> = { surulere: 'eko', yaba: 'eko', ikeja: 'ie' };

export function routeReport({ category, subtype, street = '', lga }: { category: string | null; subtype?: string | null; street?: string; lga: string }): RoutingResult {
  const roadLevel = Object.entries(ROAD_OWNERSHIP).find(([name]) => street.includes(name))?.[1];
  const res = (primary: string, confidence: number, reason: string, extra: { supporting?: string } = {}): RoutingResult => ({ primary, confidence, reason, level: AGENCIES[primary].level, ...extra });

  switch (category) {
    case 'road':
    case 'safety':
    case 'transport':
      if (roadLevel === 'federal') return res('fmw', 0.9, `${street} is a federal road.`);
      if (roadLevel === 'state') return res('lspwc', 0.9, `${street} is a state-managed road.`);
      return res(lga, 0.7, 'Local streets are usually maintained by the local government.');
    case 'drainage':
    case 'flooding':
      if (roadLevel) return res('lsmoe', 0.8, 'Primary drainage channels are handled by the state.');
      return res(lga, 0.65, 'Secondary drains on local streets are usually handled by the local government.', { supporting: 'lsmoe' });
    case 'waste': return res('lawma', 0.95, 'Waste collection in Lagos is handled by LAWMA.');
    case 'water': return res('lswc', 0.9, 'Public water supply is run by the state water corporation.');
    case 'electricity': {
      const disco = DISCO_BY_LGA[lga] || 'eko';
      const danger = ['Exposed cable', 'Fallen pole'].includes(subtype ?? '');
      return res(disco, 0.85, 'Electricity distribution is handled by the company serving this area.', danger ? { supporting: 'nemsa' } : {});
    }
    case 'streetlight':
      if (roadLevel) return res('lslights', 0.85, 'Streetlights on major roads are managed by the state.');
      return res(lga, 0.6, 'Streetlights on local streets are often handled by the local government.');
    case 'school': return res('lsubeb', 0.85, 'Public primary schools fall under the state basic education board.');
    case 'health': return res('lsuhealth', 0.85, 'Primary health centres are run by the state primary health care board.');
    case 'building':
    case 'space':
    case 'environment':
      return res(lga, 0.5, 'Usually local government, but this may need checking.');
    default:
      return res('triage', 0.2, 'Our triage team will work out who handles this.');
  }
}

export const assignmentState = (confidence: number): string =>
  confidence >= 0.75 ? 'Automatically assigned' : confidence >= 0.4 ? 'Needs routing review' : 'Triage queue';
