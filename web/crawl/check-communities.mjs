import assert from 'node:assert/strict';
import fs from 'node:fs';

const base = process.argv[2] || 'http://127.0.0.1:3000';
const communities = JSON.parse(fs.readFileSync(new URL('../content/communities.json', import.meta.url)));
assert.equal(new Set(communities.map((area) => area.slug)).size, communities.length, 'Unique community routes');
for (const community of communities) {
  assert.ok(community.description.trim(), `${community.name}: description`);
  assert.ok(fs.existsSync(new URL(`../public${community.image}`, import.meta.url)), `${community.name}: local image exists`);
}
for (let start = 0; start < communities.length; start += 4) {
  await Promise.all(communities.slice(start, start + 4).map(async (community) => {
    const response = await fetch(new URL(`/area/${community.slug}/`, base));
    assert.equal(response.status, 200, `${community.name}: valid destination`);
  }));
}
const html = await (await fetch(new URL('/areas/', base))).text();
assert.ok(html.includes('Top Dubai Communities'));
assert.ok(!html.includes('Our Real Estate Services'), 'Old About/service sections removed');
assert.equal((html.match(/pl-community-card/g) || []).length, communities.length);
console.log(`Verified ${communities.length} community cards, local images and destination pages.`);
