import getPos from './getPositionForIndex';

test('gets position by index', () => {
  const value = 'one\ntwo\nthree';

  expect(() => getPos(value, -1)).toThrow('out of bounds');
  expect(getPos(value, 0)).toStrictEqual({line: 1, column: 1, index: 0});
  expect(getPos(value, 1)).toStrictEqual({line: 1, column: 2, index: 1});
  expect(getPos(value, 2)).toStrictEqual({line: 1, column: 3, index: 2});
  expect(getPos(value, 3)).toStrictEqual({line: 1, column: 4, index: 3});
  expect(getPos(value, 4)).toStrictEqual({line: 2, column: 1, index: 4});
  expect(getPos(value, 5)).toStrictEqual({line: 2, column: 2, index: 5});
  expect(getPos(value, 6)).toStrictEqual({line: 2, column: 3, index: 6});
  expect(getPos(value, 7)).toStrictEqual({line: 2, column: 4, index: 7});
  expect(getPos(value, 8)).toStrictEqual({line: 3, column: 1, index: 8});
  expect(getPos(value, 9)).toStrictEqual({line: 3, column: 2, index: 9});
  expect(getPos(value, 10)).toStrictEqual({line: 3, column: 3, index: 10});
  expect(getPos(value, 11)).toStrictEqual({line: 3, column: 4, index: 11});
  expect(getPos(value, 12)).toStrictEqual({line: 3, column: 5, index: 12});
  expect(getPos(value, 13)).toStrictEqual({line: 3, column: 6, index: 13});
  expect(() => getPos(value, 14)).toThrow('out of bounds');
});
