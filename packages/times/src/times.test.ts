import times from './times';

test('repeats something n times', () => {
  expect(times(3, 'bloody mary')).toStrictEqual([
    'bloody mary',
    'bloody mary',
    'bloody mary',
  ]);
});
