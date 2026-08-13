import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const OUT = path.join(process.cwd(), "public", "images");
fs.mkdirSync(OUT, { recursive: true });

const G = (inner, width = 800, height = 600) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b0d18"/>
      <stop offset="55%" stop-color="#131730"/>
      <stop offset="100%" stop-color="#0a0b12"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#0ea5e9"/>
    </linearGradient>
    <linearGradient id="accent2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="rgba(139,92,246,0.5)"/>
      <stop offset="100%" stop-color="rgba(139,92,246,0)"/>
    </radialGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="40"/></filter>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <rect width="800" height="600" fill="url(#glow)" filter="url(#blur)" opacity="0.9"/>
  <circle cx="650" cy="120" r="180" fill="#0ea5e9" opacity="0.14" filter="url(#blur)"/>
  <circle cx="120" cy="480" r="180" fill="#22d3ee" opacity="0.1" filter="url(#blur)"/>
  <g opacity="0.07" stroke="#8b5cf6" stroke-width="1">
    ${Array.from({ length: 14 })
      .map((_, i) => `<line x1="0" y1="${(i + 1) * 42}" x2="800" y2="${(i + 1) * 42}"/>`)
      .join("")}
    ${Array.from({ length: 18 })
      .map((_, i) => `<line x1="${(i + 1) * 44}" y1="0" x2="${(i + 1) * 44}" y2="600"/>`)
      .join("")}
  </g>
  ${inner}
</svg>`;

const diamond = (cx, cy, s, rotate = 0) => `
  <g transform="translate(${cx} ${cy}) rotate(${rotate})">
    <polygon points="0,${-s} ${s * 0.62},0 0,${s} ${-s * 0.62},0" fill="url(#accent)" opacity="0.92"/>
    <polygon points="0,${-s * 0.5} ${s * 0.32},0 0,${s * 0.5} ${-s * 0.32},0" fill="#0b0d18"/>
  </g>`;

const card = (inner, badge, cx = 400, cy = 300, scale = 1) => `
  <g transform="translate(${cx} ${cy}) scale(${scale})">
    <rect x="-230" y="-155" width="460" height="310" rx="36" fill="#151a35" stroke="rgba(139,92,246,0.55)" stroke-width="3"/>
    <rect x="-218" y="-143" width="436" height="286" rx="28" fill="#0d1122"/>
    <path d="M-218 60 L-218 143 L218 143 L218 60 Z" fill="url(#accent)" opacity="0.16"/>
    ${inner}
  </g>
  ${badge}
