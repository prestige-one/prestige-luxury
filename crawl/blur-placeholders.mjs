// Generates tiny base64 blur placeholders for the LOCAL images used as page heroes / banners,
// and writes them to web/content/blur.json as { "/wp-content/...": "data:image/jpeg;base64,..." }.
// `web/src/components/Media.tsx` looks every image's src up in that map and, when it finds one,
// renders it as the loading placeholder (`placeholder="blur"`).
//
// Usage: node crawl/blur-placeholders.mjs [--check]
//   --check  report what would be generated without writing the file.
//
// Only heroes/banners are included — the ~800 content images would make the map far too big for
// a file that ships inside the client bundle. "Hero/banner" means, in the site source:
//   * an <Image>/<Media> carrying `priority` (step 3 gives every page's hero image `priority`),
//   * a full-bleed image (`sizes="100vw"`) or a `fill` background photo behind a section,
//   * the `image` prop of <PageBanner> / <CtaBanner>,
//   * a `heroImage:` / `background:` property of a landing-page config object.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const webDir = path.join(root, 'web');
const srcDir = path.join(webDir, 'src');
const publicDir = path.join(webDir, 'public');
const outFile = path.join(webDir, 'content', 'blur.json');

// sharp is a dependency of Next, so it only resolves from web/node_modules.
const require = createRequire(path.join(webDir, 'package.json'));
let sharp;
try {
  sharp = require('sharp');
} catch (err) {
  console.error('sharp could not be loaded — no blur placeholders were generated.');
  console.error(String(err?.message || err));
  process.exit(1);
}

const BLUR_WIDTH = 10; // px — keeps each data URI a few hundred bytes
const BLUR_QUALITY = 40;

/** Scraped from a competitor and being removed from the project — never reference these. */
const EXCLUDED = /^\/wp-content\/uploads\/2026\/11\//;

const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.tsx$/.test(entry.name)) files.push(full);
  }
})(srcDir);

const isLocalImage = (p) => /^\/wp-content\/uploads\/.+\.(jpe?g|png|webp|avif)$/i.test(p);

/** Every local image path mentioned in a chunk of source, including `up("file.jpg")` helpers. */
function pathsIn(text, upPrefix) {
  const out = [];
  for (const [, p] of text.matchAll(/["'`](\/wp-content\/uploads\/[^"'`\s]+)["'`]/g)) out.push(p);
  if (upPrefix) for (const [, f] of text.matchAll(/\bup\(\s*["']([^"']+)["']\s*\)/g)) out.push(upPrefix + f);
  return out.filter(isLocalImage);
}

/** Source file → the hero/banner image paths it references. */
function heroPathsInFile(source) {
  const found = new Set();
  const up = source.match(/const up = \(f: string\) => `([^`$]*)\$\{f\}`/);
  const upPrefix = up?.[1];

  // <Image …/> and <Media …/> that are heroes: `priority`, or full-bleed `sizes="100vw"`.
  for (const [element] of source.matchAll(/<(?:Image|Media)\b[\s\S]*?\/>/g)) {
    // `fill` only ever covers a whole section here (banners, section backgrounds, hero photos);
    // the inline content images are all width/height images and are left out of the map.
    if (!/\bpriority\b/.test(element) && !/sizes="100vw"/.test(element) && !/\bfill\b/.test(element)) continue;
    for (const p of pathsIn(element, upPrefix)) found.add(p);
  }
  // Banner components: the whole element, the `image` prop is the only image in it.
  for (const [element] of source.matchAll(/<(?:PageBanner|CtaBanner)\b[\s\S]*?\/>/g)) {
    for (const p of pathsIn(element, upPrefix)) found.add(p);
  }
  // Landing-page config objects: `heroImage: …`, `background: …`.
  for (const [line] of source.matchAll(/^.*\b(?:heroImage|background|bannerImage|banner):.*$/gm)) {
    for (const p of pathsIn(line, upPrefix)) found.add(p);
  }
  return found;
}

const wanted = new Set();
const skipped = { excluded: [], missing: [] };
for (const file of files) {
  for (const p of heroPathsInFile(readFileSync(file, 'utf8'))) {
    if (EXCLUDED.test(p)) {
      skipped.excluded.push(p);
      continue;
    }
    const onDisk = path.join(publicDir, p.replace(/^\//, '').split('/').join(path.sep));
    try {
      if (!statSync(onDisk).isFile()) throw new Error('not a file');
    } catch {
      skipped.missing.push(p);
      continue;
    }
    wanted.add(p);
  }
}

const blurFor = async (p) => {
  const onDisk = path.join(publicDir, p.replace(/^\//, '').split('/').join(path.sep));
  const img = sharp(onDisk);
  // Transparent sources (logos, cut-out graphics) stay PNG; flattening them to JPEG would put a
  // solid rectangle where the page shows nothing. Photos go to JPEG, which is far smaller.
  const { hasAlpha } = await img.metadata();
  const resized = img.resize(BLUR_WIDTH, null, { fit: 'inside', withoutEnlargement: true });
  const buf = hasAlpha
    ? await resized.png({ compressionLevel: 9, palette: true }).toBuffer()
    : await resized.jpeg({ quality: BLUR_QUALITY }).toBuffer();
  return `data:image/${hasAlpha ? 'png' : 'jpeg'};base64,${buf.toString('base64')}`;
};

const map = {};
for (const p of [...wanted].sort()) {
  try {
    map[p] = await blurFor(p);
  } catch (err) {
    console.warn(`! could not read ${p}: ${err?.message || err}`);
  }
}

const json = `${JSON.stringify(map, null, 2)}\n`;
const kb = (Buffer.byteLength(json) / 1024).toFixed(1);
console.log(`${Object.keys(map).length} hero/banner placeholders, ${kb} KB`);
if (skipped.excluded.length) console.log(`skipped (2026/11, being removed): ${new Set(skipped.excluded).size}`);
if (skipped.missing.length) console.log(`skipped (file not on disk): ${[...new Set(skipped.missing)].join(', ')}`);

if (process.argv.includes('--check')) {
  console.log([...wanted].sort().join('\n'));
} else {
  writeFileSync(outFile, json);
  console.log(`→ ${path.relative(root, outFile)}`);
}
