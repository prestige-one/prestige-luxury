import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizePhone } from '../src/lib/phone.ts';
import { footerColumns } from '../src/lib/site.ts';

test('country selections normalize national numbers and trunk prefixes', () => {
  assert.equal(normalizePhone('050 123 4567', 'AE'), '+971501234567');
  assert.equal(normalizePhone('(202) 555-0123', 'US'), '+12025550123');
  assert.equal(normalizePhone('077 123 4567', 'LK'), '+94771234567');
});

test('international pastes keep their own calling code without duplication', () => {
  assert.equal(normalizePhone('+44 7700 900123', 'AE'), '+447700900123');
  assert.equal(normalizePhone('00971 50 123 4567', 'US'), '+971501234567');
});

test('optional blank numbers stay blank and malformed numbers fail', () => {
  assert.equal(normalizePhone(''), '');
  for (const number of ['123', 'not a number', '+971', 'Call +971501234567', '+971501234567999999']) {
    assert.equal(normalizePhone(number), undefined, number);
  }
});

test('Rent footer keeps four relevant links without sales navigation', () => {
  const links = footerColumns.find((column) => column.title === 'Rent').links;
  assert.equal(links.length, 4);
  assert.ok(links.some((link) => link.label === 'Rental Valuation'));
  assert.ok(links.every((link) => !link.label.includes('for Sale') && link.href !== '/status/for-sale/'));
});
