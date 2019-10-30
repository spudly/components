import editorStateReducer from './editorStateReducer';
import {EditorState, EditAction} from './types';
import reduceEditorState from './editorStateReducer';
import makePosition from './makePosition';

const value = 'one\ntwo\nthree';

const state: EditorState = {
  value,
  selection: {
    from: makePosition(value, {line: 2, column: 2}),
    to: makePosition(value, {line: 2, column: 2}),
  },
};

describe('MOVE_UP', () => {
  test('moves cursor up', () => {
    expect(editorStateReducer(state, [{type: 'MOVE_UP'}])).toStrictEqual({
      ...state,
      selection: {
        from: makePosition(value, {line: 1, column: 2}),
        to: makePosition(value, {line: 1, column: 2}),
      },
    });
  });

  test('if already on line 1, returns state unmodified', () => {
    const myState = {
      ...state,
      selection: {
        from: makePosition(value, {
          line: 1,
          column: 2,
        }),
        to: makePosition(value, {
          line: 1,
          column: 2,
        }),
      },
    };
    expect(reduceEditorState(myState, [{type: 'MOVE_UP'}])).toBe(myState);
  });
});

describe('MOVE_DOWN', () => {
  test('moves cursor DOWN', () => {
    expect(reduceEditorState(state, [{type: 'MOVE_DOWN'}])).toStrictEqual({
      ...state,
      selection: {
        from: makePosition(value, {
          line: 3,
          column: 2,
        }),
        to: makePosition(value, {
          line: 3,
          column: 2,
        }),
      },
    });
  });

  test('if already on last line, returns state unmodified', () => {
    const myState = {
      ...state,
      selection: {
        from: makePosition(value, {
          line: 3,
          column: 2,
        }),
        to: makePosition(value, {
          line: 3,
          column: 2,
        }),
      },
    };
    expect(reduceEditorState(myState, [{type: 'MOVE_DOWN'}])).toBe(myState);
  });
});

describe('MOVE_LEFT', () => {
  test('moves the cursor to the left', () => {
    expect(reduceEditorState(state, [{type: 'MOVE_LEFT'}])).toStrictEqual({
      value: 'one\ntwo\nthree',
      selection: {
        from: makePosition(value, {
          line: 2,
          column: 1,
        }),
        to: makePosition(value, {
          line: 2,
          column: 1,
        }),
      },
    });
  });

  test('if column === 1, moves the cursor to the end of the prev line', () => {
    const myState = {
      ...state,
      selection: {
        from: makePosition(value, {
          line: 2,
          column: 1,
        }),
        to: makePosition(value, {
          line: 2,
          column: 1,
        }),
      },
    };
    expect(reduceEditorState(myState, [{type: 'MOVE_LEFT'}])).toStrictEqual({
      ...state,
      selection: {
        from: makePosition(value, {line: 1, column: 4}),
        to: makePosition(value, {line: 1, column: 4}),
      },
    });
  });

  test('if column === 1 and line === 1 does not move cursor', () => {
    const myState = {
      ...state,
      selection: {
        from: makePosition(value, {
          line: 1,
          column: 1,
        }),
        to: makePosition(value, {
          line: 1,
          column: 1,
        }),
      },
    };
    expect(reduceEditorState(myState, [{type: 'MOVE_LEFT'}])).toBe(myState);
  });
});

describe('MOVE_RIGHT', () => {
  test('moves the cursor to the right', () => {
    expect(reduceEditorState(state, [{type: 'MOVE_RIGHT'}])).toStrictEqual({
      value: 'one\ntwo\nthree',
      selection: {
        from: makePosition(value, {
          line: 2,
          column: 3,
        }),
        to: makePosition(value, {
          line: 2,
          column: 3,
        }),
      },
    });
  });

  test('if column is last, moves the cursor to the start of the next line', () => {
    const myState = {
      ...state,
      selection: {
        from: makePosition(value, {
          line: 2,
          column: 4,
        }),
        to: makePosition(value, {
          line: 2,
          column: 4,
        }),
      },
    };
    expect(reduceEditorState(myState, [{type: 'MOVE_RIGHT'}])).toStrictEqual({
      ...state,
      selection: {
        from: makePosition(value, {
          line: 3,
          column: 1,
        }),
        to: makePosition(value, {
          line: 3,
          column: 1,
        }),
      },
    });
  });

  test('if column is last and line is last does not move cursor', () => {
    const myState = {
      ...state,
      selection: {
        from: makePosition(value, {
          line: 3,
          column: 6,
        }),
        to: makePosition(value, {
          line: 3,
          column: 6,
        }),
      },
    };
    expect(reduceEditorState(myState, [{type: 'MOVE_RIGHT'}])).toBe(myState);
  });
});

