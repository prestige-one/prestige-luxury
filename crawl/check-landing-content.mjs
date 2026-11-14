// Capture/compare page text and media before a presentation-only redesign.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { load } from 'cheerio';

const routes = ['/the-residence-by-prestige-one/', '/prestige-embankment/', '/projects-for-sale/', '/vista-by-prestige-one/'];
const snapshotPath = process.argv[2];
if (!snapshotPath) throw new Error('Provide the baseline JSON path; add --capture to save it.');
const snapshot = {};
for (const route of routes) {
  const response = await fetch(`http://127.0.0.1:3000${route}`);
  assert.equal(response.status, 200, route);
  const $ = load(await response.text());
  $('.landing script, .landing style').remove();
  snapshot[route] = {
    text: $('.landing').text().replace(/\s+/g, ' ').trim(),
    images: $('.landing img').toArray().map((el) => $(el).attr('src')).sort(),
    headings: $('.landing h1, .landing h2, .landing h3').toArray().map((el) => $(el).text().replace(/\s+/g, ' ').trim()),
    links: $('.landing a[href]').toArray().map((el) => $(el).attr('href')).sort(),
    forms: $('.landing form').length,
  };
}
if (process.argv.includes('--capture')) fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));
else assert.deepEqual(snapshot, JSON.parse(fs.readFileSync(snapshotPath, 'utf8')), 'Landing content, images, links or forms changed');
console.log(`${process.argv.includes('--capture') ? 'Captured' : 'Verified unchanged content for'} ${routes.length} landing pages.`);
