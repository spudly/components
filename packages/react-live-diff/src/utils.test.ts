import {
  getCharIndex,
  getNumColumns,
  getPositionForIndex,
  makePosition,
} from './utils';

describe('getCharIndex', () => {
  test('gets character indices', () => {
    const value = 'one\ntwo\nthree';

    expect(() => getCharIndex(value, 0, 0)).toThrow('out of bounds');
    expect(() => getCharIndex(value, 0, 1)).toThrow('out of bounds');
    expect(() => getCharIndex(value, 1, 0)).toThrow('out of bounds');
    expect(getCharIndex(value, 1, 1)).toBe(0);
    expect(value[getCharIndex(value, 1, 1)]).toBe('o');
    expect(getCharIndex(value, 1, 2)).toBe(1);
    expect(value[getCharIndex(value, 1, 2)]).toBe('n');
    expect(getCharIndex(value, 1, 3)).toBe(2);
    expect(value[getCharIndex(value, 1, 3)]).toBe('e');
    expect(getCharIndex(value, 1, 4)).toBe(3);
    expect(value[getCharIndex(value, 1, 4)]).toBe('\n');
    expect(() => getCharIndex(value, 1, 5)).toThrow('out of bounds');

    expect(getCharIndex(value, 2, 1)).toBe(4);
    expect(value[getCharIndex(value, 2, 1)]).toBe('t');
    expect(getCharIndex(value, 2, 2)).toBe(5);
    expect(value[getCharIndex(value, 2, 2)]).toBe('w');
    expect(getCharIndex(value, 2, 3)).toBe(6);
    expect(value[getCharIndex(value, 2, 3)]).toBe('o');
    expect(getCharIndex(value, 2, 4)).toBe(7);
    expect(value[getCharIndex(value, 2, 4)]).toBe('\n');
    expect(() => getCharIndex(value, 2, 5)).toThrow('out of bounds');

    expect(getCharIndex(value, 3, 1)).toBe(8);
    expect(value[getCharIndex(value, 3, 1)]).toBe('t');
    expect(getCharIndex(value, 3, 2)).toBe(9);
    expect(value[getCharIndex(value, 3, 2)]).toBe('h');
    expect(getCharIndex(value, 3, 3)).toBe(10);
    expect(value[getCharIndex(value, 3, 3)]).toBe('r');
    expect(getCharIndex(value, 3, 4)).toBe(11);
    expect(value[getCharIndex(value, 3, 4)]).toBe('e');
    expect(getCharIndex(value, 3, 5)).toBe(12);
    expect(value[getCharIndex(value, 3, 5)]).toBe('e');
    expect(getCharIndex(value, 3, 6)).toBe(13);
    expect(value[getCharIndex(value, 3, 6)]).toBe(undefined);
  });
});

describe('getNumColumns', () => {
  test('returns the number of columns for a given line', () => {
    const value = 'a b c\nd e f\ng h i';
    expect(getNumColumns(value, 1)).toBe(6);
    expect(getNumColumns(value, 2)).toBe(6);
    expect(getNumColumns(value, 3)).toBe(6);
  });
});

describe('getPositionForIndex', () => {
  test('gets position by index', () => {
    const value = 'one\ntwo\nthree';

    expect(() => getPositionForIndex(value, -1)).toThrow('out of bounds');
    expect(getPositionForIndex(value, 0)).toStrictEqual({
      line: 1,
      column: 1,
      index: 0,
    });
    expect(getPositionForIndex(value, 1)).toStrictEqual({
      line: 1,
      column: 2,
      index: 1,
    });
    expect(getPositionForIndex(value, 2)).toStrictEqual({
      line: 1,
      column: 3,
      index: 2,
    });
    expect(getPositionForIndex(value, 3)).toStrictEqual({
      line: 1,
      column: 4,
      index: 3,
    });
    expect(getPositionForIndex(value, 4)).toStrictEqual({
      line: 2,
      column: 1,
      index: 4,
    });
    expect(getPositionForIndex(value, 5)).toStrictEqual({
      line: 2,
      column: 2,
      index: 5,
    });
    expect(getPositionForIndex(value, 6)).toStrictEqual({
      line: 2,
      column: 3,
      index: 6,
    });
    expect(getPositionForIndex(value, 7)).toStrictEqual({
      line: 2,
      column: 4,
      index: 7,
    });
    expect(getPositionForIndex(value, 8)).toStrictEqual({
      line: 3,
      column: 1,
      index: 8,
    });
    expect(getPositionForIndex(value, 9)).toStrictEqual({
      line: 3,
      column: 2,
      index: 9,
    });
    expect(getPositionForIndex(value, 10)).toStrictEqual({
      line: 3,
      column: 3,
      index: 10,
    });
    expect(getPositionForIndex(value, 11)).toStrictEqual({
      line: 3,
      column: 4,
      index: 11,
    });
    expect(getPositionForIndex(value, 12)).toStrictEqual({
      line: 3,
      column: 5,
      index: 12,
    });
    expect(getPositionForIndex(value, 13)).toStrictEqual({
      line: 3,
      column: 6,
      index: 13,
    });
    expect(() => getPositionForIndex(value, 14)).toThrow('out of bounds');
  });
});

