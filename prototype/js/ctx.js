// Shared UI context: ephemeral view state + helpers. Kept separate from repo (domain state).
import { icon } from './ui/icons.js';

export const ui = {
  homeFilter: null,
  exploreFilter: { status: 'all', category: null, q: '' }, mapSel: null, exploreView: 'map',
  myTab: 'active', reportStep: 0, draft: null, dupDismissed: false,
  gov: { tab: 'new', q: '' }, inspectorTab: 'today', teamTab: 'assigned',
  inspection: {}, modal: null,
};

let rerenderFn = () => {};
export const setRerender = (fn) => (rerenderFn = fn);
export const rerender = () => rerenderFn();
export const go = (hash) => { if (location.hash === hash) rerender(); else location.hash = hash; };

export function toast(msg, ic = 'check') {
  const wrap = document.querySelector('.toast-wrap');
  const el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status');
  el.innerHTML = `${icon(ic, 18)}<span>${msg}</span>`; wrap.appendChild(el); setTimeout(() => el.remove(), 3200);
}

export function openModal(html) { ui.modal = html; document.getElementById('modal-root').innerHTML = html; document.querySelector('.modal')?.querySelector('button, input, select, textarea')?.focus(); }
export function closeModal() { ui.modal = null; document.getElementById('modal-root').innerHTML = ''; }

export function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = document.createElement('div'); box.className = 'confetti';
  const colors = ['#0B7A4B', '#F5B301', '#34C285', '#E2572B', '#4F46E5', '#FFFFFF'];
  box.innerHTML = Array.from({ length: 80 }, (_, i) => `<i style="left:${Math.random() * 100}%;background:${colors[i % colors.length]};animation-delay:${Math.random() * .6}s;transform:rotate(${Math.random() * 360}deg)"></i>`).join('');
  document.body.appendChild(box); setTimeout(() => box.remove(), 3200);
}

export const formData = (form) => Object.fromEntries(new FormData(form).entries());
export const isoInDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
