// Badge illustrations, shared byte-for-byte with tvcask-app (src/lib/badgeArt.ts).
// Each motif is a function that returns SVG markup for a 120x120 canvas, drawn
// from a palette so the same art serves the earned (warm) and locked (grey)
// states without a filter. `renderBadgeSvg` composes the disc + tier rim + motif
// into one SVG string, rendered inline on web and via <SvgXml> on native — so
// mobile and web are identical. Keep this file in sync across both repos.

type Pal = { cream: string; dark: string; amber: string; liquid: string; gold: string; hoop: string; sparkle: string };

const EARNED: Pal = { cream: '#f7edd7', dark: '#33210f', amber: '#dd9a4e', liquid: '#d0812f', gold: '#ffcf87', hoop: '#a9622b', sparkle: '#fff3d6' };
const LOCKED: Pal = { cream: '#3b3b40', dark: '#171719', amber: '#2e2e33', liquid: '#44444a', gold: '#54545b', hoop: '#2a2a2e', sparkle: '#48484e' };

function star(cx: number, cy: number, ro: number, ri: number, n: number, rot: number) {
  const p: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? ro : ri;
    const a = rot + (i / (n * 2)) * Math.PI * 2;
    p.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return p.join(' ');
}
function ringDots(cx: number, cy: number, r: number, n: number, rad: number, fill: string) {
  let o = '';
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    o += `<circle cx="${(cx + r * Math.cos(a)).toFixed(2)}" cy="${(cy + r * Math.sin(a)).toFixed(2)}" r="${rad}" fill="${fill}"/>`;
  }
  return o;
}
const spark = (x: number, y: number, s: number, p: Pal) =>
  `<path d="M${x} ${y - s} Q${x + s * 0.2} ${y - s * 0.2} ${x + s} ${y} Q${x + s * 0.2} ${y + s * 0.2} ${x} ${y + s} Q${x - s * 0.2} ${y + s * 0.2} ${x - s} ${y} Q${x - s * 0.2} ${y - s * 0.2} ${x} ${y - s} Z" fill="${p.sparkle}"/>`;

function barrelArt(p: Pal, overflow: boolean) {
  return `<path d="M45 44 Q37 64 45 86 L75 86 Q83 64 75 44 Z" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.4" stroke-linejoin="round"/><path d="M54 44Q50 65 54 86M60 43V86M66 44Q70 65 66 86" stroke="${p.dark}" stroke-opacity=".26" stroke-width="1.6" fill="none"/><path d="M42 52Q60 49 78 52" stroke="${p.hoop}" stroke-width="4" fill="none"/><path d="M40 78Q60 81 80 78" stroke="${p.hoop}" stroke-width="4" fill="none"/>${overflow ? `<circle cx="52" cy="40" r="2.2" fill="${p.gold}"/><circle cx="60" cy="37" r="2.6" fill="${p.gold}"/><circle cx="68" cy="40" r="2.2" fill="${p.gold}"/>` : spark(70, 42, 2.6, p)}`;
}

