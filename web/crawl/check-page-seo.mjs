import assert from 'node:assert/strict';
import { pageTitles } from '../src/lib/page-seo.ts';

const base = process.argv[2] || 'http://127.0.0.1:3000';
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");
function meta(html, key) {
  const tag = [...html.matchAll(/<meta\s[^>]*>/g)].map((m) => m[0]).find((tag) => tag.includes(`="${key}"`));
  return decode(tag?.match(/content="([^"]*)"/)?.[1] || '');
}

// Bounded concurrency keeps this useful against both local development and production builds.
const paths = Object.keys(pageTitles);
for (let offset = 0; offset < paths.length; offset += 3) {
  await Promise.all(paths.slice(offset, offset + 3).map(async (path) => {
    const response = await fetch(new URL(path, base));
    assert.equal(response.status, 200, path);
    const html = await response.text();
    const expected = pageTitles[path];
    assert.equal(decode(html.match(/<title>([^<]*)<\/title>/)?.[1] || ''), expected, `${path}: HTML title`);
    assert.equal(meta(html, 'og:title'), expected, `${path}: Open Graph title`);
    assert.equal(meta(html, 'twitter:title'), expected, `${path}: Twitter title`);
    assert.equal((html.match(/<title>/g) || []).length, 1, `${path}: single title`);
    console.log(`OK ${path}`);
  }));
}
const sitemap = await (await fetch(new URL('/sitemap.xml', base))).text();
assert.ok(sitemap.includes('/exclusive-collection/'), 'Collection is included in sitemap');
console.log(`Verified ${paths.length} exact SEO titles and collection sitemap entry.`);
