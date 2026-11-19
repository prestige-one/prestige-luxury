import { test } from 'node:test';
import assert from 'node:assert/strict';
import { activeNavHref } from '../src/lib/nav-active.ts';
import { mainNav } from '../src/lib/site.ts';

test('one current menu section despite cross-links in several mega menus', () => {
  const cases = [
    ['/', null],
    ['/developers/', '/developers/'],
    ['/developers/emaar-properties/', '/developers/'],
    ['/status/for-sale/', '/status/for-sale/'],
    ['/status/for-rent/', '/status/for-rent/'],
    ['/status/off-plan/', '/status/off-plan/'],
    ['/exclusive-collection/', null],
    ['/services/property-management/', '/services/'],
    ['/services/market-appraisal/', '/services/'],
    ['/area/downtown-dubai/', '/areas/'],
    ['/property/apartment-3-bed-for-rent-example/', '/status/for-rent/'],
    ['/property/apartment-for-sale-example/', '/status/for-sale/'],
    ['/frequently-asked-questions/', '/contact-us/'],
    ['/about/', '/contact-us/'],
    ['/blog/article/', '/contact-us/'],
    ['/buyers-guide/', '/status/for-sale/'],
    ['/tenants-guide/', '/status/for-rent/'],
  ];
  for (const [route, expected] of cases) {
    const active = activeNavHref(mainNav, route);
    assert.equal(active, expected, route);
    assert.ok(mainNav.filter((item) => item.href === active).length <= 1, route);
  }
});
