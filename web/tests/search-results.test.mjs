import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInThisContext } from 'node:vm';
import ts from 'typescript';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Exercise the real server page and its data helpers without requiring a running Next server.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const cache = new Map();
function load(file) {
  if (!existsSync(file)) file = ['.ts', '.tsx', '.json'].map(ext => file + ext).find(existsSync);
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  if (file.endsWith('.json')) return (module.exports = JSON.parse(readFileSync(file, 'utf8')));
  const code = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const localRequire = name => {
    if (name === '@/components/listings/ListingArchive') return 'ListingArchive';
    if (name === 'next/navigation') return { notFound() { throw new Error('Not found'); }, useRouter: () => ({ push() {} }) };
    if (name.startsWith('@/')) return load(resolve(root, 'src', name.slice(2)));
    return name.startsWith('.') ? load(resolve(dirname(file), name)) : require(name);
  };
  runInThisContext(`(function(require,module,exports){${code}\n})`, { filename: file })(localRequire, module, module.exports);
  return module.exports;
}
const views = load(resolve(root, 'src/lib/listing-views.ts'));
const { properties } = load(resolve(root, 'src/lib/properties.ts'));
const { mainNav, footerColumns } = load(resolve(root, 'src/lib/site.ts'));
const { default: PropertyTypePage } = load(resolve(root, 'src/app/(site)/property-type/[type]/page.tsx'));
const { default: ListingSearchBar } = load(resolve(root, 'src/components/listings/ListingSearchBar.tsx'));

test('Buy and Rent property links keep their purpose, including footer and area promotions', () => {
  for (const [label, purpose] of [['Buy', 'for-sale'], ['Rent', 'for-rent']]) {
    const nav = mainNav.find(item => item.label === label);
    for (const link of nav.mega.groups[0].links.filter(link => link.href.includes('?type='))) {
      const url = new URL(link.href, 'https://example.test');
      assert.equal(url.pathname, `/status/${purpose}/`);
      const results = views.filterListings(views.parseFilters({ ...Object.fromEntries(url.searchParams), status: purpose }));
      assert.ok(results.every(property => property.purpose === (purpose === 'for-sale' ? 'sale' : 'rent')), link.label);
    }
    assert.equal(new URL(nav.mega.promo.href, 'https://example.test').searchParams.get('status'), purpose);
    for (const link of footerColumns.find(column => column.title === label).links.filter(link => link.href.includes('?type='))) {
      assert.ok(link.href.startsWith(`/status/${purpose}/`), link.label);
    }
  }
});

test('property-type pages apply sale/rent, bedroom, budget and location filters before paging', async () => {
  for (const status of ['for-sale', 'for-rent']) {
    const query = { status, beds: '2', location: 'Dubai Marina', maxPrice: status === 'for-rent' ? '200000' : '5000000' };
    const page = await PropertyTypePage({ params: Promise.resolve({ type: 'apartments' }), searchParams: Promise.resolve(query) });
    const expected = views.filterListings(views.parseFilters(query), views.propertiesOfType('apartments'));
    assert.ok(expected.length > 0);
    assert.deepEqual(page.props.listings.map(p => p.id), expected.map(p => p.id));
    assert.equal(page.props.search.status, status);
    assert.deepEqual(page.props.searchParams, query);
  }
});

test('explicit sales and rental searches stay separate across property types', () => {
  for (const status of ['for-sale', 'for-rent']) for (const type of ['Apartment', 'Studio', 'Villa', 'Office', 'Other Commercial']) {
    const results = views.filterListings({ status, type });
    assert.ok(results.every(p => p.purpose === (status === 'for-sale' ? 'sale' : 'rent')), `${status}: ${type}`);
  }
  assert.equal(views.filterListings({ status: 'for-rent' }).length, properties.filter(p => p.purpose === 'rent').length);
  assert.equal(views.filterListings({ status: 'for-sale' }).length, properties.filter(p => p.purpose === 'sale').length);
  assert.equal(views.filterListings({}).length, properties.length);
});

test('exact building searches exclude view advertisements for both sale and rent', () => {
  for (const [status, purpose] of [['for-sale', 'sale'], ['for-rent', 'rent']]) {
    const actual = views.filterListings({ status, q: ' Burj   Khalifa ' });
    const expected = properties.filter(p => p.purpose === purpose && p.location.some(location => location.toLowerCase() === 'burj khalifa'));
    assert.deepEqual(actual.map(p => p.id), expected.map(p => p.id));
    assert.ok(actual.length > 0);
  }
});

test('a rent-only building returns zero sales even when sale titles mention its view', () => {
  const base = properties[0];
  const rental = { ...base, id: 'test-rent', purpose: 'rent', type: 'Studio', price: 300000, title: 'Apartment to rent', location: ['Rent Only Tower'], community: 'Test Community', city: 'Dubai' };
  const sale = { ...base, id: 'test-sale', purpose: 'sale', type: 'Apartment', price: 1000000, title: 'Rent Only Tower View', location: ['Different Tower'], community: 'Test Community', city: 'Dubai' };
  const inventory = [rental, sale];
  assert.deepEqual(views.filterListings({ status: 'for-sale', q: 'Rent Only Tower' }, inventory), []);
  assert.deepEqual(views.filterListings({ status: 'for-sale', q: 'Rent Only Tower', type: 'Apartment', maxPrice: '2000000' }, inventory), []);
  assert.deepEqual(views.filterListings({ status: 'for-rent', q: 'Rent Only Tower' }, inventory).map(p => p.id), ['test-rent']);
  assert.deepEqual(views.filterListings({ status: 'for-sale', q: 'Rent Only Tower View' }, inventory), []);
});

test('free-text search never matches listing titles, descriptions, references or property types', () => {
  const inventory = [{ ...properties[0], title: 'Title Only Marker', description: 'Description Only Marker', reference: 'REF-ONLY-MARKER', type: 'Apartment', location: ['Test Building', 'Test District'], community: 'Test District', city: 'Test City' }];
  for (const q of ['Title Only', 'Description Only', 'REF-ONLY', 'Apartment', 'unknown location']) {
    assert.deepEqual(views.filterListings({ q }, inventory), [], q);
  }
  for (const q of ['Test Building', 'TEST   DISTRICT', 'test city', 'Test Buil']) {
    assert.equal(views.filterListings({ q }, inventory).length, 1, q);
  }
});

test('scoped search forms submit a fixed purpose even with advanced filters closed', () => {
  for (const status of ['for-sale', 'for-rent', 'off-plan']) {
    const html = renderToStaticMarkup(createElement(ListingSearchBar, { cities: [], areas: [], locations: [], types: [], initial: { status } }));
    assert.match(html, new RegExp(`<input type="hidden" name="status" value="${status}"`));
    assert.match(html, /<select disabled=""/);
    assert.ok(!html.includes('<select name="status"'), status);
  }
  const unscoped = renderToStaticMarkup(createElement(ListingSearchBar, { cities: [], areas: [], locations: [], types: [] }));
  assert.ok(unscoped.includes('<select name="status"'));
});
