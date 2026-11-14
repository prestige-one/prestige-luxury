import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, 'web/content', file), 'utf8'));
const posts = read('posts.json'), categories = read('categories.json').filter((c) => c.count);
const report = JSON.parse(fs.readFileSync(path.join(root, 'docs/blog/import-report.json'), 'utf8'));
assert.equal(posts.length, report.posts);
assert.equal(report.missingImages.length, 0);
assert.equal(new Set(posts.map((post) => post.path)).size, posts.length);
for (const post of posts) {
  assert.match(post.image, /^\/images\/blog\//);
  assert.ok(!post.image.includes('Prestige-logo'), post.path);
  assert.equal(post.author, 'Prestige Luxury Real Estate');
  assert.ok(fs.existsSync(path.join(root, 'web/public', post.image)), post.path);
  assert.ok(post.seo.title && post.seo.description);
  assert.ok(!Number.isNaN(Date.parse(post.date)));
  const $ = load(post.html);
  assert.equal($('script,iframe,h1,form').length, 0, post.path);
  assert.equal($.text().match(/https?:\/\//), null, `Visible raw URL: ${post.path}`);
  $('img').each((_, image) => {
    const src = $(image).attr('src');
    assert.match(src, /^\/images\/blog\//, post.path);
    assert.ok(fs.existsSync(path.join(root, 'web/public', src)), src);
  });
  $('a[href]').each((_, anchor) => {
    const el = $(anchor), href = el.attr('href');
    if (/^https?:\/\//.test(href)) {
      assert.equal(el.attr('target'), '_blank', href);
      assert.match(el.attr('rel'), /noopener/);
      assert.match(el.attr('rel'), /noreferrer/);
    }
  });
}
for (const category of categories) assert.equal(category.count, posts.filter((post) => post.categories.includes(category.id)).length);
const origin = process.argv[2];
if (origin) {
  const res = await fetch(`${origin}/sitemap.xml`);
  assert.equal(res.status, 200);
  const $ = load(await res.text(), { xml: true });
  const sitemap = $('loc').toArray().map((el) => $(el).text());
  assert.equal(new Set(sitemap).size, sitemap.length, 'Duplicate sitemap URLs');
  assert.ok(!sitemap.some((url) => /\/(tag|thank-you|search-results)\//.test(url)));
  const routes = ['/blog/', '/blog/page/2/', '/contact-us/', ...posts.map((post) => post.path), ...categories.map((category) => category.path)];
  for (const post of posts) assert.ok(sitemap.includes(`https://prestigeluxury.ae${post.path}`), post.path);
  for (const category of categories) assert.ok(sitemap.includes(`https://prestigeluxury.ae${category.path}`), category.path);
  let cursor = 0;
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (cursor < routes.length) {
      const route = routes[cursor++], response = await fetch(origin + route);
      assert.equal(response.status, 200, route);
      const html = await response.text();
      assert.ok(!html.includes('Invalid Date'), route);
    }
  }));
  const tag = await fetch(`${origin}/tag/retired/`, { redirect: 'manual' });
  assert.equal(tag.status, 308);
  assert.equal(new URL(tag.headers.get('location'), origin).pathname, '/blog/');
  const redirects = read('blog-redirects.json');
  for (const redirect of redirects) {
    const response = await fetch(origin + redirect.source, { redirect: 'manual' });
    assert.equal(response.status, 308, redirect.source);
    assert.equal(new URL(response.headers.get('location'), origin).pathname, redirect.destination);
  }
  for (const route of ['/blog/page/999/', '/category/blog/page/999/']) assert.equal((await fetch(origin + route)).status, 404);
  console.log(`HTTP: ${routes.length} pages, sitemap, tag retirement and invalid pagination passed.`);
}
console.log(`Content: ${posts.length} posts, ${categories.length} categories, ${report.images} local assets passed.`);
