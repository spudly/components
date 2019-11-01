import stringSplice from './stringSplice';

const greeting = 'Hello World!';

test('removes characters', () => {
  expect(stringSplice(4, 1, '', greeting)).toBe('Hell World!');
});

test('adds characters', () => {
  expect(stringSplice(1, 0, 'ave fun at J', greeting)).toBe(
    'Have fun at Jello World!',
  );
});

test('replaces characters', () => {
  expect(stringSplice(0, 2, 'Marshma', greeting)).toBe('Marshmallo World!'); // <= yes I know that's spelled wrong
});

test('if start > string length, start will be set to the string length', () => {
  expect(stringSplice(25, 5, ' We meet again!', greeting)).toBe(
    'Hello World! We meet again!',
  );
});

test('If start < 0, start will be set to string length - start', () => {
  expect(stringSplice(-1, 1, '?', greeting)).toBe('Hello World?');
});

test('if start < 0 && abs(start) > length, start will be set to 0', () => {
  expect(stringSplice(-25, 1, 'C', greeting)).toBe('Cello World!');
});

test('if deleteCount is <= 0, does not remove anything', () => {
  expect(stringSplice(3, -15, 'p save Tange', greeting)).toBe(
    'Help save Tangelo World!',
  );
});

test('is curried', () => {
  expect(stringSplice(0)(2)('Marshma')(greeting)).toBe('Marshmallo World!'); // <= yes I know that's spelled wrong
});
