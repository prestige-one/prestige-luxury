// Collects every asset (images, Elementor CSS) referenced by pages/posts and mirrors them
// into ../web/public keeping the original /wp-content/... paths.
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = 'https://prestigeluxury.ae';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36';
const PUBLIC = new URL('../web/public/', import.meta.url);
const data = (f) => readFile(new URL(`./data/${f}`, import.meta.url), 'utf8').then(JSON.parse);

const pages = await data('pages.json');
const posts = await data('posts.json');
const media = await data('media.json');
const agents = await data('agents.json');
const testimonials = await data('testimonials.json');

const urls = new Set();
const grab = (text) => {
  for (const m of text.matchAll(/(?:https?:)?\/\/prestigeluxury\.ae(\/wp-content\/[^"'()\s,<>\\]+)/g)) urls.add(m[1]);
  for (const m of text.matchAll(/["'(\s](\/wp-content\/[^"'()\s,<>\\]+)/g)) urls.add(m[1]);
};

// Elementor per-page CSS + kit CSS
const cssIds = new Set([...pages, ...posts].map((p) => p.id));
const cssFiles = [...cssIds].map((id) => `/wp-content/uploads/elementor/css/post-${id}.css`);
for (const c of cssFiles) urls.add(c);

for (const p of [...pages, ...posts, ...agents, ...testimonials]) grab(JSON.stringify(p));
for (const m of media) urls.add(new URL(m.source_url).pathname);
// Known header/footer assets
urls.add('/wp-content/uploads/2022/11/logo-prestige-luxury-white-2x.png');
urls.add('/wp-content/uploads/2020/06/logo-prestige-black-1x.png');

const exists = (p) => access(p).then(() => true, () => false);
let ok = 0, miss = 0;
const failed = [];
const list = [...urls].map((u) => decodeURI(u.split('?')[0].split('#')[0].split('&')[0])).filter((u) => !u.endsWith('/'));

async function fetchOne(path) {
  const dest = fileURLToPath(new URL('.' + path, PUBLIC));
  if (await exists(dest)) { ok++; return; }
  const res = await fetch(SITE + encodeURI(path), { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) }).catch((e) => ({ ok: false, status: e.name }));
  const type = res.headers?.get?.('content-type') || '';
  if (!res.ok || type.includes('text/html')) { miss++; failed.push(`${res.status} ${path}`); return; }
  await mkdir(dirname(dest), { recursive: true });
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  ok++;
  // CSS can reference more assets (backgrounds, fonts)
  if (path.endsWith('.css')) {
    const css = buf.toString('utf8');
    for (const m of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
      const u = m[1];
      if (u.startsWith('data:')) continue;
      const abs = new URL(u, SITE + path);
      if (abs.host === 'prestigeluxury.ae' && !queued.has(abs.pathname)) { queued.add(abs.pathname); queue.push(decodeURI(abs.pathname)); }
    }
  }
}

const queued = new Set(list);
const queue = [...list];
const workers = Array.from({ length: 8 }, async () => { while (queue.length) await fetchOne(queue.shift()); });
await Promise.all(workers);
await writeFile(new URL('./data/asset-failures.txt', import.meta.url), failed.join('\n'));
console.log(`downloaded/present: ${ok}, failed: ${miss} (see data/asset-failures.txt)`);
