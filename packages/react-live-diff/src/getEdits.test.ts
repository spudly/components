import stringSplice from '@spudly/string-splice';
import getEdits from './getEdits';
import {reduce} from './reducer';
import {EditorState} from './types';
import times from '@spudly/times';
import {getIndex} from './utils';

expect.addSnapshotSerializer({
  test(state) {
    return (
      state &&
      state.value &&
      state.selectionStart != null &&
      state.selectionEnd != null
    );
  },
  print(state: EditorState) {
    const {value, selectionStart, selectionEnd} = state;
    let result = value;
    if (selectionStart !== selectionEnd) {
      result = stringSplice(
        Math.max(selectionStart, selectionEnd),
        0,
        '🤛',
        result,
      );
    }
    result = stringSplice(
      selectionStart <= selectionEnd ? selectionEnd : selectionStart,
      0,
      '👊',
      result,
    );
    if (selectionStart !== selectionEnd) {
      result = stringSplice(
        Math.min(selectionStart, selectionEnd),
        0,
        '🤜',
        result,
      );
    }
    return result;
  },
});

test('returns an array of edit actions', () => {
  expect(
    getEdits(
      {
        value: 'a b c d e',
        selectionStart: 0,
        selectionEnd: 0,
      },
      'c d e f g',
    ),
  ).toEqual([
    // start: "|a b c d e"
    {type: 'MOVE_RIGHT', select: true}, // "[a|] b c d e"
    {type: 'MOVE_RIGHT', select: true}, // "[a |]b c d e"
    {type: 'MOVE_RIGHT', select: true}, // "[a b|] c d e"
    {type: 'MOVE_RIGHT', select: true}, // "[a b |]c d e"
    {type: 'DELETE_SELECTED'}, // "|c d e"
    {type: 'MOVE_RIGHT', select: false}, // "c| d e"
    {type: 'MOVE_RIGHT', select: false}, // "c |d e"
    {type: 'MOVE_RIGHT', select: false}, // "c d| e"
    {type: 'MOVE_RIGHT', select: false}, // "c d |e"
    {type: 'MOVE_RIGHT', select: false}, // "c d e|"
    {type: 'TYPE', char: ' '}, // "c d e |"
    {type: 'TYPE', char: 'f'}, // "c d e f|"
    {type: 'TYPE', char: ' '}, // "c d e f |"
    {type: 'TYPE', char: 'g'}, // "c d e f g|"
  ]);
});

test('moves down, then left', () => {
  const startValue = 'a b c\nd e f\ng h i';
  const endValue = 'a b c\nd e f\nX h i';
  const edits = getEdits(
    {
      value: startValue,
      selectionStart: 5,
      selectionEnd: 5,
    },
    endValue,
  );
  expect(edits).toEqual([
    // start: "a b c|\nd e f\ng h i"
    {type: 'MOVE_DOWN', select: false}, // "a b c\nd e f|\ng h i"
    {type: 'MOVE_DOWN', select: false}, // "a b c\nd e f\ng h i|"
    {type: 'MOVE_LEFT', select: false}, // "a b c\nd e f\ng h |i"
    {type: 'MOVE_LEFT', select: false}, // "a b c\nd e f\ng h| i"
    {type: 'MOVE_LEFT', select: false}, // "a b c\nd e f\ng |h i"
    {type: 'MOVE_LEFT', select: false}, // "a b c\nd e f\ng| h i"
    {type: 'MOVE_LEFT', select: false}, // "a b c\nd e f\n|g h i"
    {type: 'MOVE_RIGHT', select: true}, // "a b c\nd e f\ng| h i"
    {type: 'DELETE_SELECTED'}, // "a b c\nd e f\n| h i"
    {type: 'TYPE', char: 'X'}, // "a b c\nd e f\nX| h i "
  ]);
});

test('moves down, then right', () => {
  const startValue = 'a b c\nd e f\ng h i';
  const endValue = 'a b c\nd e f\ng h i j k l';
  expect(
    getEdits(
      {
        value: startValue,
        selectionStart: 0,
        selectionEnd: 0,
      },
      endValue,
    ),
  ).toStrictEqual([
    // start: "|a b c\nd e f\ng h i"
    {type: 'MOVE_DOWN', select: false}, // "a b c\n|d e f\ng h i"
    {type: 'MOVE_DOWN', select: false}, // "a b c\nd e f\n|g h i"
    {type: 'MOVE_RIGHT', select: false}, // "a b c\nd e f\ng| h i"
    {type: 'MOVE_RIGHT', select: false}, // "a b c\nd e f\ng |h i"
    {type: 'MOVE_RIGHT', select: false}, // "a b c\nd e f\ng h| i"
    {type: 'MOVE_RIGHT', select: false}, // "a b c\nd e f\ng h |i"
    {type: 'MOVE_RIGHT', select: false}, // "a b c\nd e f\ng h i|"
    {type: 'TYPE', char: ' '}, // "a b c\nd e f\ng h i |"
    {type: 'TYPE', char: 'j'}, // "a b c\nd e f\ng h i j|"
    {type: 'TYPE', char: ' '}, // "a b c\nd e f\ng h i j |"
    {type: 'TYPE', char: 'k'}, // "a b c\nd e f\ng h i j k|"
    {type: 'TYPE', char: ' '}, // "a b c\nd e f\ng h i j k |"
    {type: 'TYPE', char: 'l'}, // "a b c\nd e f\ng h i j k l|"
  ]);
});

