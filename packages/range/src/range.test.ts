import range from './range';

test('returns array from `from` up to, but not including `to`', () => {
  expect(range(-3, 3)).toEqual([-3, -2, -1, 0, 1, 2]);
});

test('works backwards if to < from', () => {
  expect(range(3, -3)).toEqual([3, 2, 1, 0, -1, -2]);
});

test('handles float precision correctly', () => {
  // because 0.1 + 0.2 === 0.30000000000000004
  expect(range(0, 1, 0.1)).toEqual([
    0,
    0.1,
    0.2,
    0.3,
    0.4,
    0.5,
    0.6,
    0.7,
    0.8,
    0.9,
  ]);
});
