import { test } from 'node:test';
import assert from 'node:assert/strict';
import { locationSuggestions } from '../src/lib/location-suggestions.ts';
import { propertyExcerpt } from '../src/lib/listing-format.ts';

test('location matches prioritize prefixes, support partial names and limit results', () => {
  const options = ['Dubai', 'Dubai Marina', 'Marina Gate 1', 'Marina Gate 2', 'West Marina'];
  assert.deepEqual(locationSuggestions(options, ' MARINA ', 3), ['Marina Gate 1', 'Marina Gate 2', 'Dubai Marina']);
  assert.deepEqual(locationSuggestions(options, 'Gate 2'), ['Marina Gate 2']);
  assert.deepEqual(locationSuggestions(options, 'reference-123'), []);
  assert.deepEqual(locationSuggestions(options, '', 2), ['Dubai', 'Dubai Marina']);
});

test('property excerpts remove feed markup and truncate on a word boundary', () => {
  assert.equal(propertyExcerpt('**Bright** apartment\n\n<p>Marina views.</p>'), 'Bright apartment Marina views.');
  const excerpt = propertyExcerpt('Bright spacious apartment with waterfront views and private parking in the marina.', 48);
  assert.equal(excerpt, 'Bright spacious apartment with waterfront views…');
  assert.equal(propertyExcerpt(''), '');
});
