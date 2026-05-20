// ─────────────────────────────────────────────────────────────────────────────
// scripts/optimize-images.mjs — Sprint Task 12
//
// One-shot image optimization pass. Re-encodes the largest JPG/PNG assets
// in place at sane dimensions + quality, and converts photo-PNGs to JPG
// (because PNG is structurally wrong for photos). Run via:
//
//   node scripts/optimize-images.mjs
//
// Designed to be idempotent: running it twice on already-shrunk files
// produces near-identical output (sharp's encoders are deterministic
// modulo a tiny entropy from libjpeg-turbo).
//
// Sharp is installed via `npm install --no-save sharp` so this script
// stays buildtime-only and never enters the production dependency tree.
// ─────────────────────────────────────────────────────────────────────────────

import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Each entry: source path (relative to repo root), target longest-edge
// pixel size, JPG quality, optional rename (e.g. .png → .jpg). The
// rename target lives in `out` and the original is replaced by deleting
// it after the write succeeds.
const PLAN = [
  // Catastrophic offenders — convert PNG → JPG (photos don't need PNG)
  { in: "public/videos/work-team-pic.png",                 out: "public/videos/work-team-pic.jpg",                 maxEdge: 1920, quality: 78, deleteSource: true },
  { in: "src/assets/ai-preview/before-bathroom.png",       out: "src/assets/ai-preview/before-bathroom.jpg",       maxEdge: 1600, quality: 80, deleteSource: true },
  { in: "src/assets/ai-preview/after-bathroom.png",        out: "src/assets/ai-preview/after-bathroom.jpg",        maxEdge: 1600, quality: 80, deleteSource: true },

  // about-hero is already JPG; resize + re-encode in place
  { in: "public/images/about-hero-team.jpg",               maxEdge: 2400, quality: 78 },

  // Service card images — heavy JPGs, displayed at ~640px width max
  { in: "src/assets/services/card-general-remodeling.jpg", maxEdge: 1600, quality: 78 },
  { in: "src/assets/services/card-windows-doors.jpg",      maxEdge: 1600, quality: 78 },
  { in: "src/assets/services/roof-repair.jpg",             maxEdge: 1600, quality: 78 },
  { in: "src/assets/services/card-kitchen.jpg",            maxEdge: 1600, quality: 78 },
  { in: "src/assets/services/card-roofing.jpg",            maxEdge: 1600, quality: 78 },
  { in: "src/assets/services/card-bathroom.jpg",           maxEdge: 1600, quality: 78 },
  { in: "src/assets/services/card-storm-damage.jpg",       maxEdge: 1600, quality: 78 },
  { in: "src/assets/services/card-siding.jpg",             maxEdge: 1600, quality: 78 },
  { in: "src/assets/services/team-hero.jpg",               maxEdge: 1920, quality: 78 },

  // Hero images — bigger, but compressed harder; max edge 2400 for LCP
  { in: "src/assets/home/hero-roofing.jpg",                maxEdge: 2400, quality: 75 },
  { in: "src/assets/home/hero-roofing-team.jpg",           maxEdge: 2400, quality: 75 },
  { in: "src/assets/home/hero-solar.jpg",                  maxEdge: 2400, quality: 75 },
  { in: "src/assets/home/hero-solar-wide.jpg",             maxEdge: 2400, quality: 75 },
  { in: "src/assets/home/hero-roof-work.jpg",              maxEdge: 2400, quality: 75 },
  { in: "src/assets/home/hero-construction.jpg",           maxEdge: 2400, quality: 75 },
];

async function fileSize(p) {
  try { return (await fs.stat(p)).size; } catch { return 0; }
}

function fmtKB(bytes) {
  return (bytes / 1024).toFixed(1) + " KB";
}

let totalBefore = 0;
let totalAfter = 0;
let totalSaved = 0;
const rows = [];

for (const entry of PLAN) {
  const srcAbs = path.join(ROOT, entry.in);
  const outRel = entry.out ?? entry.in;
  const outAbs = path.join(ROOT, outRel);
  const beforeBytes = await fileSize(srcAbs);
  if (!beforeBytes) {
    rows.push({ file: entry.in, status: "missing", before: 0, after: 0 });
    continue;
  }

  // Read into buffer so we can safely overwrite the same path
  const buf = await fs.readFile(srcAbs);
  let pipeline = sharp(buf, { failOn: "none" })
    .rotate() // honor EXIF orientation if present
    .resize({ width: entry.maxEdge, height: entry.maxEdge, fit: "inside", withoutEnlargement: true });

  pipeline = pipeline.jpeg({ quality: entry.quality, mozjpeg: true, chromaSubsampling: "4:2:0" });

  const result = await pipeline.toBuffer();

  // Write to temp then rename to avoid partial writes
  const tmp = outAbs + ".tmp";
  await fs.writeFile(tmp, result);
  await fs.rename(tmp, outAbs);

  if (entry.deleteSource && srcAbs !== outAbs) {
    try { await fs.unlink(srcAbs); } catch { /* ignore */ }
  }

  const afterBytes = await fileSize(outAbs);
  totalBefore += beforeBytes;
  totalAfter += afterBytes;
  totalSaved += beforeBytes - afterBytes;
  rows.push({ file: entry.in, out: outRel, before: beforeBytes, after: afterBytes });
}

console.log("");
console.log("─────────────────────────────────────────────────────────────────────");
console.log("Image optimization report (Sprint Task 12)");
console.log("─────────────────────────────────────────────────────────────────────");
for (const r of rows) {
  if (r.status === "missing") {
    console.log(`  ${r.file.padEnd(58)}  MISSING`);
    continue;
  }
  const ratio = r.before ? Math.round(100 - (r.after / r.before) * 100) : 0;
  const renamed = r.out && r.out !== r.file ? `  →  ${r.out}` : "";
  console.log(
    `  ${(r.file + renamed).padEnd(58)}  ${fmtKB(r.before).padStart(10)}  ->  ${fmtKB(r.after).padStart(10)}   (-${ratio}%)`,
  );
}
console.log("─────────────────────────────────────────────────────────────────────");
console.log(`  TOTALS                                                       ${fmtKB(totalBefore).padStart(10)}  ->  ${fmtKB(totalAfter).padStart(10)}   (-${Math.round(100 - (totalAfter / totalBefore) * 100)}%)`);
console.log(`  Saved: ${fmtKB(totalSaved)}`);
console.log("");
