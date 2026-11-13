// Crawls every page in the sitemap and reports images that do not load.
// Usage: node crawl/check-images.mjs [base-url]
// Writes the full report to crawl/data/image-report.json.
import { writeFileSync, mkdirSync } from 'node:fs';

const base = (process.argv[2] || 'https://prestigeluxury-web.vercel.app').replace(/\/$/, '');

// HTML attributes arrive entity-encoded ("&amp;w=640"); requesting them raw makes Next's image
// optimiser reject the query string, which looks exactly like a missing image. Decode first.
const unescapeHtml = (s) =>
  s
    .replace(/&(?:amp|AMP);/g, '&')
    .replace(/&(?:quot|QUOT);/g, '"')
    .replace(/&(?:apos|#0?39|#x0?27);/gi, "'")
    .replace(/&(?:lt|LT);/g, '<')
    .replace(/&(?:gt|GT);/g, '>')
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));

const abs = (u) => { try { return new URL(unescapeHtml(u), base).toString(); } catch { return null; } };

async function pool(items, size, fn) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (i < items.length) {
        const n = i++;
        out[n] = await fn(items[n], n);
      }
    }),
  );
  return out;
}

const text = async (url) => {
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'site-image-check' } });
      if (r.ok) return await r.text();
      if (r.status < 500) return null;
    } catch {}
    await new Promise((r) => setTimeout(r, 400 * (a + 1)));
  }
  return null;
};

console.log(`Reading sitemap from ${base} …`);
const xml = await text(`${base}/sitemap.xml`);
if (!xml) throw new Error('could not read sitemap.xml');
const pages = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(/^https?:\/\/[^/]+/, base))
  .filter((v, i, s) => s.indexOf(v) === i);
console.log(`${pages.length} pages`);

// asset url -> set of pages that reference it
const refs = new Map();
const add = (raw, page) => {
  if (!raw) return;
  const u = abs(raw.trim());
  if (!u || !u.startsWith(base)) return; // only our own assets
  if (!refs.has(u)) refs.set(u, new Set());
  refs.get(u).add(page);
};

const failedPages = [];
await pool(pages, 8, async (page) => {
  const html = await text(page);
  if (html == null) { failedPages.push(page); return; }
  // A srcset is a comma-separated list of "<url> <descriptor>" pairs — each candidate has to be
  // pulled out on its own, or the whole attribute gets requested as if it were one URL.
  const addSrcset = (value) => {
    if (!value) return;
    for (const part of value.split(',')) {
      const url = part.trim().split(/\s+/)[0];
      if (url) add(url, page);
    }
  };
  for (const m of html.matchAll(/<(?:img|source)\b[^>]*>/gi)) {
    const tag = m[0];
    add(/\bsrc="([^"]*)"/i.exec(tag)?.[1], page);
    addSrcset(/\bsrcset="([^"]*)"/i.exec(tag)?.[1]);
    addSrcset(/\bimagesrcset="([^"]*)"/i.exec(tag)?.[1]);
  }
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0];
    if (!/\bas="image"/i.test(tag) && !/\.(?:jpe?g|png|webp|gif|svg|avif)/i.test(tag)) continue;
    addSrcset(/\bimagesrcset="([^"]*)"/i.exec(tag)?.[1]);
    const href = /\bhref="([^"]*)"/i.exec(tag)?.[1];
    if (href && /\.(?:jpe?g|png|webp|gif|svg|avif)|_next\/image/i.test(href)) add(href, page);
  }
  for (const m of html.matchAll(/url\((?:&quot;|["']|&#x27;)?((?:[^)"']|&amp;)+?\.(?:jpe?g|png|webp|gif|svg|avif)(?:[^)"']|&amp;)*?)(?:&quot;|["']|&#x27;)?\)/gi)) {
    add(m[1], page);
  }
});

const assets = [...refs.keys()];
console.log(`${assets.length} distinct image URLs; checking …`);

const results = await pool(assets, 16, async (url) => {
  for (let a = 0; a < 2; a++) {
    try {
      let r = await fetch(url, { method: 'HEAD', headers: { 'user-agent': 'site-image-check' } });
      if (r.status === 405 || r.status === 501) r = await fetch(url, { headers: { 'user-agent': 'site-image-check' } });
      return { url, status: r.status, type: r.headers.get('content-type') || '', bytes: Number(r.headers.get('content-length') || 0) };
    } catch (e) {
      if (a) return { url, status: 0, type: '', bytes: 0, error: String(e.message || e) };
    }
  }
  return { url, status: 0, type: '', bytes: 0 };
});

const bad = results.filter((r) => r.status !== 200 || !/^image\//.test(r.type));
const report = bad
  .map((r) => ({ ...r, pages: [...refs.get(r.url)].slice(0, 6), pageCount: refs.get(r.url).size }))
  .sort((a, b) => b.pageCount - a.pageCount);

mkdirSync(new URL('./data/', import.meta.url), { recursive: true });
writeFileSync(new URL('./data/image-report.json', import.meta.url), JSON.stringify({ base, pages: pages.length, assets: assets.length, failedPages, broken: report }, null, 1) + '\n');

console.log(`\n${report.length} broken of ${assets.length} images`);
if (failedPages.length) console.log(`pages that would not load: ${failedPages.join(', ')}`);
for (const r of report.slice(0, 50)) {
  console.log(`${String(r.status).padStart(3)}  ${r.url.replace(base, '')}`);
  console.log(`     on ${r.pageCount} page(s): ${r.pages.map((p) => p.replace(base, '')).join(' ')}`);
}
if (report.length > 50) console.log(`… and ${report.length - 50} more (see crawl/data/image-report.json)`);
