import test from 'node:test';
import assert from 'node:assert/strict';
import { globalModifiers, positiveModifiers, negativeModifiers, personalModifiers, boardRegions, boardSize,
  getBalance, getBlockReason, normalizeSelection, parseBuildHash } from '../lib/kord-breach.mjs';

test('supplied board has unique bounded regions and valid conflict references', () => {
  const all = [...globalModifiers, ...personalModifiers];
  assert.equal(new Set(all.map(item => item.id)).size, all.length);
  for (const item of all) {
    const region = boardRegions[item.id];
    assert.ok(region.x >= 0 && region.y >= 0 && region.w > 0 && region.h > 0);
    assert.ok(region.x + region.w <= boardSize.width && region.y + region.h <= boardSize.height);
  }
  for (const item of personalModifiers) {
    assert.ok(Number.isSafeInteger(item.value));
    for (const conflict of item.conflicts) assert.ok(personalModifiers.some(other => other.id === conflict));
  }
  assert.ok(positiveModifiers.every(item => item.value < 0));
  assert.ok(negativeModifiers.every(item => item.value > 0));
});
test('an empty build starts with zero points', () => assert.equal(getBalance(new Set()), 0));
test('debuff funding exactly pays for an equal-cost buff', () => {
  assert.equal(getBalance(new Set(['no-flea-market'])), 6);
  assert.equal(getBalance(new Set(['no-flea-market', 'safecracker'])), 0);
});
test('unfunded buffs report the points needed', () => {
  const buff = positiveModifiers.find(item => item.id === 'safecracker');
  assert.equal(getBlockReason(buff, new Set()), 'Need 6 more pt');
  assert.equal(getBlockReason(buff, new Set(['no-flea-market'])), '');
});
test('opposite modifiers block in both directions', () => {
  const positive = positiveModifiers.find(item => item.id === 'thrombophilia');
  const negative = negativeModifiers.find(item => item.id === 'hemophilia');
  assert.equal(getBlockReason(positive, new Set(['hemophilia'])), 'Blocked by HEMOPHILIA');
  assert.equal(getBlockReason(negative, new Set(['thrombophilia'])), 'Blocked by THROMBOPHILIA');
});
test('normalization ignores duplicates, unknown IDs and impossible selections', () => {
  assert.deepEqual([...normalizeSelection(['safecracker', 'no-flea-market', 'no-flea-market', '__proto__'])], ['no-flea-market', 'safecracker']);
  assert.deepEqual([...normalizeSelection(['safecracker'])], []);
  assert.deepEqual([...normalizeSelection(['hemophilia', 'thrombophilia'])], ['hemophilia']);
});
test('invalid and oversized hashes cannot introduce arbitrary build state', () => {
  for (const value of [null, [], {}, 4, 'x'.repeat(4097)]) assert.equal(parseBuildHash(value).size, 0);
  assert.deepEqual([...parseBuildHash('# no-flea-market, safecracker,unknown')], ['no-flea-market', 'safecracker']);
  assert.equal(normalizeSelection('no-flea-market').size, 0);
});
test('one thousand deterministic input combinations preserve solvency and compatibility', () => {
  let seed = 42;
  for (let iteration = 0; iteration < 1000; iteration++) {
    const ids = personalModifiers.filter(() => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % 3 === 0; }).map(item => item.id);
    const selected = normalizeSelection(ids);
    assert.ok(getBalance(selected) >= 0);
    for (const item of personalModifiers) if (selected.has(item.id)) {
      assert.ok(item.conflicts.every(id => !selected.has(id)));
    }
    assert.deepEqual(normalizeSelection([...selected]), selected);
  }
});
