import assert from 'node:assert/strict';
import { isPagePublished, unpublishedPagePaths } from '../src/lib/site.ts';

const base = process.argv[2] || 'http://127.0.0.1:3000';
for (const path of unpublishedPagePaths) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 404, `${path}: must be unavailable`);
  const html = await response.text();
  assert.match(html, /<meta name="robots" content="noindex"/, `${path}: must not be indexed`);
  console.log(`404 / noindex ${path}`);
}
const sitemap = await (await fetch(new URL('/sitemap.xml', base))).text();
for (const path of unpublishedPagePaths) assert.ok(!sitemap.includes(path), `${path}: absent from sitemap`);
for (const path of ['/', '/services/', '/investment-guide/', '/tenants-guide/', '/projects-for-sale/', '/developers/prestige-one-developments/']) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, path);
  const html = await response.text();
  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) assert.ok(isPagePublished(href), `${path}: draft link ${href}`);
  console.log(`Links clean ${path}`);
}
console.log('All four drafts return 404 / noindex, are absent from sitemap, and have no remaining public links.');