describe('DELETE_SELECTED', () => {
  test('from < to', () => {
    const myState: EditorState = {
      value: 'one\ntwo\nthree',
      selection: {
        from: makePosition(value, {line: 3, column: 2}),
        to: makePosition(value, {line: 3, column: 5}),
      },
    };

    expect(
      reduceEditorState(myState, [{type: 'DELETE_SELECTED'}]),
    ).toStrictEqual({
      value: 'one\ntwo\nte',
      selection: {
        from: makePosition(value, {line: 3, column: 2}),
        to: makePosition(value, {line: 3, column: 2}),
      },
    });
  });

  test('to > from', () => {
    const myState: EditorState = {
      value: 'one\ntwo\nthree',
      selection: {
        from: makePosition(value, {line: 3, column: 5}),
        to: makePosition(value, {line: 3, column: 2}),
      },
    };

    expect(
      reduceEditorState(myState, [{type: 'DELETE_SELECTED'}]),
    ).toStrictEqual({
      value: 'one\ntwo\nte',
      selection: {
        from: makePosition(value, {line: 3, column: 2}),
        to: makePosition(value, {line: 3, column: 2}),
      },
    });
  });

  test('from < to (multi-line)', () => {
    const myState: EditorState = {
      value: 'one\ntwo\nthree',
      selection: {
        from: makePosition(value, {line: 2, column: 2}),
        to: makePosition(value, {line: 3, column: 5}),
      },
    };

    expect(
      reduceEditorState(myState, [{type: 'DELETE_SELECTED'}]),
    ).toStrictEqual({
      value: 'one\nte',
      selection: {
        from: makePosition(value, {line: 2, column: 2}),
        to: makePosition(value, {line: 2, column: 2}),
      },
    });
  });

  test('from > to (multi-line)', () => {
    const myState: EditorState = {
      value: 'one\ntwo\nthree',
      selection: {
        from: makePosition(value, {line: 3, column: 5}),
        to: makePosition(value, {line: 2, column: 2}),
      },
    };

    expect(
      reduceEditorState(myState, [{type: 'DELETE_SELECTED'}]),
    ).toStrictEqual({
      value: 'one\nte',
      selection: {
        from: makePosition(value, {line: 2, column: 2}),
        to: makePosition(value, {line: 2, column: 2}),
      },
    });
  });
});

describe('BACKSPACE', () => {
  test('removes the character before the cursor, moves cursor left', () => {
    expect(reduceEditorState(state, [{type: 'BACKSPACE'}])).toStrictEqual({
      value: 'one\nwo\nthree',
      selection: {
        from: makePosition(value, {
          line: 2,
          column: 1,
        }),
        to: makePosition(value, {
          line: 2,
          column: 1,
        }),
      },
    });
  });

  test('if column is first, joins to prev line, moves cursor left', () => {
    expect(
      reduceEditorState(
        {
          ...state,
          selection: {
            from: makePosition(value, {line: 2, column: 1}),
            to: makePosition(value, {line: 2, column: 1}),
          },
        },
        [{type: 'BACKSPACE'}],
      ),
    ).toStrictEqual({
      value: 'onetwo\nthree',
      selection: {
        from: makePosition(value, {line: 1, column: 4}),
        to: makePosition(value, {line: 1, column: 4}),
      },
    });
  });
});

describe('TYPE', () => {
  test('inserts char to right of cursor, moves cursor right', () => {
    expect(reduceEditorState(state, [{type: 'TYPE', char: 'X'}])).toStrictEqual(
      {
        value: 'one\ntXwo\nthree',
        selection: {
          from: makePosition(value, {line: 2, column: 3}),
          to: makePosition(value, {line: 2, column: 3}),
        },
      },
    );
  });
});

