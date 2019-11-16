import {getIndex, getNumColumns, getPosition} from './utils';

describe('getIndex', () => {
  test('gets character indices', () => {
    const value = 'one\ntwo\nthree';

    expect(() => getIndex(value, 0, 0)).toThrow('out of bounds');
    expect(() => getIndex(value, 0, 1)).toThrow('out of bounds');
    expect(() => getIndex(value, 1, 0)).toThrow('out of bounds');
    expect(getIndex(value, 1, 1)).toBe(0);
    expect(value[getIndex(value, 1, 1)]).toBe('o');
    expect(getIndex(value, 1, 2)).toBe(1);
    expect(value[getIndex(value, 1, 2)]).toBe('n');
    expect(getIndex(value, 1, 3)).toBe(2);
    expect(value[getIndex(value, 1, 3)]).toBe('e');
    expect(getIndex(value, 1, 4)).toBe(3);
    expect(value[getIndex(value, 1, 4)]).toBe('\n');
    expect(() => getIndex(value, 1, 5)).toThrow('out of bounds');

    expect(getIndex(value, 2, 1)).toBe(4);
    expect(value[getIndex(value, 2, 1)]).toBe('t');
    expect(getIndex(value, 2, 2)).toBe(5);
    expect(value[getIndex(value, 2, 2)]).toBe('w');
    expect(getIndex(value, 2, 3)).toBe(6);
    expect(value[getIndex(value, 2, 3)]).toBe('o');
    expect(getIndex(value, 2, 4)).toBe(7);
    expect(value[getIndex(value, 2, 4)]).toBe('\n');
    expect(() => getIndex(value, 2, 5)).toThrow('out of bounds');

    expect(getIndex(value, 3, 1)).toBe(8);
    expect(value[getIndex(value, 3, 1)]).toBe('t');
    expect(getIndex(value, 3, 2)).toBe(9);
    expect(value[getIndex(value, 3, 2)]).toBe('h');
    expect(getIndex(value, 3, 3)).toBe(10);
    expect(value[getIndex(value, 3, 3)]).toBe('r');
    expect(getIndex(value, 3, 4)).toBe(11);
    expect(value[getIndex(value, 3, 4)]).toBe('e');
    expect(getIndex(value, 3, 5)).toBe(12);
    expect(value[getIndex(value, 3, 5)]).toBe('e');
    expect(getIndex(value, 3, 6)).toBe(13);
    expect(value[getIndex(value, 3, 6)]).toBe(undefined);
  });
});

describe('getNumColumns', () => {
  test('returns the number of columns for a given line', () => {
    const value = 'a b c\nd e f\ng h i';
    expect(() => getNumColumns(value, 0)).toThrow('invalid line number');
    expect(getNumColumns(value, 1)).toBe(6);
    expect(getNumColumns(value, 2)).toBe(6);
    expect(getNumColumns(value, 3)).toBe(6);
  });
});

describe('getPosition', () => {
  test('gets position by index', () => {
    const value = 'one\ntwo\nthree';

    expect(() => getPosition(value, -1)).toThrow('out of bounds');
    expect(getPosition(value, 0)).toStrictEqual([1, 1]);
    expect(getPosition(value, 1)).toStrictEqual([1, 2]);
    expect(getPosition(value, 2)).toStrictEqual([1, 3]);
    expect(getPosition(value, 3)).toStrictEqual([1, 4]);
    expect(getPosition(value, 4)).toStrictEqual([2, 1]);
    expect(getPosition(value, 5)).toStrictEqual([2, 2]);
    expect(getPosition(value, 6)).toStrictEqual([2, 3]);
    expect(getPosition(value, 7)).toStrictEqual([2, 4]);
    expect(getPosition(value, 8)).toStrictEqual([3, 1]);
    expect(getPosition(value, 9)).toStrictEqual([3, 2]);
    expect(getPosition(value, 10)).toStrictEqual([3, 3]);
    expect(getPosition(value, 11)).toStrictEqual([3, 4]);
    expect(getPosition(value, 12)).toStrictEqual([3, 5]);
    expect(getPosition(value, 13)).toStrictEqual([3, 6]);
    expect(() => getPosition(value, 14)).toThrow('out of bounds');
  });
});