`;

const centerBadge = (text, sub) => `
  <g transform="translate(400 92)">
    <rect x="-120" y="-30" width="240" height="60" rx="18" fill="rgba(244,63,94,0.92)" transform="rotate(-4)"/>
    <text x="0" y="6" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="#ffffff">${text}</text>
    <text x="0" y="34" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#ffe4e6">${sub}</text>
  </g>`;

const price = (text) => `
  <text x="0" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="46" font-weight="bold" fill="#a78bfa">${text} <tspan font-size="20" fill="#64748b">ج.م</tspan></text>`;

const ucLabel = (amount, bonus) => `
  <text x="0" y="-68" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#94a3b8" letter-spacing="6">شِدّات ببجي</text>
  <text x="0" y="6" text-anchor="middle" font-family="Arial, sans-serif" font-size="84" font-weight="bold" fill="#ffffff">${amount}</text>
  <text x="0" y="52" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#22d3ee" font-weight="bold" letter-spacing="4">← U C →</text>
  ${bonus ? `<rect x="-110" y="70" width="220" height="40" rx="14" fill="rgba(52,211,153,0.14)" stroke="rgba(52,211,153,0.4)"/><text x="0" y="97" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" font-weight="bold" fill="#6ee7b7">+ ${bonus} UC هدية</text>` : ""}`;

const write = (name, svg) => {
  fs.writeFileSync(path.join(OUT, name), svg);
  console.log("✓", name);
};

const cat = (name, icon, colorA, colorB) => `
  <circle cx="400" cy="215" r="95" fill="${colorA}" opacity="0.22" filter="url(#blur)"/>
  <g transform="translate(400 230)">
    ${icon}
  </g>
  <text x="400" y="395" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="bold" fill="#ffffff">${name}</text>
  <rect x="300" y="435" width="200" height="4" rx="2" fill="url(#accent)"/>`;

const gemIcon = `<polygon points="0,-52 45,-26 0,52 -45,-26" fill="none" stroke="url(#accent)" stroke-width="5"/><polygon points="0,-26 26,0 0,26 -26,0" fill="url(#accent2)"/>`;
const gamepadIcon = `<g fill="none" stroke="url(#accent2)" stroke-width="7" stroke-linecap="round"><rect x="-62" y="-30" width="124" height="62" rx="26"/><circle cx="-30" cy="-1" r="7" fill="#a78bfa" stroke="none"/><circle cx="4" cy="-1" r="7" fill="#22d3ee" stroke="none"/><circle cx="24" cy="-12" r="6" fill="#a78bfa" stroke="none"/><circle cx="24" cy="10" r="6" fill="#a78bfa" stroke="none"/></g>`;
const usersIcon = `<g fill="#c4b5fd"><circle cx="-22" cy="-14" r="16"/><circle cx="20" cy="-14" r="16"/><path d="M-40 26 C-40 8 -18 2 -4 10 C-14 26 4 30 14 22 C26 30 44 26 44 26 C44 10 36 -6 20 -14 C4 -6 -8 8 -8 26 Z"/></g>`;
const flameIcon = `<path d="M0 52 C-34 28 -28 4 -10 -10 C-4 4 -2 8 0 2 C4 -16 18 -26 24 -44 C38 -24 44 -4 36 12 C32 24 30 34 22 42 C30 46 34 52 30 58 C18 70 10 66 4 60 C2 58 0 56 0 52 Z" fill="none" stroke="url(#accent)" stroke-width="5"/>`;
const giftIcon = `<g fill="none" stroke="url(#accent)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><rect x="-52" y="-18" width="104" height="34" rx="8"/><path d="M-34 -18 L-34 -34 M34 -18 L34 -34"/><path d="M-34 -34 C-44 -50 -14 -54 -14 -36 M34 -34 C44 -50 14 -54 14 -36"/><path d="M-34 16 L-34 52 M34 16 L34 52 M-52 34 L52 34"/></g>`;
const creditIcon = `<g fill="none" stroke="url(#accent)" stroke-width="5" stroke-linejoin="round"><rect x="-64" y="-30" width="128" height="74" rx="10"/><path d="M-64 -4 L64 -4"/><circle cx="-36" cy="24" r="5" fill="#a78bfa" stroke="none"/><rect x="-10" y="20" width="40" height="8" rx="4" fill="#22d3ee" stroke="none"/></g>`;
const headphoneIcon = `<g fill="none" stroke="url(#accent)" stroke-width="6" stroke-linecap="round"><path d="M-14 -26 C-42 -40 -72 -26 -72 -6 L-72 14"/><path d="M14 -26 C42 -40 72 -26 72 -6 L72 14"/><rect x="-96" y="14" width="48" height="38" rx="14"/><rect x="48" y="14" width="48" height="38" rx="14"/></g>`;
const rocketIcon = `<g fill="none" stroke="url(#accent)" stroke-width="5" stroke-linejoin="round"><path d="M-8 48 C-2 30 0 22 -4 8 L-46 16 C-40 34 -24 46 -8 48 Z"/><path d="M8 48 C2 30 0 22 4 8 L46 16 C40 34 24 46 8 48 Z"/><path d="M-4 8 C-8 -8 4 -30 0 -48 C12 -30 8 -8 4 8"/><circle cx="0" cy="-6" r="10" fill="url(#accent2)" stroke="none"/></g>`;
const sparkleIcon = `<g fill="url(#accent)"><path d="M0 -56 L10 -20 L44 -10 L10 2 L0 34 L-10 2 L-44 -10 L-10 -20 Z"/><circle cx="56" cy="-36" r="8" opacity="0.8"/><circle cx="-52" cy="10" r="5" opacity="0.6"/></g>`;

