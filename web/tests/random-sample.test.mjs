import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomSample } from '../src/lib/random-sample.ts';

test('sampling handles empty/small feeds and selects without replacement', () => {
  assert.deepEqual(randomSample([], 3), []);
  assert.deepEqual(randomSample([1, 2], 3), [1, 2]);
  assert.deepEqual(randomSample([1, 2], 0), []);
  const feed = Array.from({ length: 193 }, (_, index) => index);
  for (let i = 0; i < 20; i++) {
    const selection = randomSample(feed.values(), 3);
    assert.equal(selection.length, 3);
    assert.equal(new Set(selection).size, 3);
    assert.ok(selection.every((value) => feed.includes(value)));
  }
  assert.deepEqual(randomSample([1, 2, 3, 4, 5], 3, () => 0), [5, 2, 3]);
  assert.deepEqual(randomSample([1, 2, 3, 4, 5], 3, () => .999), [1, 2, 3]);
});
