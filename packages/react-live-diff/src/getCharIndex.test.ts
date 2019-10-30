import getCharIndex from './getCharIndex';

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
