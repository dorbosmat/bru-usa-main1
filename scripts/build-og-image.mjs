// ─────────────────────────────────────────────────────────────────────────────
// scripts/build-og-image.mjs — Sprint Task 12
//
// Generates public/og.png (1200x630) for OpenGraph + Twitter cards.
// Brand-aligned Florida-first contractor referral framing, dark navy
// background with the accent orange, BRU mark, and the same headline
// that lives in src/i18n/translations.ts heroSliderHeadline.
//
// We composite a few PNG layers + an SVG text overlay through sharp.
// No external font files required — sharp's text() renders system fonts
// well enough for a 1200x630 static social card.
//
// Run via:  node scripts/build-og-image.mjs
//
// Output:   public/og.png  (target < 250 KB)
// ─────────────────────────────────────────────────────────────────────────────

import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public", "og.png");

const W = 1200;
const H = 630;

// Brand colors mirror src/index.css custom properties:
//   primary (navy)  hsl(220 39% 11%)  →  #11131a
//   accent (orange) hsl(24 95% 53%)   →  #f97316
//   white            #ffffff
const NAVY    = { r: 17, g: 19, b: 26 };
const ACCENT  = "#f97316";
const ACCENT_SOFT = "#f9731622";
const WHITE   = "#ffffff";
const MUTED   = "#cbd5e1";

// Composable SVG overlay — text + accent chip + diagonal accent strip.
// Uses Inter / system-ui via SVG font-family fallback chain.
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#11131a"/>
      <stop offset="100%" stop-color="#1c2030"/>
    </linearGradient>
    <linearGradient id="accentGlow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="${ACCENT}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="cornerGlow" cx="100%" cy="0%" r="65%">
      <stop offset="0%"   stop-color="${ACCENT}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <style>
      .title  { font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-weight: 800; }
      .body   { font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-weight: 500; }
      .eyebrow{ font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-weight: 700; letter-spacing: 4px; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bgGrad)"/>
  <rect width="${W}" height="${H}" fill="url(#cornerGlow)"/>
  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="${ACCENT}"/>

  <!-- Florida-first eyebrow chip (top left) -->
  <g transform="translate(72,72)">
    <rect x="0" y="0" width="240" height="40" rx="20" ry="20" fill="${ACCENT_SOFT}" stroke="${ACCENT}" stroke-width="1"/>
    <text x="20" y="26" class="eyebrow" font-size="14" fill="${ACCENT}">FLORIDA-FIRST</text>
  </g>

  <!-- BRU wordmark (top right) -->
  <g transform="translate(${W - 72},88)">
    <text x="0" y="0" text-anchor="end" class="title" font-size="28" fill="${WHITE}">
      Build Right <tspan fill="${ACCENT}">USA</tspan>
    </text>
  </g>

  <!-- Headline -->
  <g transform="translate(72,220)">
    <text x="0" y="0" class="title" font-size="64" fill="${WHITE}">
      <tspan x="0" dy="0">Florida-First Contractor</tspan>
      <tspan x="0" dy="78">Referrals &amp; AI Renovation</tspan>
      <tspan x="0" dy="78">Previews</tspan>
    </text>
  </g>

  <!-- Subhead -->
  <text x="72" y="${H - 90}" class="body" font-size="22" fill="${MUTED}">
    Independent licensed contractors — selected U.S. metro areas.
  </text>
  <text x="72" y="${H - 56}" class="body" font-size="22" fill="${MUTED}">
    Free, no-obligation request.  buildright-usa.com
  </text>

  <!-- Accent corner accent -->
  <polygon points="${W},0 ${W},120 ${W - 120},0" fill="${ACCENT}" opacity="0.95"/>
  <polygon points="${W},120 ${W},160 ${W - 40},120" fill="${ACCENT}" opacity="0.6"/>
</svg>`;

// Render through sharp: solid navy base + composite SVG, output PNG.
await sharp({
  create: {
    width: W,
    height: H,
    channels: 3,
    background: NAVY,
  },
})
  .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
  .png({ compressionLevel: 9, palette: false })
  .toFile(OUT);

const bytes = (await fs.stat(OUT)).size;
console.log("");
console.log("─────────────────────────────────────────────────────────────────────");
console.log(`OpenGraph image written:  ${path.relative(ROOT, OUT)}`);
console.log(`Size:                     ${(bytes / 1024).toFixed(1)} KB`);
console.log(`Dimensions:               ${W} × ${H}`);
console.log("─────────────────────────────────────────────────────────────────────");
console.log("");