// ===== منتجات شدات ببجي =====
write("uc-60.svg", G(card(ucLabel("60 UC", null), centerBadge("الأكثر مبيعًا", "الأكثر مبيعًا"), 400, 310) + diamond(120, 130, 34) + diamond(680, 470, 40, 24)));
write("uc-120.svg", G(card(ucLabel("120 UC", "+ 10 UC"), centerBadge("خصم 20%", "خصم 20%"), 400, 310) + diamond(660, 140, 30) + diamond(140, 460, 36)));
write("uc-325.svg", G(card(ucLabel("325 UC", "+ 35 UC"), centerBadge("خصم 10%", "خصم 10%"), 400, 310) + diamond(120, 470, 38, 12) + diamond(680, 130, 30)));
write("uc-660.svg", G(card(ucLabel("660 UC", "+ 90 UC"), centerBadge("الباقة المفضلة", "الباقة المفضلة"), 400, 310) + diamond(650, 460, 42) + diamond(150, 140, 30)));
write("uc-1800.svg", G(card(ucLabel("1800 UC", "+ 300 UC"), centerBadge("خصم 10%", "خصم 10%"), 400, 310) + diamond(130, 130, 36) + diamond(670, 470, 44, 18)));
write("uc-3850.svg", G(card(ucLabel("3850 UC", "+ 700 UC"), centerBadge("الأقوى للمحترفين", "الأقوى للمحترفين"), 400, 310) + diamond(680, 140, 34) + diamond(120, 460, 36)));
write("uc-kr.svg", G(card(ucLabel("660 UC", "+ 60 UC"), centerBadge("نسخة كورية KR", "نسخة كورية KR"), 400, 310) + `<text x="400" y="152" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="bold" fill="url(#accent2)">KOREA</text>` + diamond(140, 470, 34)));
write("royale-pass.svg", G(card(`
  <text x="0" y="-84" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#94a3b8" letter-spacing="5">ROYALE PASS</text>
  <g transform="translate(0 -14)">${flameIcon}</g>
  <text x="0" y="78" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#fbbf24">موسم 960 UC</text>
  <text x="0" y="112" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="bold" fill="#a78bfa">420 <tspan font-size="18" fill="#64748b">ج.م</tspan></text>
`, centerBadge("خصم 16%", "خصم 16%"), 400, 316)));
write("gaming-card.svg", G(card(`
  <text x="0" y="-66" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#94a3b8" letter-spacing="4">رصيد ألعاب</text>
  <g transform="translate(0 -6)">${creditIcon}</g>
  <text x="0" y="90" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#a78bfa">150 <tspan font-size="18" fill="#64748b">ج.م</tspan></text>
`, centerBadge("خصم 17%", "خصم 17%"), 400, 314)));
write("gift-card.svg", G(card(`
  <text x="0" y="-84" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#94a3b8" letter-spacing="5">بطاقة قيمة</text>
  <g transform="translate(0 -8) scale(1.25)">${giftIcon}</g>
  <text x="0" y="74" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="bold" fill="#a78bfa">250 <tspan font-size="18" fill="#64748b">ج.م</tspan></text>
`, centerBadge("خصم 17%", "خصم 17%"), 400, 314)));
write("digital-topup.svg", G(card(`
  <text x="0" y="-84" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#94a3b8" letter-spacing="4">باقات رقمية</text>
  <g transform="translate(0 -6)">${sparkleIcon}</g>
  <text x="0" y="80" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="bold" fill="#a78bfa">99 <tspan font-size="18" fill="#64748b">ج.م</tspan></text>
`, centerBadge("خصم 21%", "خصم 21%"), 400, 314)));