const ART: Record<string, (p: Pal) => string> = {
  pour: (p) => `<g transform="rotate(-22 60 60)"><rect x="34" y="30" width="34" height="26" rx="9" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.4"/><path d="M35 38h32M35 48h32" stroke="${p.hoop}" stroke-width="3"/></g><path d="M55 52q3 9 4 15" stroke="${p.gold}" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M50 66H72L69 86Q68.7 88 66.5 88H55.5Q53.3 88 53 86Z" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.4" stroke-linejoin="round"/><path d="M52.5 74H69.5L67.5 85Q67.3 86.5 65.8 86.5H56.2Q54.7 86.5 54.5 85Z" fill="${p.liquid}"/>${spark(78, 44, 4, p)}`,
  cask: (p) => `<path d="M46 42 Q40 60 46 78 L74 78 Q80 60 74 42 Z" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.4" stroke-linejoin="round"/><path d="M54 42Q51 60 54 78M60 41V78M66 42Q69 60 66 78" stroke="${p.dark}" stroke-opacity=".26" stroke-width="1.6" fill="none"/><path d="M43 49Q60 46 77 49" stroke="${p.hoop}" stroke-width="3.8" fill="none"/><path d="M43 71Q60 74 77 71" stroke="${p.hoop}" stroke-width="3.8" fill="none"/>`,
  barrel: (p) => barrelArt(p, false),
  barrelFull: (p) => barrelArt(p, true),
  crownCask: (p) => `<path d="M49 40 L52 28 L57 36 L60 26 L63 36 L68 28 L71 40 Z" fill="${p.gold}" stroke="${p.dark}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="52" cy="28" r="2" fill="${p.dark}"/><circle cx="60" cy="26" r="2" fill="${p.dark}"/><circle cx="68" cy="28" r="2" fill="${p.dark}"/><path d="M46 48 Q39 66 46 86 L74 86 Q81 66 74 48 Z" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.4" stroke-linejoin="round"/><path d="M43 56Q60 53 77 56" stroke="${p.hoop}" stroke-width="3.6" fill="none"/><path d="M43 78Q60 81 77 78" stroke="${p.hoop}" stroke-width="3.6" fill="none"/>`,
  glass: (p) => `<path d="M48 50H72L69 84Q68.7 86 66.5 86H53.5Q51.3 86 51 84Z" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.4" stroke-linejoin="round"/><path d="M50.5 66H69.5L67.4 83Q67.2 84.5 65.7 84.5H54.3Q52.8 84.5 52.6 83Z" fill="${p.liquid}"/><rect x="55" y="68" width="9" height="9" rx="2" fill="${p.cream}" opacity=".5" transform="rotate(12 59 72)"/>${spark(76, 46, 3.4, p)}`,
  overflowGlass: (p) => `<path d="M46 44H74L70.5 84Q70.2 86 68 86H52Q49.8 86 49.5 84Z" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.4" stroke-linejoin="round"/><path d="M48 52H72L69.5 83Q69.3 84.5 67.8 84.5H52.2Q50.7 84.5 50.5 83Z" fill="${p.liquid}"/><path d="M46 52 Q44 60 40 66" stroke="${p.liquid}" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M74 52 Q76 60 80 66" stroke="${p.liquid}" stroke-width="3.4" fill="none" stroke-linecap="round"/><circle cx="39" cy="70" r="2.4" fill="${p.liquid}"/><circle cx="81" cy="70" r="2.4" fill="${p.liquid}"/>${spark(60, 38, 3.4, p)}`,
  twoGlasses: (p) => `<path d="M40 54H56L54 82Q53.8 83.5 52.2 83.5H43.8Q42.2 83.5 42 82Z" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.2" stroke-linejoin="round"/><path d="M41.6 66H54.4L52.8 82Q52.7 83 51.4 83H44.6Q43.3 83 43.2 82Z" fill="${p.liquid}"/><path d="M64 54H80L78 82Q77.8 83.5 76.2 83.5H67.8Q66.2 83.5 66 82Z" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.2" stroke-linejoin="round"/><path d="M65.6 66H78.4L76.8 82Q76.7 83 75.4 83H68.6Q67.3 83 67.2 82Z" fill="${p.liquid}"/>${spark(60, 50, 3.4, p)}`,
  tvStack: (p) => `<rect x="34" y="58" width="34" height="26" rx="6" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.2"/><rect x="38.5" y="62.5" width="20" height="17" rx="3" fill="${p.dark}"/><path d="M45 66.5L53 71L45 75.5Z" fill="${p.gold}"/><rect x="52" y="42" width="30" height="23" rx="6" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.2"/><rect x="56" y="46" width="17" height="15" rx="3" fill="${p.dark}"/><path d="M61.5 49.5L68 53.5L61.5 57.5Z" fill="${p.gold}"/><path d="M60 42 56 34M72 42 76 33" stroke="${p.dark}" stroke-width="2.2" stroke-linecap="round"/>`,
  tvSingle: (p) => `<path d="M50 46 44 37M62 46 69 36" stroke="${p.dark}" stroke-width="2.4" stroke-linecap="round"/><circle cx="44" cy="36" r="2.2" fill="${p.gold}"/><circle cx="69.5" cy="35" r="2.2" fill="${p.gold}"/><rect x="40" y="46" width="42" height="32" rx="7" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.4"/><rect x="45" y="51" width="25" height="22" rx="3.5" fill="${p.dark}"/><path d="M53 56L63 62L53 68Z" fill="${p.gold}"/><rect x="73" y="51" width="5" height="22" rx="2.5" fill="${p.amber}"/><circle cx="75.5" cy="57" r="1.6" fill="${p.dark}"/><circle cx="75.5" cy="64" r="1.6" fill="${p.dark}"/>`,
  remote: (p) => `<rect x="49" y="34" width="22" height="52" rx="9" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.4"/><circle cx="60" cy="47" r="6" fill="${p.dark}"/><path d="M60 44.5v5M57.5 47h5" stroke="${p.gold}" stroke-width="1.8" stroke-linecap="round"/><circle cx="55" cy="62" r="2.2" fill="${p.hoop}"/><circle cx="65" cy="62" r="2.2" fill="${p.hoop}"/><circle cx="55" cy="70" r="2.2" fill="${p.hoop}"/><circle cx="65" cy="70" r="2.2" fill="${p.hoop}"/><circle cx="60" cy="78" r="2.2" fill="${p.hoop}"/><path d="M64 30 q5 0 5 5M67 27 q9 0 9 9" stroke="${p.gold}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  filmReel: (p) => `<circle cx="60" cy="60" r="22" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.4"/><circle cx="60" cy="60" r="6" fill="${p.dark}"/>${ringDots(60, 60, 13, 6, 4, p.hoop)}<rect x="77" y="69" width="17" height="10" rx="1.5" fill="${p.dark}" transform="rotate(20 85 74)"/><rect x="80" y="71.5" width="2.4" height="5" fill="${p.cream}" transform="rotate(20 85 74)"/><rect x="86" y="73.5" width="2.4" height="5" fill="${p.cream}" transform="rotate(20 85 74)"/>`,
  ticket: (p) => `<path d="M40 50 H80 A3 3 0 0 1 83 53 A4 4 0 0 0 83 61 A4 4 0 0 0 83 69 A3 3 0 0 1 80 72 H40 A3 3 0 0 1 37 69 A4 4 0 0 0 37 61 A4 4 0 0 0 37 53 A3 3 0 0 1 40 50 Z" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.4"/><path d="M63 51 V71" stroke="${p.dark}" stroke-opacity=".4" stroke-width="1.8" stroke-dasharray="3 3"/><polygon points="${star(51, 61, 7, 3, 5, -Math.PI / 2)}" fill="${p.gold}"/>`,
  seal: (p) => `<polygon points="${star(60, 58, 28, 23, 20, -Math.PI / 2)}" fill="${p.gold}"/><path d="M53 73 L48 88 L56 83 L60 89 L64 83 L72 88 L67 73 Z" fill="${p.hoop}" stroke="${p.dark}" stroke-width="1.6" stroke-linejoin="round"/><circle cx="60" cy="58" r="16" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.2"/><path d="M53 58 L58 63 L68 51" fill="none" stroke="${p.hoop}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`,
  bell: (p) => `<path d="M40 74 Q40 52 60 50 Q80 52 80 74 Z" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.4" stroke-linejoin="round"/><rect x="36" y="74" width="48" height="6" rx="3" fill="${p.hoop}"/><circle cx="60" cy="47" r="4" fill="${p.gold}" stroke="${p.dark}" stroke-width="1.8"/>${spark(80, 52, 3, p)}`,
  trophy: (p) => `<path d="M47 46 H73 V56 Q73 68 60 70 Q47 68 47 56 Z" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.4" stroke-linejoin="round"/><path d="M47 49 Q38 49 39 57 Q40 62 47 62" fill="none" stroke="${p.dark}" stroke-width="2.4"/><path d="M73 49 Q82 49 81 57 Q80 62 73 62" fill="none" stroke="${p.dark}" stroke-width="2.4"/><rect x="56" y="70" width="8" height="8" fill="${p.hoop}"/><rect x="48" y="78" width="24" height="7" rx="2" fill="${p.hoop}"/><polygon points="${star(60, 55, 7, 3, 5, -Math.PI / 2)}" fill="${p.gold}"/>`,
  shelf: (p) => `<rect x="48" y="40" width="9" height="34" rx="3.5" fill="${p.cream}" stroke="${p.dark}" stroke-width="2"/><rect x="49.5" y="34" width="6" height="8" rx="2" fill="${p.hoop}"/><rect x="62" y="48" width="9" height="26" rx="3.5" fill="${p.cream}" stroke="${p.dark}" stroke-width="2"/><rect x="63.5" y="43" width="6" height="7" rx="2" fill="${p.hoop}"/><rect x="38" y="74" width="44" height="6" rx="2" fill="${p.hoop}"/><polygon points="${star(76, 42, 5, 2.2, 5, -Math.PI / 2)}" fill="${p.gold}"/>`,
  bottle: (p) => `<path d="M55 44 h10 v8 q6 3 6 12 v20 a3 3 0 0 1 -3 3 h-16 a3 3 0 0 1 -3 -3 v-20 q0 -9 6 -12 z" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.4" stroke-linejoin="round"/><rect x="54" y="38" width="12" height="7" rx="2" fill="${p.hoop}"/><rect x="49" y="70" width="22" height="12" rx="2" fill="${p.liquid}"/><polygon points="${star(60, 74, 4, 1.8, 5, -Math.PI / 2)}" fill="${p.gold}"/>`,
  vault: (p) => `<rect x="40" y="42" width="40" height="40" rx="6" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.4"/><rect x="45" y="47" width="30" height="30" rx="4" fill="none" stroke="${p.dark}" stroke-opacity=".35" stroke-width="1.6"/><circle cx="60" cy="62" r="9" fill="${p.hoop}" stroke="${p.dark}" stroke-width="2"/><path d="M60 55v14M53 62h14M55 57l10 10M65 57l-10 10" stroke="${p.gold}" stroke-width="1.6"/><circle cx="60" cy="62" r="2.4" fill="${p.gold}"/>`,
  clock: (p) => `<circle cx="60" cy="62" r="21" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.4"/><path d="M60 50v12l8 5" stroke="${p.dark}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M48 40 l6 6M72 40 l-6 6" stroke="${p.hoop}" stroke-width="3" stroke-linecap="round"/><path d="M50 34 q10 -8 20 0" fill="none" stroke="${p.hoop}" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="62" r="2.4" fill="${p.hoop}"/>`,
  hourglass: (p) => `<rect x="44" y="38" width="32" height="5" rx="2.5" fill="${p.hoop}"/><rect x="44" y="81" width="32" height="5" rx="2.5" fill="${p.hoop}"/><path d="M48 43 H72 L62 62 L72 81 H48 L58 62 Z" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.2" stroke-linejoin="round"/><path d="M52 47 H68 L60.5 62 Z" fill="${p.liquid}"/><path d="M60 62 L64 77 H56 Z" fill="${p.liquid}"/>${spark(78, 50, 3, p)}`,
  moon: (p) => `<path d="M66 38 A22 22 0 1 0 66 86 A17 17 0 1 1 66 38 Z" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.2" stroke-linejoin="round"/><polygon points="${star(74, 48, 4.5, 2, 5, -Math.PI / 2)}" fill="${p.gold}"/><polygon points="${star(80, 64, 3, 1.4, 5, -Math.PI / 2)}" fill="${p.gold}"/>`,
  glasses: (p) => `<circle cx="47" cy="62" r="12" fill="none" stroke="${p.cream}" stroke-width="4"/><circle cx="73" cy="62" r="12" fill="none" stroke="${p.cream}" stroke-width="4"/><path d="M59 60 q1 -3 2 0" stroke="${p.cream}" stroke-width="3" fill="none"/><path d="M35 58 l6 -3M85 58 l-6 -3" stroke="${p.cream}" stroke-width="3" stroke-linecap="round"/>${spark(60, 42, 3.4, p)}`,
  flame: (p) => `<path d="M60 34 c4 8 10 11 10 20 a10 10 0 1 1 -20 0 c0 -3 1.4 -5.6 3 -7.4 C55 52 60 46 60 34 Z" fill="${p.gold}" stroke="${p.dark}" stroke-width="2.2" stroke-linejoin="round"/><path d="M60 54 c2 3 4 5 4 8 a4 4 0 1 1 -8 0 c0 -3 2 -5 4 -8 Z" fill="${p.liquid}"/>`,
  star: (p) => `<polygon points="${star(60, 60, 24, 10, 5, -Math.PI / 2)}" fill="${p.gold}" stroke="${p.dark}" stroke-width="2.2" stroke-linejoin="round"/><polygon points="${star(60, 58, 12, 5, 5, -Math.PI / 2)}" fill="${p.cream}" opacity=".55"/>`,
  listScroll: (p) => `<path d="M44 40 q-4 0 -4 5 v34 q0 4 4 4 h28 q4 0 4 -4 v-34 q0 -5 -4 -5 z" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.4"/><path d="M44 40 q4 0 4 5 v3 h-8 v-3 q0 -5 4 -5 z" fill="${p.hoop}"/><path d="M50 56 h18M50 63 h18M50 70 h12" stroke="${p.dark}" stroke-opacity=".4" stroke-width="2" stroke-linecap="round"/>`,
  palette: (p) => `<path d="M60 42 a20 18 0 1 0 4 36 a4 4 0 0 1 0 -8 a6 6 0 0 0 6 -6 a4 4 0 0 1 4 -4 a10 10 0 0 0 -14 -18 Z" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="52" cy="52" r="3" fill="${p.liquid}"/><circle cx="64" cy="50" r="3" fill="${p.gold}"/><circle cx="70" cy="60" r="3" fill="${p.hoop}"/><circle cx="52" cy="64" r="3" fill="${p.amber}"/>`,
  heart: (p) => `<path d="M60 82 S40 70 36 55 A11 11 0 0 1 60 48 A11 11 0 0 1 84 55 C80 70 60 82 60 82 Z" fill="${p.gold}" stroke="${p.dark}" stroke-width="2.4" stroke-linejoin="round"/><path d="M50 54 a5 5 0 0 1 8 -2" fill="none" stroke="${p.cream}" stroke-opacity=".7" stroke-width="2.4" stroke-linecap="round"/>`,
  clapper: (p) => `<rect x="40" y="56" width="40" height="26" rx="3" fill="${p.cream}" stroke="${p.dark}" stroke-width="2.2"/><path d="M40 56 l6 -10 8 4 -6 10z M54 50 l8 4 -6 10 -8 -4z M62 54 l8 4 -6 10 -8 -4z" fill="${p.dark}"/><polygon points="${star(60, 70, 7, 3, 5, -Math.PI / 2)}" fill="${p.gold}"/>`,
  checkeredFlag: (p) => `<path d="M45 38 v46" stroke="${p.dark}" stroke-width="3" stroke-linecap="round"/><rect x="45" y="40" width="30" height="22" fill="${p.cream}" stroke="${p.dark}" stroke-width="2"/><g fill="${p.dark}"><rect x="45" y="40" width="7.5" height="5.5"/><rect x="60" y="40" width="7.5" height="5.5"/><rect x="52.5" y="45.5" width="7.5" height="5.5"/><rect x="67.5" y="45.5" width="7.5" height="5.5"/><rect x="45" y="51" width="7.5" height="5.5"/><rect x="60" y="51" width="7.5" height="5.5"/><rect x="52.5" y="56.5" width="7.5" height="5.5"/><rect x="67.5" y="56.5" width="7.5" height="5.5"/></g>`,
};