test('moves up, then right', () => {
  const startValue = 'a b c\nd e f\ng h i';
  const endValue = 'a b c 1 2 3\nd e f\ng h i';
  expect(
    getEdits(
      {
        value: startValue,
        selectionStart: 12,
        selectionEnd: 12,
      },
      endValue,
    ),
  ).toEqual([
    // start: "a b c\nd e f\n|g h i"
    {type: 'MOVE_UP', select: false}, // "a b c\n|d e f\ng h i"
    {type: 'MOVE_UP', select: false}, // "|a b c\nd e f\ng h i"
    {type: 'MOVE_RIGHT', select: false}, // "a| b c\nd e f\ng h i"
    {type: 'MOVE_RIGHT', select: false}, // "a |b c\nd e f\ng h i"
    {type: 'MOVE_RIGHT', select: false}, // "a b| c\nd e f\ng h i"
    {type: 'MOVE_RIGHT', select: false}, // "a b |c\nd e f\ng h i"
    {type: 'MOVE_RIGHT', select: false}, // "a b c|\nd e f\ng h i"
    {type: 'TYPE', char: ' '}, // "a b c |\nd e f\ng h i"
    {type: 'TYPE', char: '1'}, // "a b c 1|\nd e f\ng h i"
    {type: 'TYPE', char: ' '}, // "a b c 1 |\nd e f\ng h i"
    {type: 'TYPE', char: '2'}, // "a b c 1 2|\nd e f\ng h i"
    {type: 'TYPE', char: ' '}, // "a b c 1 2 |\nd e f\ng h i"
    {type: 'TYPE', char: '3'}, // "a b c 1 2 3|\nd e f\ng h i"
  ]);
});

test('moves up, then left', () => {
  const startValue = 'a b c\nd e f\ng h i';
  const endValue = 'X b c\nd e f\ng h i';
  expect(
    getEdits(
      {
        value: startValue,
        selectionStart: 17,
        selectionEnd: 17,
      },
      endValue,
    ),
  ).toEqual([
    // start: "a b c\nd e f\ng h i|"
    {type: 'MOVE_UP', select: false}, // "a b c\nd e f|\ng h i"
    {type: 'MOVE_UP', select: false}, // "a b c|\nd e f\ng h i"
    {type: 'MOVE_LEFT', select: false}, // "a b |c\nd e f\ng h i"
    {type: 'MOVE_LEFT', select: false}, // "a b| c\nd e f\ng h i"
    {type: 'MOVE_LEFT', select: false}, // "a |b c\nd e f\ng h i"
    {type: 'MOVE_LEFT', select: false}, // "a| b c\nd e f\ng h i"
    {type: 'MOVE_LEFT', select: false}, // "|a b c\nd e f\ng h i"
    {type: 'MOVE_RIGHT', select: true}, // "a| b c\nd e f\ng h i"
    {type: 'DELETE_SELECTED'}, // "| b c\nd e f\ng h i"
    {type: 'TYPE', char: 'X'}, // "X| b c\nd e f\ng h i"
  ]);
});

test('correctly handles moving to lines with fewer columns', () => {
  const value = 'abc\n\n1234';
  const state = {
    value,
    selectionStart: getIndex(value, 1, 3),
    selectionEnd: getIndex(value, 1, 3),
  };
  const edits = getEdits(state, 'abc\n\n5678');
  expect(edits).toStrictEqual([
    ...times(2, {type: 'MOVE_DOWN', select: false}),
    ...times(4, {type: 'MOVE_RIGHT', select: true}),
    {type: 'DELETE_SELECTED'},
    {type: 'TYPE', char: '5'},
    {type: 'TYPE', char: '6'},
    {type: 'TYPE', char: '7'},
    {type: 'TYPE', char: '8'},
  ]);
  expect(reduce(state, edits.slice(0, 1))).toMatchInlineSnapshot(`
    abc
    👊
    1234
  `);
  expect(reduce(state, edits.slice(0, 2))).toMatchInlineSnapshot(`
    abc

    👊1234
  `);
  expect(reduce(state, edits.slice(0, 3))).toMatchInlineSnapshot(`
    abc

    🤜1👊🤛234
  `);
  expect(reduce(state, edits.slice(0, 4))).toMatchInlineSnapshot(`
    abc

    🤜12👊🤛34
  `);
  expect(reduce(state, edits.slice(0, 5))).toMatchInlineSnapshot(`
    abc

    🤜123👊🤛4
  `);
  expect(reduce(state, edits.slice(0, 6))).toMatchInlineSnapshot(`
    abc

    🤜1234👊🤛
  `);
  expect(reduce(state, edits.slice(0, 7))).toMatchInlineSnapshot(`
    abc

    👊
  `);
  expect(reduce(state, edits.slice(0, 8))).toMatchInlineSnapshot(`
    abc

    5👊
  `);
  expect(reduce(state, edits.slice(0, 9))).toMatchInlineSnapshot(`
    abc

    56👊
  `);
  expect(reduce(state, edits.slice(0, 10))).toMatchInlineSnapshot(`
    abc

    567👊
  `);
  expect(reduce(state, edits.slice(0, 11))).toMatchInlineSnapshot(`
    abc

    5678👊
  `);
});

test('integrates nicely with reduce', () => {
  const state = {
    value: 'a b c d e',
    selectionStart: 0,
    selectionEnd: 0,
  };
  const edits = getEdits(state, 'c d e f g');
  expect(reduce(state, edits)).toStrictEqual({
    value: 'c d e f g',
    selectionStart: 9,
    selectionEnd: 9,
  });
});
