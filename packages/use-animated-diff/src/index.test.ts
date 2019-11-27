import * as stuff from './index';

test('exports', () => {
  expect(
    (Object.keys(stuff) as Array<keyof typeof stuff>).reduce(
      (map, key) => ({...map, [key]: typeof stuff[key]}),
      {},
    ),
  ).toMatchInlineSnapshot(`
    Object {
      "getIndex": "function",
      "getNumColumns": "function",
      "getNumLines": "function",
      "getPosition": "function",
      "useAnimatedDiff": "function",
    }
  `);
});
