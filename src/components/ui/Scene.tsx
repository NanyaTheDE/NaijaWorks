// Flat illustrated "photos" used as evidence placeholders. Static, trusted SVG strings.
let uid = 0;
export function sceneSvg(name = 'road', { label }: { label?: string } = {}): string {
  const id = 's' + ++uid;
  const fixed = name.endsWith('-fixed');
  const base = name.replace('-fixed', '').replace('-work', '');
  const work = name.endsWith('-work');
  const night = base === 'streetlight';
  const sky = night ? ['#1B2747', '#34406B'] : ['#BFE3F2', '#F4E9D2'];
  const houses = ([
    [0, 70, 62, 70, '#E9C46A'], [58, 52, 70, 88, '#F2A65A'], [124, 80, 56, 60, '#8AB17D'], [176, 58, 74, 82, '#E76F51'], [246, 76, 74, 64, '#B8C0FF'],
  ] as [number, number, number, number, string][]).map(([x, y, w, h, c], i) => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${night ? shade(c) : c}"/>
    <rect x="${x - 4}" y="${y - 6}" width="${w + 8}" height="8" fill="${night ? '#2A2F45' : '#5B4636'}" opacity=".85"/>
    ${[0, 1, 2].map((k: number) => `<rect x="${x + 8 + k * (w / 3.2)}" y="${y + 14}" width="${w / 6}" height="12" rx="1.5" fill="${night ? (i % 2 ? '#FFD66B' : '#3B4466') : '#FFFFFFAA'}"/>`).join('')}
  `).join('');

  let road = `<path d="M0 150 H320 V220 H0Z" fill="${night ? '#2D2F36' : '#5E6168'}"/>
    <path d="M0 146 H320 V152 H0Z" fill="${night ? '#4A4D57' : '#C9C3B5'}"/>
    ${[20, 90, 160, 230, 300].map((x) => `<rect x="${x}" y="182" width="36" height="5" rx="2" fill="${fixed || base !== 'road' ? '#F2E9C9' : '#C8C0A2'}" opacity=".9"/>`).join('')}`;
  let fg = '';

  if (base === 'road' && !fixed) {
    fg += `<ellipse cx="110" cy="190" rx="44" ry="12" fill="#3B3A36"/><ellipse cx="110" cy="188" rx="36" ry="8" fill="#6E8FA6" opacity=".7"/>
      <ellipse cx="220" cy="170" rx="28" ry="7" fill="#3B3A36"/><ellipse cx="220" cy="169" rx="21" ry="4.5" fill="#6E8FA6" opacity=".6"/>
      <path d="M150 200 l14 -6 8 8 12 -4" stroke="#2C2B28" stroke-width="2.5" fill="none"/>`;
    if (work) fg += cone(70, 172) + cone(160, 172) + cone(250, 170) + `<rect x="190" y="150" width="70" height="26" rx="4" fill="#F5B301"/><rect x="198" y="132" width="30" height="20" rx="3" fill="#F5B301"/><circle cx="204" cy="178" r="8" fill="#222"/><circle cx="248" cy="178" r="8" fill="#222"/>`;
  }
  if (base === 'road' && fixed) fg += `<path d="M60 178 h110 v14 h-110z" fill="#45484F" opacity=".8"/>`;
  if (base === 'drainage' || base === 'flooding') {
    road = fixed ? road : `<path d="M0 146 H320 V220 H0Z" fill="#6D8796"/><path d="M0 160 q40 -6 80 0 t80 0 t80 0 t80 0" stroke="#A9C3D0" stroke-width="3" fill="none"/><path d="M0 190 q40 -6 80 0 t80 0 t80 0 t80 0" stroke="#A9C3D0" stroke-width="3" fill="none"/>
      <rect x="30" y="168" width="18" height="6" rx="2" fill="#E76F51"/><rect x="200" y="196" width="22" height="7" rx="2" fill="#2A9D8F"/><circle cx="140" cy="176" r="4" fill="#F4F1DE"/>`;
    if (fixed) fg += `<rect x="0" y="152" width="320" height="10" fill="#8A8F98"/>${[10, 60, 110, 160, 210, 260].map((x) => `<rect x="${x}" y="154" width="36" height="6" fill="#3B3E45"/>`).join('')}`;
  }
  if (base === 'water' && !fixed) fg += `<path d="M150 160 q-10 -40 -30 -60 M150 160 q0 -50 0 -70 M150 160 q10 -40 30 -60" stroke="#5DADE2" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="150" cy="185" rx="80" ry="14" fill="#7FB7D6" opacity=".8"/><rect x="120" y="156" width="60" height="8" rx="4" fill="#7B8794"/>`;
  if (base === 'electricity') fg += `<rect x="236" y="40" width="6" height="112" fill="#6B5B4B"/><rect x="220" y="46" width="38" height="5" fill="#6B5B4B"/><path d="M0 52 Q120 70 220 48" stroke="#222" stroke-width="2" fill="none"/><path d="M258 48 Q250 110 200 150" stroke="#222" stroke-width="2.5" fill="none"/><path d="M196 146 l8 -6 -2 8 8 -4" stroke="#F5B301" stroke-width="2.5" fill="none"/><rect x="100" y="120" width="34" height="30" fill="#F4F1DE"/><text x="117" y="139" font-size="9" text-anchor="middle" fill="#333" font-family="sans-serif">SCHOOL</text>`;
  if (base === 'streetlight') {
    fg += [40, 140, 240].map((x, i) => `<rect x="${x}" y="60" width="5" height="92" fill="#8D93A8"/><path d="M${x + 2} 62 h22" stroke="#8D93A8" stroke-width="4"/><rect x="${x + 18}" y="60" width="14" height="6" rx="2" fill="${fixed ? '#FFE28A' : '#3A3F55'}"/>
      ${fixed ? `<path d="M${x + 25} 66 l-26 84 h52z" fill="#FFE28A" opacity=".18"/>` : ''}`).join('');
  }
  if (base === 'waste' && !fixed) fg += `<path d="M70 156 q40 -60 90 -40 q40 -20 80 40z" fill="#6B705C"/>${([[100, 130, '#E76F51'], [140, 118, '#2A9D8F'], [180, 128, '#E9C46A'], [210, 142, '#F4F1DE'], [120, 146, '#264653']] as [number, number, string][]).map(([x, y, c]) => `<rect x="${x}" y="${y}" width="16" height="10" rx="3" fill="${c}" transform="rotate(${x % 30 - 15} ${x} ${y})"/>`).join('')}`;
  if (base === 'waste' && fixed) fg += `<rect x="120" y="120" width="34" height="32" rx="3" fill="#2A9D8F"/><rect x="116" y="116" width="42" height="7" rx="2" fill="#21867A"/>`;
  if (base === 'school') fg += `<rect x="70" y="80" width="180" height="72" fill="#F4F1DE"/><path d="M60 82 L160 44 L260 82" fill="${fixed ? '#B5651D' : '#8C8C8C'}"/>${fixed ? '' : '<path d="M150 56 l10 14 -6 4 8 10" stroke="#3B3A36" stroke-width="3" fill="none"/>'}<text x="160" y="122" font-size="11" text-anchor="middle" fill="#333" font-family="sans-serif">JUNIOR SCHOOL</text>`;
  if (base === 'building') fg += `<rect x="110" y="104" width="100" height="6" fill="#7B8794" transform="rotate(${fixed ? 0 : 12} 160 107)"/><rect x="114" y="108" width="5" height="44" fill="#7B8794"/><rect x="202" y="108" width="5" height="44" fill="#7B8794"/><rect x="128" y="130" width="64" height="8" fill="#B5651D"/>`;

  return `<svg class="scene" viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label || base + ' photo'}">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs>
    <rect width="320" height="220" fill="url(#${id})"/>
    ${night ? '<circle cx="270" cy="30" r="12" fill="#F4F1DE"/>' : '<circle cx="270" cy="34" r="16" fill="#FFD166" opacity=".9"/>'}
    ${houses}${road}${fg}
  </svg>`;
}
const cone = (x: number, y: number) => `<path d="M${x} ${y} l7 -20 l7 20z" fill="#F77F00"/><rect x="${x + 3}" y="${y - 12}" width="8" height="3" fill="#fff"/><rect x="${x - 3}" y="${y}" width="20" height="3" fill="#F77F00"/>`;
const shade = (hex: string) => { const n = parseInt(hex.slice(1), 16); const f = (v: number) => Math.round(v * 0.38); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; };

/** Illustrated evidence placeholder (used until real uploads exist). */
export function Scene({ name, label }: { name?: string; label?: string }) {
  return <span className="scene-wrap" dangerouslySetInnerHTML={{ __html: sceneSvg(name, { label }) }} />;
}
