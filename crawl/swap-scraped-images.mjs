// Replaces the last photographs taken from a competitor's site with the client's own.
// Run from the repo root: node crawl/swap-scraped-images.mjs [--check]
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../web/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const check = process.argv.includes('--check');

// scraped file -> the client's own photograph that takes its place
const swaps = {
  '/wp-content/uploads/2026/11/city-view.webp': '/wp-content/uploads/2019/06/emaar-downtown-1536x864.jpg',
  '/wp-content/uploads/2026/11/dubai-skyline-view.webp': '/wp-content/uploads/2019/05/mbr-city-dubai.jpg',
  '/wp-content/uploads/2026/11/JBR.webp': '/wp-content/uploads/2019/07/jbr-beach-2048x1271.jpg',
  '/wp-content/uploads/2026/11/Dubai-Skyline.webp': '/wp-content/uploads/2021/04/aerial-view-of-dubai-palm-jumeirah-island-1170x785.jpg',
};

for (const [, to] of Object.entries(swaps)) {
  if (!existsSync(join(root, 'public', to))) throw new Error(`replacement missing: ${to}`);
}
console.log(`${Object.keys(swaps).length} replacements all present on disk`);

const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|css|json)$/.test(e)) files.push(p);
  }
})(join(root, 'src'));

let changed = 0;
const hits = {};
for (const f of files) {
  const before = readFileSync(f, 'utf8');
  let after = before;
  for (const [from, to] of Object.entries(swaps)) {
    if (!after.includes(from)) continue;
    const n = after.split(from).length - 1;
    hits[from] = (hits[from] || 0) + n;
    after = after.split(from).join(to);
  }
  if (after !== before) {
    changed++;
    if (!check) writeFileSync(f, after);
    console.log(`  ${check ? 'would patch' : 'patched'}  ${f.slice(root.length)}`);
  }
}

console.log(`\n${check ? 'would change' : 'changed'} ${changed} file(s)`);
for (const [from, n] of Object.entries(hits)) console.log(`  ${n}x  ${from.split('/').pop()}`);
const missed = Object.keys(swaps).filter((k) => !hits[k]);
if (missed.length) console.log(`\nnot referenced anywhere (safe to just delete): ${missed.map((m) => m.split('/').pop()).join(', ')}`);
