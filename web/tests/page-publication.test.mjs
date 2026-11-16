import { test } from 'node:test';
import assert from 'node:assert/strict';
import { footerColumns, isPagePublished, mainNav, unpublishedPagePaths } from '../src/lib/site.ts';

test('draft routes remain unpublished with query strings, anchors, and canonical URL variants', () => {
  for (const path of unpublishedPagePaths) {
    for (const url of [path, path.slice(0, -1), `${path}?source=menu#enquire`, `https://prestigeluxury.ae${path}`, `https://www.prestigeluxury.ae${path}`]) assert.equal(isPagePublished(url), false, url);
    assert.equal(isPagePublished(`https://another-site.example${path}`), true);
  }
  assert.equal(isPagePublished('/property-management/'), false);
  assert.equal(isPagePublished('/prestige-embankment/'), false);
  assert.equal(isPagePublished('/projects-for-sale/'), false);
  assert.equal(isPagePublished('/projects-for-sale-arabic/'), true);
  assert.equal(isPagePublished('/developers/prestige-one-developments/'), true);
});

test('desktop menus, mobile menus, and footer contain no unpublished links', () => {
  const links = [...mainNav, ...mainNav.flatMap((item) => item.children || []), ...mainNav.flatMap((item) => item.mega?.groups.flatMap((group) => group.links) || []), ...footerColumns.flatMap((column) => column.links)];
  assert.ok(links.every((link) => isPagePublished(link.href)));
  assert.ok(footerColumns.flatMap((column) => column.links).some((link) => link.label === 'Branded Residences' && link.href === '/branded-residences/'));
});