// ===== منتجات السوشيال =====
write("social-instagram.svg", G(card(`
  <text x="0" y="-92" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#94a3b8" letter-spacing="4">إنستجرام</text>
  <g stroke="#f472b6" stroke-width="8" fill="none">
    <rect x="-52" y="-52" width="104" height="104" rx="28"/>
    <circle cx="0" cy="0" r="24"/>
    <circle cx="34" cy="-34" r="7" fill="#f472b6" stroke="none"/>
  </g>
  <text x="0" y="80" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="bold" fill="#a78bfa">1000 <tspan font-size="18" fill="#64748b">متابع</tspan></text>
`, centerBadge("خصم 20%", "خصم 20%"), 400, 316)));
write("social-tiktok.svg", G(card(`
  <text x="0" y="-92" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#94a3b8" letter-spacing="4">تيك توك</text>
  <g transform="translate(6 10)">
    <path d="M18 -56 L18 24 C18 40 8 48 -4 48 C-20 48 -30 36 -30 22 C-30 8 -18 -2 -4 -2 C2 -2 8 0 12 4 L12 -34 L50 -46 L50 -14 L18 -24" fill="#22d3ee"/>
    <path d="M18 -38 L40 -46 L40 -24 L18 -14" fill="#a78bfa"/>
  </g>
  <text x="0" y="84" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="bold" fill="#a78bfa">500 <tspan font-size="18" fill="#64748b">متابع</tspan></text>
`, centerBadge("خصم 21%", "خصم 21%"), 400, 316)));
write("social-youtube.svg", G(card(`
  <text x="0" y="-92" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#94a3b8" letter-spacing="4">يوتيوب</text>
  <g transform="translate(0 -12)">
    <rect x="-58" y="-34" width="116" height="72" rx="18" fill="none" stroke="#f87171" stroke-width="8"/>
    <path d="M-18 -22 L26 2 L-18 26 Z" fill="#f87171"/>
  </g>
  <text x="0" y="88" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="bold" fill="#a78bfa">5000 <tspan font-size="18" fill="#64748b">مشاهدة</tspan></text>
`, centerBadge("خصم 20%", "خصم 20%"), 400, 316)));
write("social-youtube-subs.svg", G(card(`
  <text x="0" y="-92" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#94a3b8" letter-spacing="4">يوتيوب</text>
  <g transform="translate(0 -12)">${usersIcon}</g>
  <text x="0" y="88" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="bold" fill="#a78bfa">1000 <tspan font-size="18" fill="#64748b">مشترك</tspan></text>
`, centerBadge("خصم 21%", "خصم 21%"), 400, 316)));

// ===== الفئات =====
write("cat-pubg-services.svg", G(cat("خدمات ببجي", headphoneIcon, "#f59e0b", "#f43f5e")));
write("cat-pubg-uc.svg", G(cat("شدات ببجي", gemIcon, "#8b5cf6", "#0ea5e9")));
write("cat-social.svg", G(cat("السوشيال ميديا", usersIcon, "#d946ef", "#f43f5e")));
write("cat-offers.svg", G(cat("العروض", flameIcon, "#f43f5e", "#f59e0b")));
write("cat-digital.svg", G(cat("المنتجات الرقمية", giftIcon, "#10b981", "#06b6d4")));

// ===== OG PNG =====
// writeOgpng() يُستدعى في نهاية الملف بعد تعريف الثوابت

// ===== مولّد OG PNG بدون مكتبات خارجية =====
const PNG_W = 1200;
const PNG_H = 630;
const pngPx = Buffer.alloc(PNG_W * PNG_H * 3);
const PIX = (x, y) => (y * PNG_W + x) * 3;

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const hexRgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const lerpRgb = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

function blendPx(x, y, [r, g, b], a) {
  if (x < 0 || y < 0 || x >= PNG_W || y >= PNG_H || a <= 0) return;
  const i = PIX(x, y);
  pngPx[i] = pngPx[i] * (1 - a) + r * a;
  pngPx[i + 1] = pngPx[i + 1] * (1 - a) + g * a;
  pngPx[i + 2] = pngPx[i + 2] * (1 - a) + b * a;
}
function fillRectPx(x0, y0, w, h, color, a = 1) {
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) blendPx(x, y, color, a);
}
function fillCirclePx(cx, cy, rad, color, a) {
  for (let y = cy - rad; y <= cy + rad; y++)
    for (let x = cx - rad; x <= cx + rad; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d <= rad) blendPx(x, y, color, a * (1 - d / rad));
    }
}
function fillPolyPx(points, colorA, colorB) {
  const ys = points.map((p) => p[1]);
  const y0 = Math.floor(Math.min(...ys));
  const y1 = Math.ceil(Math.max(...ys));
  for (let y = y0; y <= y1; y++) {
    const xs = [];
    for (let i = 0; i < points.length; i++) {
      const [ax, ay] = points[i];
      const [bx, by] = points[(i + 1) % points.length];
      if (ay === by) continue;
      if ((y >= ay && y < by) || (y >= by && y < ay)) xs.push(ax + ((y - ay) / (by - ay)) * (bx - ax));
    }
    if (xs.length < 2) continue;
    xs.sort((a, b) => a - b);
    for (let x = Math.floor(xs[0]); x <= Math.ceil(xs[xs.length - 1]); x++)
      blendPx(x, y, lerpRgb(colorA, colorB, clamp01((y - y0) / (y1 - y0))), 1);
  }
}

