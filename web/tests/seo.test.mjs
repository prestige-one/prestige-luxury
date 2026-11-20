import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import sharp from 'sharp';
import { createSourceLoader } from './helpers/load-source.mjs';

let host = 'prestigeluxury.ae';
const load = createSourceLoader({
  'next/headers': { headers: async () => new Headers({ host }) },
  'next/navigation': { notFound() { throw new Error('Not found'); } },
  '@/components/listings/ListingArchive': () => null,
});
const seo = load('src/lib/seo.ts');
const views = load('src/lib/listing-views.ts');
const { properties } = load('src/lib/properties.ts');
const { pageTitles } = load('src/lib/page-seo.ts');
const { pages, posts, seoMetadata } = load('src/lib/content.ts');

test('pagination canonicals and titles follow actual clamped page numbers', () => {
  const metadata = value => seo.pageMetadata({ title: pageTitles['/status/for-sale/'], description: 'Dubai properties for sale.', path: '/status/for-sale/', pagination: [{ key: 'page', value, total: 30 }] });
  assert.equal(metadata('2').alternates.canonical, '/status/for-sale/?page=2');
  assert.match(metadata('2').title.absolute, /Page 2/);
  assert.equal(metadata('999').alternates.canonical, '/status/for-sale/?page=3');
  for (const value of ['0', '-2', 'bad', '1']) assert.equal(metadata(value).alternates.canonical, '/status/for-sale/');
  const projects = seo.pageMetadata({ title: 'Dubai Marina | Prestige Luxury', description: 'Area properties.', path: '/area/dubai-marina/',
    canonicalParams: { status: 'for-rent' }, pagination: [{ key: 'page', value: '2', total: 30 }, { key: 'projectPage', value: '2', total: 25 }] });
  assert.equal(projects.alternates.canonical, '/area/dubai-marina/?status=for-rent&page=2&projectPage=2');
  const longTitle = seo.pageMetadata({ title: 'A particularly long Dubai community title with several words | Prestige Luxury', description: 'Area properties.', path: '/area/example/', pagination: [{ key: 'page', value: '2', total: 30 }] });
  assert.match(longTitle.title.absolute, /Page 2 \| Prestige Luxury$/);
  assert.ok(longTitle.title.absolute.length <= 70);
});

test('all feed listings receive unique concise SEO titles and descriptions without mutating data', () => {
  const before = createHash('sha256').update(JSON.stringify(properties)).digest('hex');
  const titles = properties.map(property => `${views.listingTitle(property)} | Prestige Luxury`);
  const descriptions = properties.map(views.listingDescription);
  assert.equal(new Set(titles).size, properties.length);
  assert.equal(new Set(descriptions).size, properties.length);
  assert.ok(titles.every(title => title.length <= 70), titles.find(title => title.length > 70));
  assert.ok(descriptions.every(description => description.length <= 160));
  for (let index = 0; index < properties.length; index++) assert.ok(descriptions[index].includes(properties[index].id));
  assert.equal(createHash('sha256').update(JSON.stringify(properties)).digest('hex'), before);
});

test('area aliases consolidate URLs and retain listings for both CRM spellings', () => {
  const fixture = properties[0];
  const list = [{ ...fixture, community: 'Nad Al Sheba', location: ['Nad Al Sheba'] }, { ...fixture, community: 'Nadd Al Sheba', location: ['Nadd Al Sheba'] }];
  assert.equal(views.propertiesInArea('nad-al-sheba', list).length, 2);
  assert.equal(views.propertiesInArea('nadd-al-sheba', list).length, 2);
  assert.equal(views.allAreas(list).filter(area => /nadd?-al-sheba/.test(area.slug)).length, 1);
  assert.ok(views.allAreas(list).some(area => area.slug === 'nad-al-sheba'));
});

