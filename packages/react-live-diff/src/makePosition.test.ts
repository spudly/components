import makePosition from './makePosition';

const value = 'one\ntwo\nthree';

test('creates a position from an index', () => {
  expect(makePosition(value, {index: 0})).toStrictEqual({line: 1, column: 1, index: 0});
  expect(makePosition(value, {index: 1})).toStrictEqual({line: 1, column: 2, index: 1});
  expect(makePosition(value, {index: 2})).toStrictEqual({line: 1, column: 3, index: 2});
  expect(makePosition(value, {index: 3})).toStrictEqual({line: 1, column: 4, index: 3});

  expect(makePosition(value, {index: 4})).toStrictEqual({line: 2, column: 1, index: 4});
  expect(makePosition(value, {index: 5})).toStrictEqual({line: 2, column: 2, index: 5});
  expect(makePosition(value, {index: 6})).toStrictEqual({line: 2, column: 3, index: 6});
  expect(makePosition(value, {index: 7})).toStrictEqual({line: 2, column: 4, index: 7});

  expect(makePosition(value, {index: 8})).toStrictEqual({line: 3, column: 1, index: 8});
  expect(makePosition(value, {index: 9})).toStrictEqual({line: 3, column: 2, index: 9});
  expect(makePosition(value, {index: 10})).toStrictEqual({line: 3, column: 3, index: 10});
  expect(makePosition(value, {index: 11})).toStrictEqual({line: 3, column: 4, index: 11});
  expect(makePosition(value, {index: 12})).toStrictEqual({line: 3, column: 5, index: 12});
  expect(makePosition(value, {index: 13})).toStrictEqual({line: 3, column: 6, index: 13});
});

test.only('creates a position from a line and column', () => {
  // expect(makePosition(value, {line: 1, column: 1})).toStrictEqual({line: 1, column: 1, index: 0});
  // expect(makePosition(value, {line: 1, column: 2})).toStrictEqual({line: 1, column: 2, index: 1});
  // expect(makePosition(value, {line: 1, column: 3})).toStrictEqual({line: 1, column: 3, index: 2});
  // expect(makePosition(value, {line: 1, column: 4})).toStrictEqual({line: 1, column: 4, index: 3});
  
  expect(makePosition(value, {line: 2, column: 1})).toStrictEqual({line: 2, column: 1, index: 4});
  // expect(makePosition(value, {line: 2, column: 2})).toStrictEqual({line: 2, column: 2, index: 5});
  // expect(makePosition(value, {line: 2, column: 3})).toStrictEqual({line: 2, column: 3, index: 6});
  // expect(makePosition(value, {line: 2, column: 4})).toStrictEqual({line: 2, column: 4, index: 7});
  // 
  // expect(makePosition(value, {line: 3, column: 1})).toStrictEqual({line: 3, column: 1, index: 8});
  // expect(makePosition(value, {line: 3, column: 2})).toStrictEqual({line: 3, column: 2, index: 9});
  // expect(makePosition(value, {line: 3, column: 3})).toStrictEqual({line: 3, column: 3, index: 10});
  // expect(makePosition(value, {line: 3, column: 4})).toStrictEqual({line: 3, column: 4, index: 11});
  // expect(makePosition(value, {line: 3, column: 5})).toStrictEqual({line: 3, column: 5, index: 12});
  // expect(makePosition(value, {line: 3, column: 6})).toStrictEqual({line: 3, column: 6, index: 13});
});