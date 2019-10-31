import * as diff from 'diff';
import getEdits from './getEdits';
import editorStateReducer from './editorStateReducer';
import reduceEditorState from './editorStateReducer';
import {EditorState} from './types';
import times from '@spudly/times';
import makePosition from './makePosition';

// TODO: extract into a package: @spudly/string-splice
const stringSplice = (
  s: string,
  start: number,
  deleteCount: number,
  chars = '',
) => {
  start = Math.min(start, s.length);
  if (start < 0) {
    start = s.length + start;
    if (start < 0) {
      start = 0;
    }
  }

  const before = s.slice(0, start);
  const after = s.slice(start + Math.max(deleteCount, 0));

  return `${before}${chars}${after}`;
};

expect.addSnapshotSerializer({
  test(state) {
    return (
      state &&
      state.value &&
      state.selection &&
      state.selection.from &&
      state.selection.to
    );
  },
  print(state: EditorState, _, indent) {
    const {
      value,
      selection: {from, to},
    } = state;
    let result = value;
    if (from.index !== to.index) {
      result = stringSplice(result, Math.max(from.index, to.index), 0, '🤛');
    }
    result = stringSplice(
      result,
      from.index <= to.index ? to.index : from.index,
      0,
      '👊',
    );
    if (from.index !== to.index) {
      result = stringSplice(result, Math.min(from.index, to.index), 0, '🤜');
    }
    return result;
    // return indent(result).replace(/\n +\n/g, '\n\n');
  },
});

test('returns an array of edit actions', () => {
  expect(
    getEdits(
      {
        value: 'a b c d e',
        selection: {
          from: {line: 1, column: 1, index: 0},
          to: {line: 1, column: 1, index: 0},
        },
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
      selection: {
        from: {line: 1, column: 6, index: 5},
        to: {line: 1, column: 6, index: 5},
      },
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
        selection: {
          from: {line: 1, column: 1, index: 0},
          to: {line: 1, column: 1, index: 0},
        },
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
        selection: {
          from: {line: 3, column: 1, index: 6},
          to: {line: 3, column: 1, index: 6},
        },
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
        selection: {
          from: {line: 3, column: 6, index: 17},
          to: {line: 3, column: 6, index: 17},
        },
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
    selection: {
      from: makePosition(value, {line: 1, column: 3}),
      to: makePosition(value, {line: 1, column: 3}),
    },
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
  expect(editorStateReducer(state, edits.slice(0, 1))).toMatchInlineSnapshot(`
    abc
    👊
    1234
  `);
  expect(editorStateReducer(state, edits.slice(0, 2))).toMatchInlineSnapshot(`
    abc

    👊1234
  `);
  expect(editorStateReducer(state, edits.slice(0, 3))).toMatchInlineSnapshot(`
    abc

    🤜1👊🤛234
  `);
  expect(editorStateReducer(state, edits.slice(0, 4))).toMatchInlineSnapshot(`
    abc

    🤜12👊🤛34
  `);
  expect(editorStateReducer(state, edits.slice(0, 5))).toMatchInlineSnapshot(`
    abc

    🤜123👊🤛4
  `);
  expect(editorStateReducer(state, edits.slice(0, 6))).toMatchInlineSnapshot(`
    abc

    🤜1234👊🤛
  `);
  expect(editorStateReducer(state, edits.slice(0, 7))).toMatchInlineSnapshot(`
    abc

    👊
  `);
  expect(editorStateReducer(state, edits.slice(0, 8))).toMatchInlineSnapshot(`
    abc

    5👊
  `);
  expect(editorStateReducer(state, edits.slice(0, 9))).toMatchInlineSnapshot(`
    abc

    56👊
  `);
  expect(editorStateReducer(state, edits.slice(0, 10))).toMatchInlineSnapshot(`
    abc

    567👊
  `);
  expect(editorStateReducer(state, edits.slice(0, 11))).toMatchInlineSnapshot(`
    abc

    5678👊
  `);
});

test('integrates nicely with editorStateReducer', () => {
  const state = {
    value: 'a b c d e',
    selection: {
      from: {line: 1, column: 1, index: 0},
      to: {line: 1, column: 1, index: 0},
    },
  };
  const edits = getEdits(state, 'c d e f g');
  expect(editorStateReducer(state, edits)).toStrictEqual({
    value: 'c d e f g',
    selection: {
      from: {line: 1, column: 10, index: 9},
      to: {line: 1, column: 10, index: 9},
    },
  });
});
