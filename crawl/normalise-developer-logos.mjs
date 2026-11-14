// Developer logos come off each developer's own website, and most are drawn for a dark header:
// a white wordmark on transparency. The home-page strip sits on cream (#faf8f4), where a white
// mark is invisible. This re-colours the ones that are safe to re-colour — a mark that is pure
// white and nothing else is monochrome artwork, so turning it black changes no detail, exactly
// as crawl/make-black-logo.mjs does for the agency's own logo.
//
// A logo with real colour in it is left alone and reported: inverting a brand's colours would
// misrepresent it, so those need a dark-background variant from the developer instead.
//
// Run from the repo root:  node crawl/normalise-developer-logos.mjs
// Re-runs are safe: every file it changes is recorded in .normalised.json and skipped after.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const sharp = createRequire(new URL('../web/package.json', import.meta.url)).call(null, 'sharp');

const dir = fileURLToPath(new URL('../web/public/brand/developers/', import.meta.url));
const ledgerPath = path.join(dir, '.normalised.json');
const ledger = existsSync(ledgerPath) ? JSON.parse(readFileSync(ledgerPath, 'utf8')) : {};

const INK = '#111111';
// every way the fetched files spell white
const WHITE = /(?:#fff(?:fff)?\b|#fffffe\b|\bwhite\b|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\))/gi;
// any colour token that is NOT white and NOT "none" means the mark carries real colour
const COLOUR = /#[0-9a-f]{3,8}\b|\brgba?\([^)]*\)|\b(?:black|red|blue|green|gold|orange|purple|yellow|grey|gray|silver|maroon|navy|teal)\b/gi;

const results = [];

for (const file of readdirSync(dir).sort()) {
  if (file.startsWith('.')) continue;
  const full = path.join(dir, file);
  const ext = path.extname(file).toLowerCase();

  if (ledger[file]) {
    results.push([file, 'skipped', 'already normalised']);
    continue;
  }

  if (ext === '.svg') {
    const src = readFileSync(full, 'utf8');
    const tokens = (src.match(COLOUR) ?? []).filter((t) => !WHITE.test(`${t} `));
    WHITE.lastIndex = 0;
    const whites = src.match(WHITE) ?? [];
    if (!whites.length) {
      results.push([file, 'left as is', tokens.length ? 'has its own colours' : 'no white to re-colour (defaults to black)']);
      continue;
    }
    if (tokens.length) {
      results.push([file, 'NEEDS A DARK VARIANT', `white plus ${tokens.length} other colour token(s) — not safe to re-colour`]);
      continue;
    }
    writeFileSync(full, src.replace(WHITE, INK));
    ledger[file] = { at: new Date().toISOString(), change: `white → ${INK}` };
    results.push([file, 're-coloured', `${whites.length} white fill(s) → ${INK}`]);
    continue;
  }

  // raster: invert only artwork that is white and unsaturated through and through.
  // sharp is handed the bytes rather than the path: on Windows it keeps the file open long
  // enough that writing back to the same path fails with UNKNOWN/EBUSY.
  const original = readFileSync(full);
  const { data, info } = await sharp(original).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let opaque = 0;
  let nearWhite = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 200) continue;
    opaque++;
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    if (Math.min(r, g, b) >= 200 && Math.max(r, g, b) - Math.min(r, g, b) <= 20) nearWhite++;
  }
  const share = opaque ? nearWhite / opaque : 0;
  if (share < 0.2) {
    results.push([file, 'left as is', `only ${Math.round(share * 100)}% of the mark is plain white — it already reads on cream`]);
    continue;
  }
  // Only the white is darkened. A two-tone mark (Danube's white wordmark beside its red device)
  // keeps its brand colour and loses only the part that would be invisible on cream — which is
  // what the developer's own dark-background variant does.
  const ink = [0x11, 0x11, 0x11];
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 8) continue;
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    if (Math.min(r, g, b) >= 200 && Math.max(r, g, b) - Math.min(r, g, b) <= 20) {
      [data[i], data[i + 1], data[i + 2]] = ink;
    }
  }
  const out = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .toFormat(ext === '.webp' ? 'webp' : 'png')
    .toBuffer();
  writeFileSync(full, out);
  ledger[file] = { at: new Date().toISOString(), change: 'white → #111111' };
  results.push([file, 're-coloured', `${opaque} opaque pixels, white → black`]);
}

writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));
const width = Math.max(...results.map(([f]) => f.length));
for (const [file, action, note] of results) console.log(`${file.padEnd(width)}  ${action.padEnd(22)} ${note}`);
