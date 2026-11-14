// i18n: components use keys. Add a language by adding a dictionary (e.g. yo, ig, ha) — missing keys fall back to English.
import { repo } from './api/repo.js';

const en = {
  'nav.home': 'Home', 'nav.explore': 'Explore', 'nav.report': 'Report', 'nav.mine': 'My Reports', 'nav.community': 'Community',
  'home.greet.morning': 'Good morning', 'home.greet.afternoon': 'Good afternoon', 'home.greet.evening': 'Good evening',
  'home.hero.title': 'Spotted something that needs fixing?', 'home.hero.body': 'Report it in under 2 minutes. We find who is responsible and keep you updated.',
  'home.cta': 'Report an issue', 'home.search': 'Search street, landmark or report number',
  'home.near': 'Around you', 'home.fixed': 'Recently fixed', 'home.work': 'Being worked on', 'home.ann': 'Announcements', 'home.tips': 'Did you know?',
  'report.step1': 'What is the problem?', 'report.step2': 'Show us what happened', 'report.step3': 'Where is it?', 'report.step4': 'Tell us a bit more', 'report.step5': 'Check and send',
  'report.continue': 'Continue', 'report.submit': 'Submit report', 'report.skip': 'Skip for now',
};
const pcm = {
  'nav.home': 'Home', 'nav.explore': 'Waka', 'nav.report': 'Report', 'nav.mine': 'My Report', 'nav.community': 'Area',
  'home.greet.morning': 'Good morning o', 'home.greet.afternoon': 'Good afternoon o', 'home.greet.evening': 'Good evening o',
  'home.hero.title': 'You see something wey need fixing?', 'home.hero.body': 'Report am for under 2 minutes. We go find who suppose fix am, we go dey update you.',
  'home.cta': 'Report wahala', 'home.search': 'Find street, place or report number',
  'home.near': 'For your area', 'home.fixed': 'Dem don fix am', 'home.work': 'Work dey go on', 'home.ann': 'Announcement', 'home.tips': 'You know say?',
  'report.step1': 'Wetin be the problem?', 'report.step2': 'Show us wetin happen', 'report.step3': 'Where e dey?', 'report.step4': 'Tell us small more', 'report.step5': 'Check am, then send',
  'report.continue': 'Continue', 'report.submit': 'Send report', 'report.skip': 'Skip am for now',
};
const dicts = { en, pcm };
export const LOCALES = [{ key: 'en', label: 'English' }, { key: 'pcm', label: 'Naija Pidgin' }];
export const t = (k) => (dicts[repo.state.prefs.locale] || en)[k] ?? en[k] ?? k;
