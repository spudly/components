import paginate, {PageDescriptor} from './paginate';

test('returns an array of link descriptors', () => {
  expect(paginate(5, 10, 3)).toMatchInlineSnapshot(`
    Array [
      Object {
        "isCurrentPage": false,
        "page": 0,
        "type": "FIRST",
      },
      Object {
        "isCurrentPage": false,
        "page": 4,
        "type": "PREV",
      },
      Object {
        "isCurrentPage": false,
        "page": 4,
        "type": "NUMBER",
      },
      Object {
        "isCurrentPage": true,
        "page": 5,
        "type": "NUMBER",
      },
      Object {
        "isCurrentPage": false,
        "page": 6,
        "type": "NUMBER",
      },
      Object {
        "isCurrentPage": false,
        "page": 6,
        "type": "NEXT",
      },
      Object {
        "isCurrentPage": false,
        "page": 9,
        "type": "LAST",
      },
    ]
  `);
});

test('limits numbers to <size> nums, with current page focused', () => {
  const getNums = (descriptors: Array<PageDescriptor>): string =>
    descriptors
      .filter(d => d.type === 'NUMBER')
      .map(d => d.page)
      .join(' ');

  expect(getNums(paginate(0, 10, 3))).toBe('0 1 2');
  expect(getNums(paginate(1, 10, 3))).toBe('0 1 2');
  expect(getNums(paginate(2, 10, 3))).toBe('1 2 3');
  expect(getNums(paginate(3, 10, 3))).toBe('2 3 4');
  expect(getNums(paginate(4, 10, 3))).toBe('3 4 5');
  expect(getNums(paginate(5, 10, 3))).toBe('4 5 6');
  expect(getNums(paginate(6, 10, 3))).toBe('5 6 7');
  expect(getNums(paginate(7, 10, 3))).toBe('6 7 8');
  expect(getNums(paginate(8, 10, 3))).toBe('7 8 9');
  expect(getNums(paginate(9, 10, 3))).toBe('7 8 9');
});

test('returns all numbers if size is not provided', () => {
  expect(paginate(3, 5)).toMatchInlineSnapshot(`
    Array [
      Object {
        "isCurrentPage": false,
        "page": 0,
        "type": "FIRST",
      },
      Object {
        "isCurrentPage": false,
        "page": 2,
        "type": "PREV",
      },
      Object {
        "isCurrentPage": false,
        "page": 0,
        "type": "NUMBER",
      },
      Object {
        "isCurrentPage": false,
        "page": 1,
        "type": "NUMBER",
      },
      Object {
        "isCurrentPage": false,
        "page": 2,
        "type": "NUMBER",
      },
      Object {
        "isCurrentPage": true,
        "page": 3,
        "type": "NUMBER",
      },
      Object {
        "isCurrentPage": false,
        "page": 4,
        "type": "NUMBER",
      },
      Object {
        "isCurrentPage": false,
        "page": 4,
        "type": "NEXT",
      },
      Object {
        "isCurrentPage": false,
        "page": 4,
        "type": "LAST",
      },
    ]
  `);
});

test('totalPages:0', () => {
  expect(paginate(3, 0, 5)).toMatchInlineSnapshot(`Array []`);
});