const RIM: Record<string, string> = { bronze: '#8a5230', silver: '#9aa3ad', gold: '#c99a3a', amber: '#e0b072' };

/** Full badge SVG string. `id` must be unique on a web page (gradient ids are global there). */
export function renderBadgeSvg(art: string, tier: string, opts: { locked?: boolean; size?: number; id: string }): string {
  const { locked = false, size = 96, id } = opts;
  const pal = locked ? LOCKED : EARNED;
  const rim = locked ? '#42424a' : RIM[tier] ?? RIM.bronze;
  const inner = (ART[art] ?? ART.star)(pal);
  const discStops = locked
    ? '<stop offset="0%" stop-color="#3a3a3e"/><stop offset="60%" stop-color="#26262a"/><stop offset="100%" stop-color="#161619"/>'
    : '<stop offset="0%" stop-color="#edb46e"/><stop offset="58%" stop-color="#bd7736"/><stop offset="100%" stop-color="#8a5024"/>';
  return `<svg width="${size}" height="${size}" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialGradient id="d${id}" cx="40%" cy="30%" r="78%">${discStops}</radialGradient>
<radialGradient id="s${id}" cx="35%" cy="22%" r="42%"><stop offset="0%" stop-color="#ffffff" stop-opacity="${locked ? 0.12 : 0.5}"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
</defs>
<circle cx="60" cy="60" r="54" fill="url(#d${id})"/>
<circle cx="60" cy="60" r="54" fill="url(#s${id})"/>
<circle cx="60" cy="60" r="54" fill="none" stroke="${rim}" stroke-width="4"/>
<circle cx="60" cy="60" r="49" fill="none" stroke="#ffe0b0" stroke-opacity="${locked ? 0.06 : 0.2}" stroke-width="1.4"/>
${inner}
</svg>`;
}