describe('makePosition', () => {
  const value = 'one\ntwo\nthree';

  test('creates a position from an index', () => {
    expect(makePosition(value, {index: 0})).toStrictEqual({
      line: 1,
      column: 1,
      index: 0,
    });
    expect(makePosition(value, {index: 1})).toStrictEqual({
      line: 1,
      column: 2,
      index: 1,
    });
    expect(makePosition(value, {index: 2})).toStrictEqual({
      line: 1,
      column: 3,
      index: 2,
    });
    expect(makePosition(value, {index: 3})).toStrictEqual({
      line: 1,
      column: 4,
      index: 3,
    });

    expect(makePosition(value, {index: 4})).toStrictEqual({
      line: 2,
      column: 1,
      index: 4,
    });
    expect(makePosition(value, {index: 5})).toStrictEqual({
      line: 2,
      column: 2,
      index: 5,
    });
    expect(makePosition(value, {index: 6})).toStrictEqual({
      line: 2,
      column: 3,
      index: 6,
    });
    expect(makePosition(value, {index: 7})).toStrictEqual({
      line: 2,
      column: 4,
      index: 7,
    });

    expect(makePosition(value, {index: 8})).toStrictEqual({
      line: 3,
      column: 1,
      index: 8,
    });
    expect(makePosition(value, {index: 9})).toStrictEqual({
      line: 3,
      column: 2,
      index: 9,
    });
    expect(makePosition(value, {index: 10})).toStrictEqual({
      line: 3,
      column: 3,
      index: 10,
    });
    expect(makePosition(value, {index: 11})).toStrictEqual({
      line: 3,
      column: 4,
      index: 11,
    });
    expect(makePosition(value, {index: 12})).toStrictEqual({
      line: 3,
      column: 5,
      index: 12,
    });
    expect(makePosition(value, {index: 13})).toStrictEqual({
      line: 3,
      column: 6,
      index: 13,
    });
  });

  test('creates a position from a line and column', () => {
    expect(makePosition(value, {line: 1, column: 1})).toStrictEqual({
      line: 1,
      column: 1,
      index: 0,
    });
    expect(makePosition(value, {line: 1, column: 2})).toStrictEqual({
      line: 1,
      column: 2,
      index: 1,
    });
    expect(makePosition(value, {line: 1, column: 3})).toStrictEqual({
      line: 1,
      column: 3,
      index: 2,
    });
    expect(makePosition(value, {line: 1, column: 4})).toStrictEqual({
      line: 1,
      column: 4,
      index: 3,
    });

    expect(makePosition(value, {line: 2, column: 1})).toStrictEqual({
      line: 2,
      column: 1,
      index: 4,
    });
    expect(makePosition(value, {line: 2, column: 2})).toStrictEqual({
      line: 2,
      column: 2,
      index: 5,
    });
    expect(makePosition(value, {line: 2, column: 3})).toStrictEqual({
      line: 2,
      column: 3,
      index: 6,
    });
    expect(makePosition(value, {line: 2, column: 4})).toStrictEqual({
      line: 2,
      column: 4,
      index: 7,
    });

    expect(makePosition(value, {line: 3, column: 1})).toStrictEqual({
      line: 3,
      column: 1,
      index: 8,
    });
    expect(makePosition(value, {line: 3, column: 2})).toStrictEqual({
      line: 3,
      column: 2,
      index: 9,
    });
    expect(makePosition(value, {line: 3, column: 3})).toStrictEqual({
      line: 3,
      column: 3,
      index: 10,
    });
    expect(makePosition(value, {line: 3, column: 4})).toStrictEqual({
      line: 3,
      column: 4,
      index: 11,
    });
    expect(makePosition(value, {line: 3, column: 5})).toStrictEqual({
      line: 3,
      column: 5,
      index: 12,
    });
    expect(makePosition(value, {line: 3, column: 6})).toStrictEqual({
      line: 3,
      column: 6,
      index: 13,
    });
  });
});