const FONT = {
  M: ["##.##", "#.#.#", "#...#", "#...#", "#...#", "#...#", "#...#"],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  D: ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  S: [".####", "#....", "#....", ".###.", "....#", "....#", "####."],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  "2": ["####.", "....#", "....#", "####.", "#....", "#....", "####."],
  "0": [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  "6": [".###.", "#....", "#....", "####.", "#...#", "#...#", ".###."],
  ".": [".....", ".....", ".....", ".....", ".....", "..#..", "..#.."],
  " ": [".....", ".....", ".....", ".....", ".....", ".....", "....."],
};

function drawTextPx(text, cx, topY, scale, color) {
  const textW = text.length * 6 * scale - scale;
  const startX = Math.round(cx - textW / 2);
  let x = startX;
  for (const ch of text) {
    const glyph = FONT[ch] || FONT[" "];
    for (let gy = 0; gy < 7; gy++)
      for (let gx = 0; gx < 5; gx++)
        if (glyph[gy][gx] === "#") fillRectPx(x + gx * scale, topY + gy * scale, scale, scale, color);
    x += 6 * scale;
  }
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    let c = (crc ^ buf[i]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function writeOgpng() {
  const c1 = hexRgb("#070812");
  const c2 = hexRgb("#12163a");
  const c3 = hexRgb("#080a14");
  for (let y = 0; y < PNG_H; y++) {
    const t = y / PNG_H;
    const col = t < 0.55 ? lerpRgb(c1, c2, t / 0.55) : lerpRgb(c2, c3, (t - 0.55) / 0.45);
    for (let x = 0; x < PNG_W; x++) {
      const i = PIX(x, y);
      pngPx[i] = col[0];
      pngPx[i + 1] = col[1];
      pngPx[i + 2] = col[2];
    }
  }
  fillCirclePx(1000, 100, 240, hexRgb("#0ea5e9"), 0.16);
  fillCirclePx(180, 540, 260, hexRgb("#22d3ee"), 0.12);
  for (let i = 0; i < 10; i++) fillRectPx(0, (i + 1) * 63, PNG_W, 2, hexRgb("#8b5cf6"), 0.06);
  for (let i = 0; i < 15; i++) fillRectPx((i + 1) * 80, 0, 2, PNG_H, hexRgb("#8b5cf6"), 0.06);
  fillPolyPx([[600, 126], [699, 240], [600, 354], [501, 240]], hexRgb("#8b5cf6"), hexRgb("#0ea5e9"));
  fillPolyPx([[600, 174], [656, 240], [600, 306], [544, 240]], hexRgb("#0b0d18"), hexRgb("#0b0d18"));
  drawTextPx("MEDO STORE", PNG_W / 2, 388, 14, hexRgb("#ffffff"));
  for (let x = 440; x < 760; x++) fillRectPx(x, 508, 1, 8, lerpRgb(hexRgb("#8b5cf6"), hexRgb("#0ea5e9"), (x - 440) / 320), 1);
  drawTextPx("EST. 2026", PNG_W / 2, 546, 3, hexRgb("#22d3ee"));

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(PNG_W, 0);
  ihdr.writeUInt32BE(PNG_H, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const raw = Buffer.alloc(PNG_H * (1 + PNG_W * 3));
  for (let y = 0; y < PNG_H; y++) {
    raw[y * (1 + PNG_W * 3)] = 0;
    pngPx.copy(raw, y * (1 + PNG_W * 3) + 1, y * PNG_W * 3, (y + 1) * PNG_W * 3);
  }
  fs.writeFileSync(
    path.join(process.cwd(), "public", "og.png"),
    Buffer.concat([
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      pngChunk("IHDR", ihdr),
      pngChunk("IDAT", zlib.deflateSync(raw)),
      pngChunk("IEND", Buffer.alloc(0)),
    ])
  );
  console.log("✓ og.png");
}

writeOgpng();