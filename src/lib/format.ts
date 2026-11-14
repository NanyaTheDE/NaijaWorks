export function fmtDate(iso: string | undefined | null, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-NG', opts);
}

export function timeAgo(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  const d = Math.floor(s / 86400);
  return d < 7 ? `${d}d ago` : fmtDate(iso);
}

export const fmtN = (n: number) => n.toLocaleString('en-NG');
export const ngn = (n: number) => '₦' + Number(n || 0).toLocaleString('en-NG');
export const isoInDays = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
