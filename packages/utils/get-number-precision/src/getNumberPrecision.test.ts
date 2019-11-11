import getNumberPrecision from './getNumberPrecision';

test('gets the precision of a floating-point number', () => {
  expect(getNumberPrecision(1)).toBe(0);
  expect(getNumberPrecision(1.01)).toBe(2);
  expect(getNumberPrecision(1.2)).toBe(1);
  expect(getNumberPrecision(1.2)).toBe(1);
  expect(getNumberPrecision(1.23)).toBe(2);
  expect(getNumberPrecision(1.234)).toBe(3);
  expect(getNumberPrecision(1.2345)).toBe(4);
  expect(getNumberPrecision(1.23456)).toBe(5);
});

test('NaN => 0', () => {
  expect(getNumberPrecision(NaN)).toBe(0);
});

test('Infinity => 0', () => {
  expect(getNumberPrecision(Infinity)).toBe(0);
});

test('Negative Infinity => 0', () => {
  expect(getNumberPrecision(-Infinity)).toBe(0);
});
