// Finds page sections that are long runs of text with no imagery — the places the site
// reads as "empty". Usage: node crawl/check-sections.mjs [base-url]
import { writeFileSync } from 'node:fs';

const base = (process.argv[2] || 'https://prestigeluxury-web.vercel.app').replace(/\/$/, '');

const text = async (u) => {
  for (let a = 0; a < 3; a++) {
    try { const r = await fetch(u, { headers: { 'user-agent': 'site-section-check' } }); if (r.ok) return await r.text(); if (r.status < 500) return null; } catch {}
    await new Promise((r) => setTimeout(r, 300 * (a + 1)));
  }
  return null;
};
async function pool(items, n, fn) {
  const out = []; let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } }));
  return out;
}

const xml = await text(`${base}/sitemap.xml`);
const all = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, base));
// One representative of each repeating template is enough; the hand-built pages are the point.
const skip = /\/(property|blog|area|category|tag|luxury-living|luxury-property-market|real-estate)\//;
const seen = new Set();
const pages = all.filter((u) => {
  const p = u.replace(base, '');
  if (!skip.test(p)) return true;
  const key = p.split('/').slice(0, 2).join('/');
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

const strip = (h) => h.replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();

const findings = [];
await pool(pages, 8, async (url) => {
  const html = await text(url);
  if (!html) return;
  const main = /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(html)?.[1] ?? html;
  // Split on top-level-ish <section> starts; good enough to attribute images and copy to a block.
  const parts = main.split(/(?=<section\b)/i).filter((p) => /^<section\b/i.test(p));
  const page = url.replace(base, '');
  parts.forEach((part, i) => {
    const body = part.slice(0, part.lastIndexOf('</section>') + 1 || undefined);
    const imgs = (body.match(/<img\b/gi) || []).length;
    const media = imgs + (body.match(/<(?:video|iframe)\b/gi) || []).length;
    const words = strip(body).split(' ').filter(Boolean).length;
    const heading = strip(/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/i.exec(body)?.[1] ?? '').slice(0, 44);
    if (media === 0 && words >= 90) findings.push({ page, i, heading, words, media });
  });
});

findings.sort((a, b) => b.words - a.words);
writeFileSync(new URL('./data/section-report.json', import.meta.url), JSON.stringify({ base, pages: pages.length, findings }, null, 1) + '\n');

const byPage = new Map();
for (const f of findings) byPage.set(f.page, (byPage.get(f.page) || 0) + 1);
console.log(`${pages.length} template pages checked; ${findings.length} text-only sections across ${byPage.size} pages\n`);
console.log('worst pages:');
for (const [p, n] of [...byPage].sort((a, b) => b[1] - a[1]).slice(0, 20)) console.log(`  ${String(n).padStart(2)} text-only section(s)  ${p}`);
console.log('\nbiggest text-only sections:');
for (const f of findings.slice(0, 30)) console.log(`  ${String(f.words).padStart(4)}w  ${f.page.padEnd(34)} ${f.heading}`);