test('sitemap contains canonical indexable URLs, every listing and valid dates', () => {
  const entries = load('src/app/sitemap.ts').default();
  const urls = entries.map(entry => entry.url);
  assert.equal(new Set(urls).size, urls.length);
  for (const entry of entries) {
    const path = new URL(entry.url).pathname;
    assert.ok(!seo.nonIndexablePaths.has(path), path);
    assert.ok(!path.includes('/nadd-al-sheba/'));
    if (entry.lastModified) assert.match(entry.lastModified, /^\d{4}-\d{2}-\d{2}(?:$|T\d{2}:\d{2}:\d{2}\.\d{3}Z$)/);
  }
  for (const property of properties) assert.ok(urls.includes(`https://prestigeluxury.ae/property/${property.slug}/`));
  assert.equal(seo.sitemapDate('2024-05-15T05:22:07'), '2024-05-15');
  assert.equal(seo.sitemapDate('2024-05-15T09:22:07+04:00'), '2024-05-15T05:22:07.000Z');
  assert.equal(seo.sitemapDate('2024-02-30'), undefined);
  assert.equal(seo.sitemapDate('invalid'), undefined);
});

test('approved page titles stay unchanged and imported metadata is readable and concise', () => {
  for (const page of pages) {
    const metadata = seoMetadata(page);
    if (pageTitles[page.path]) assert.equal(metadata.title.absolute, pageTitles[page.path]);
    assert.ok(metadata.description.length <= 160, page.path);
    assert.ok(metadata.openGraph.images.length);
    assert.equal(metadata.twitter.card, 'summary_large_image');
  }
  assert.doesNotMatch(seoMetadata(pages.find(page => page.path === '/inquiry-form/')).description, /Houzez|widget|\[&hellip;/i);
  for (const post of posts) assert.ok(seoMetadata(post).title.absolute.length <= 70);
});

test('robots allow crawlers to see noindex and previews receive a noindex response header', async () => {
  const robots = load('src/app/robots.ts').default;
  host = 'prestigeluxury.ae';
  const production = await robots();
  assert.equal(production.sitemap, 'https://prestigeluxury.ae/sitemap.xml');
  assert.ok(!production.rules.disallow.includes('/search-results/'));
  host = 'prestige-luxury-murex.vercel.app';
  assert.equal((await robots()).rules.allow, '/');
  const config = load('next.config.ts').default;
  assert.ok((await config.headers()).some(rule => rule.headers.some(header => header.key === 'X-Robots-Tag' && header.value.includes('noindex'))));
  const redirect = (await config.redirects()).find(rule => rule.source === '/area/nadd-al-sheba/');
  assert.equal(redirect.destination, '/area/nad-al-sheba/');
  assert.equal(redirect.permanent, true);
});

test('business and breadcrumb structured data use published facts and safely serialize scripts', () => {
  const { BusinessStructuredData, BreadcrumbStructuredData } = load('src/components/StructuredData.tsx');
  const html = renderToStaticMarkup(createElement(BusinessStructuredData));
  const graph = JSON.parse(html.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1])['@graph'];
  assert.equal(graph[0]['@type'], 'RealEstateAgent');
  assert.deepEqual(graph[0].telephone, ['+971 52 370 2269', '+971 4 446 8300']);
  const breadcrumb = renderToStaticMarkup(createElement(BreadcrumbStructuredData, { items: [{ name: '</script><script>alert(1)</script>', path: '/contact-us/' }] }));
  assert.equal((breadcrumb.match(/<script/g) ?? []).length, 1);
  assert.match(breadcrumb, /\\u003c/);
  const data = JSON.parse(breadcrumb.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1]);
  assert.equal(data.itemListElement[1].item, 'https://prestigeluxury.ae/contact-us/');
});

test('default social image exists at the declared 1200 by 630 resolution', async () => {
  const path = resolve('public', seo.defaultSocialImage.slice(1));
  const image = await sharp(readFileSync(path)).metadata();
  assert.equal(image.width, 1200);
  assert.equal(image.height, 630);
});
