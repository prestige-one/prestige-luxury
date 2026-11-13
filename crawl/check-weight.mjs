// Measures what each page actually costs to load: HTML, JS/CSS, fonts and images.
// Usage: node crawl/check-weight.mjs [base-url]
const base = (process.argv[2] || 'https://prestigeluxury-web.vercel.app').replace(/\/$/, '');

const PAGES = [
  '/', '/properties/', '/status/for-sale/', '/status/for-rent/', '/property-type/apartment/',
  '/area/dubai-marina/', '/about/', '/services/', '/blog/', '/meet-the-team/',
  '/projects-for-sale/', '/sell/', '/contact-us/', '/areas/',
];

const unesc = (s) => s.replace(/&(?:amp|AMP);/g, '&').replace(/&(?:quot|QUOT);/g, '"').replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d));

async function size(url) {
  try {
    const r = await fetch(url, { headers: { 'user-agent': 'site-weight-check', 'accept-encoding': 'gzip, br' } });
    const buf = Buffer.from(await r.arrayBuffer());
    return { ok: r.ok, bytes: buf.length, type: r.headers.get('content-type') || '', cache: r.headers.get('cache-control') || '', body: buf };
  } catch {
    return { ok: false, bytes: 0, type: '', cache: '', body: Buffer.alloc(0) };
  }
}

async function pool(items, n, fn) {
  const out = [];
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k]); }
  }));
  return out;
}

const rows = [];
for (const path of PAGES) {
  const page = await size(base + path);
  if (!page.ok) { console.log(`!! ${path} did not load`); continue; }
  const html = page.body.toString('utf8');

  const assets = new Set();
  const addSrcset = (v) => { if (v) for (const p of v.split(',')) { const u = p.trim().split(/\s+/)[0]; if (u) assets.add(u); } };
  for (const m of html.matchAll(/<(?:img|source)\b[^>]*>/gi)) {
    const t = m[0];
    const s = /\bsrc="([^"]*)"/i.exec(t)?.[1];
    if (s) assets.add(s);
    addSrcset(/\bsrcset="([^"]*)"/i.exec(t)?.[1]);
  }
  for (const m of html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/gi)) assets.add(m[1]);
  for (const m of html.matchAll(/<link\b[^>]*\brel="(?:stylesheet|preload)"[^>]*\bhref="([^"]+)"/gi)) assets.add(m[1]);
  for (const m of html.matchAll(/<link\b[^>]*\bhref="([^"]+)"[^>]*\brel="(?:stylesheet|preload)"/gi)) assets.add(m[1]);

  // Only what the browser fetches up front: the first image candidate of each srcset is enough
  // to show the order of magnitude without downloading every resize.
  const urls = [...assets].map(unesc).map((u) => { try { return new URL(u, base).toString(); } catch { return null; } }).filter(Boolean);
  const got = await pool(urls, 12, size);

  const sum = (pred) => got.filter((g, i) => pred(urls[i], g)).reduce((a, g) => a + g.bytes, 0);
  const isImg = (u, g) => /^image\//.test(g.type);
  const isJs = (u, g) => /javascript/.test(g.type);
  const isCss = (u, g) => /text\/css/.test(g.type);
  const isFont = (u, g) => /font/.test(g.type);
  const external = got.filter((g, i) => isImg(urls[i], g) && !urls[i].startsWith(base)).reduce((a, g) => a + g.bytes, 0);

  rows.push({
    path, html: page.bytes, js: sum(isJs), css: sum(isCss), font: sum(isFont), img: sum(isImg), externalImg: external,
    total: page.bytes + sum(() => true), reqs: urls.length + 1,
  });
}

const kb = (n) => (n / 1024).toFixed(0).padStart(6);
console.log('\n' + 'page'.padEnd(28) + ['HTML', 'JS', 'CSS', 'FONT', 'IMG', '(ext)', 'TOTAL', 'reqs'].map((h) => h.padStart(7)).join(''));
for (const r of rows.sort((a, b) => b.total - a.total)) {
  console.log(r.path.padEnd(28) + [r.html, r.js, r.css, r.font, r.img, r.externalImg, r.total].map(kb).join(' ') + String(r.reqs).padStart(7));
}
console.log('\nall sizes in KB (transfer size, compressed where the server compresses)');
