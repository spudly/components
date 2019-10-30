import getEdits from './getEdits';
import editorStateReducer from './editorStateReducer';

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
