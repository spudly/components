import getNumColumns from './getNumColumns';

test('returns the number of columns for a given line', () => {
  const value = 'a b c\nd e f\ng h i';
  expect(getNumColumns(value, 1)).toBe(6);
  expect(getNumColumns(value, 2)).toBe(6);
  expect(getNumColumns(value, 3)).toBe(6);
});