describe('integration', () => {
  test('transforms one string into another', () => {
    const before = 'a b c d e';
    const after = 'c d e f g';
    const edits: Array<EditAction> = [
      // start: "|a b c d e"
      {type: 'MOVE_RIGHT'}, // "a| b c d e"
      {type: 'MOVE_RIGHT'}, // "a |b c d e"
      {type: 'MOVE_RIGHT'}, // "a b| c d e"
      {type: 'MOVE_RIGHT'}, // "a b |c d e"
      {type: 'BACKSPACE'}, // "a b|c d e"
      {type: 'BACKSPACE'}, // "a |c d e"
      {type: 'BACKSPACE'}, // "a|c d e"
      {type: 'BACKSPACE'}, // "|c d e"
      {type: 'MOVE_RIGHT'}, // "c| d e"
      {type: 'MOVE_RIGHT'}, // "c |d e"
      {type: 'MOVE_RIGHT'}, // "c d| e"
      {type: 'MOVE_RIGHT'}, // "c d |e"
      {type: 'MOVE_RIGHT'}, // "c d e|"
      {type: 'TYPE', char: ' '}, // "c d e |"
      {type: 'TYPE', char: 'f'}, // "c d e f|"
      {type: 'TYPE', char: ' '}, // "c d e f |"
      {type: 'TYPE', char: 'g'}, // "c d e f g|"
    ];
    expect(
      reduceEditorState(
        {
          value: before,
          selection: {
            from: makePosition(before, {line: 1, column: 1}),
            to: makePosition(before, {line: 1, column: 1}),
          },
        },
        edits,
      ),
    ).toStrictEqual({
      value: after,
      selection: {
        from: makePosition(after, {line: 1, column: 10}),
        to: makePosition(after, {line: 1, column: 10}),
      },
    });
  });

  test('incremental changes: "a b c d e" => "c d e f g"', () => {
    let state = {
      value: 'a b c d e',
      selection: {
        from: makePosition('a b c d e', {line: 1, column: 1}),
        to: makePosition('a b c d e', {line: 1, column: 1}),
      },
    };
    state = editorStateReducer(state, [{type: 'MOVE_RIGHT', select: true}]);
    expect(state).toStrictEqual({
      value: 'a b c d e',
      selection: {
        from: makePosition('a b c d e', {line: 1, column: 1}),
        to: makePosition('a b c d e', {line: 1, column: 2}),
      },
    });
    state = editorStateReducer(state, [{type: 'MOVE_RIGHT', select: true}]);
    expect(state).toStrictEqual({
      value: 'a b c d e',
      selection: {
        from: makePosition('a b c d e', {line: 1, column: 1}),
        to: makePosition('a b c d e', {line: 1, column: 3}),
      },
    });
    state = editorStateReducer(state, [{type: 'MOVE_RIGHT', select: true}]);
    expect(state).toStrictEqual({
      value: 'a b c d e',
      selection: {
        from: makePosition('a b c d e', {line: 1, column: 1}),
        to: makePosition('a b c d e', {line: 1, column: 4}),
      },
    });
    state = editorStateReducer(state, [{type: 'MOVE_RIGHT', select: true}]);
    expect(state).toStrictEqual({
      value: 'a b c d e',
      selection: {
        from: makePosition('a b c d e', {line: 1, column: 1}),
        to: makePosition('a b c d e', {line: 1, column: 5}),
      },
    });
    state = editorStateReducer(state, [{type: 'DELETE_SELECTED'}]);
    expect(state).toStrictEqual({
      value: 'c d e',
      selection: {
        from: makePosition('c d e', {line: 1, column: 1}),
        to: makePosition('c d e', {line: 1, column: 1}),
      },
    });
    state = editorStateReducer(state, [{type: 'MOVE_RIGHT', select: false}]);
    expect(state).toStrictEqual({
      value: 'c d e',
      selection: {
        from: makePosition('c d e', {line: 1, column: 2}),
        to: makePosition('c d e', {line: 1, column: 2}),
      },
    });
    state = editorStateReducer(state, [{type: 'MOVE_RIGHT', select: false}]);
    expect(state).toStrictEqual({
      value: 'c d e',
      selection: {
        from: makePosition('c d e', {line: 1, column: 3}),
        to: makePosition('c d e', {line: 1, column: 3}),
      },
    });
    state = editorStateReducer(state, [{type: 'MOVE_RIGHT', select: false}]);
    expect(state).toStrictEqual({
      value: 'c d e',
      selection: {
        from: makePosition('c d e', {line: 1, column: 4}),
        to: makePosition('c d e', {line: 1, column: 4}),
      },
    });
    state = editorStateReducer(state, [{type: 'MOVE_RIGHT', select: false}]);
    expect(state).toStrictEqual({
      value: 'c d e',
      selection: {
        from: makePosition('c d e', {line: 1, column: 5}),
        to: makePosition('c d e', {line: 1, column: 5}),
      },
    });
    state = editorStateReducer(state, [{type: 'MOVE_RIGHT', select: false}]);
    expect(state).toStrictEqual({
      value: 'c d e',
      selection: {
        from: makePosition('c d e', {line: 1, column: 6}),
        to: makePosition('c d e', {line: 1, column: 6}),
      },
    });
    state = editorStateReducer(state, [{type: 'TYPE', char: ' '}]);
    expect(state).toStrictEqual({
      value: 'c d e ',
      selection: {
        from: makePosition('c d e ', {line: 1, column: 7}),
        to: makePosition('c d e ', {line: 1, column: 7}),
      },
    });
    state = editorStateReducer(state, [{type: 'TYPE', char: 'f'}]);
    expect(state).toStrictEqual({
      value: 'c d e f',
      selection: {
        from: makePosition('c d e f', {line: 1, column: 8}),
        to: makePosition('c d e f', {line: 1, column: 8}),
      },
    });
    state = editorStateReducer(state, [{type: 'TYPE', char: ' '}]);
    expect(state).toStrictEqual({
      value: 'c d e f ',
      selection: {
        from: makePosition('c d e f ', {line: 1, column: 9}),
        to: makePosition('c d e f ', {line: 1, column: 9}),
      },
    });
    state = editorStateReducer(state, [{type: 'TYPE', char: 'g'}]);
    expect(state).toStrictEqual({
      value: 'c d e f g',
      selection: {
        from: makePosition('c d e f g', {line: 1, column: 10}),
        to: makePosition('c d e f g', {line: 1, column: 10}),
      },
    });
  });

  test('incremental changes: "a b c↵d e f↵g h i" => "a b c↵d e f↵X h i"', () => {
    const startValue = 'a b c\nd e f\ng h i';
    const endValue = 'a b c\nd e f\nX h i';
    let state = {
      value: startValue,
      selection: {
        from: makePosition(startValue, {line: 1, column: 6}),
        to: makePosition(startValue, {line: 1, column: 6}),
      },
    };

    state = editorStateReducer(state, [{type: 'MOVE_DOWN', select: false}]);
    expect(state).toStrictEqual({
      value: 'a b c\nd e f\ng h i',
      selection: {
        from: makePosition('a b c\nd e f\ng h i', {line: 2, column: 6}),
        to: makePosition('a b c\nd e f\ng h i', {line: 2, column: 6}),
      },
    });
    state = editorStateReducer(state, [{type: 'MOVE_DOWN', select: false}]);
    expect(state).toStrictEqual({
      value: 'a b c\nd e f\ng h i',
      selection: {
        from: makePosition('a b c\nd e f\ng h i', {line: 3, column: 6}),
        to: makePosition('a b c\nd e f\ng h i', {line: 3, column: 6}),
      },
    });
    state = editorStateReducer(state, [{type: 'MOVE_LEFT', select: false}]);
    expect(state).toStrictEqual({
      value: 'a b c\nd e f\ng h i',
      selection: {
        from: makePosition('a b c\nd e f\ng h i', {line: 3, column: 5}),
        to: makePosition('a b c\nd e f\ng h i', {line: 3, column: 5}),
      },
    });
    state = editorStateReducer(state, [{type: 'MOVE_LEFT', select: false}]);
    expect(state).toStrictEqual({
      value: 'a b c\nd e f\ng h i',
      selection: {
        from: makePosition('a b c\nd e f\ng h i', {line: 3, column: 4}),
        to: makePosition('a b c\nd e f\ng h i', {line: 3, column: 4}),
      },
    });
    state = editorStateReducer(state, [{type: 'MOVE_LEFT', select: false}]);
    expect(state).toStrictEqual({
      value: 'a b c\nd e f\ng h i',
      selection: {
        from: makePosition('a b c\nd e f\ng h i', {line: 3, column: 3}),
        to: makePosition('a b c\nd e f\ng h i', {line: 3, column: 3}),
      },
    });
    state = editorStateReducer(state, [{type: 'MOVE_LEFT', select: false}]);
    expect(state).toStrictEqual({
      value: 'a b c\nd e f\ng h i',
      selection: {
        from: makePosition('a b c\nd e f\ng h i', {line: 3, column: 2}),
        to: makePosition('a b c\nd e f\ng h i', {line: 3, column: 2}),
      },
    });
    state = editorStateReducer(state, [{type: 'MOVE_LEFT', select: false}]);
    expect(state).toStrictEqual({
      value: 'a b c\nd e f\ng h i',
      selection: {
        from: makePosition('a b c\nd e f\ng h i', {line: 3, column: 1}),
        to: makePosition('a b c\nd e f\ng h i', {line: 3, column: 1}),
      },
    });
    state = editorStateReducer(state, [{type: 'MOVE_RIGHT', select: true}]);
    expect(state).toStrictEqual({
      value: 'a b c\nd e f\ng h i',
      selection: {
        from: makePosition('a b c\nd e f\ng h i', {line: 3, column: 1}),
        to: makePosition('a b c\nd e f\ng h i', {line: 3, column: 2}),
      },
    });
    state = editorStateReducer(state, [{type: 'DELETE_SELECTED'}]);
    expect(state).toStrictEqual({
      value: 'a b c\nd e f\n h i',
      selection: {
        from: makePosition('a b c\nd e f\n h i', {line: 3, column: 1}),
        to: makePosition('a b c\nd e f\n h i', {line: 3, column: 1}),
      },
    });
    state = editorStateReducer(state, [{type: 'TYPE', char: 'X'}]);
    expect(state).toStrictEqual({
      value: 'a b c\nd e f\nX h i',
      selection: {
        from: makePosition('a b c\nd e f\nX h i', {line: 3, column: 2}),
        to: makePosition('a b c\nd e f\nX h i', {line: 3, column: 2}),
      },
    });

    expect(state.value).toBe(endValue);
  });
});
