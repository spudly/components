import editorStateReducer from './editorStateReducer';
import {EditorState, EditAction} from './types';
import reduceEditorState from './editorStateReducer';

const state: EditorState = {
  value: 'one\ntwo\nthree',
  position: {
    line: 2,
    column: 2,
  },
  selection: null,
};

describe('MOVE_UP', () => {
  test('moves cursor up', () => {
    expect(editorStateReducer(state, [{type: 'MOVE_UP'}])).toStrictEqual({
      ...state,
      position: {
        line: 1,
        column: 2,
      },
    });
  });

  test('if already on line 1, returns state unmodified', () => {
    const myState = {
      ...state,
      position: {
        line: 1,
        column: 2,
      },
    };
    expect(reduceEditorState(myState, [{type: 'MOVE_UP'}])).toBe(myState);
  });
});

describe('MOVE_DOWN', () => {
  test('moves cursor DOWN', () => {
    expect(reduceEditorState(state, [{type: 'MOVE_DOWN'}])).toStrictEqual({
      ...state,
      position: {
        line: 3,
        column: 2,
      },
    });
  });

  test('if already on last line, returns state unmodified', () => {
    const myState = {
      ...state,
      position: {
        line: 3,
        column: 2,
      },
    };
    expect(reduceEditorState(myState, [{type: 'MOVE_DOWN'}])).toBe(myState);
  });
});

describe('MOVE_LEFT', () => {
  test('moves the cursor to the left', () => {
    expect(reduceEditorState(state, [{type: 'MOVE_LEFT'}])).toStrictEqual({
      value: 'one\ntwo\nthree',
      position: {
        line: 2,
        column: 1,
      },
      selection: null,
    });
  });

  test('if column === 1, moves the cursor to the end of the prev line', () => {
    const myState = {
      ...state,
      position: {
        line: 2,
        column: 1,
      },
    };
    expect(reduceEditorState(myState, [{type: 'MOVE_LEFT'}])).toStrictEqual({
      ...state,
      position: {
        line: 1,
        column: 4,
      },
    });
  });

  test('if column === 1 and line === 1 does not move cursor', () => {
    const myState = {
      ...state,
      position: {
        line: 1,
        column: 1,
      },
    };
    expect(reduceEditorState(myState, [{type: 'MOVE_LEFT'}])).toBe(myState);
  });
});

describe('MOVE_RIGHT', () => {
  test('moves the cursor to the right', () => {
    expect(reduceEditorState(state, [{type: 'MOVE_RIGHT'}])).toStrictEqual({
      value: 'one\ntwo\nthree',
      position: {
        line: 2,
        column: 3,
      },
      selection: null,
    });
  });

  test('if column is last, moves the cursor to the start of the next line', () => {
    const myState = {
      ...state,
      position: {
        line: 2,
        column: 4,
      },
    };
    expect(reduceEditorState(myState, [{type: 'MOVE_RIGHT'}])).toStrictEqual({
      ...state,
      position: {
        line: 3,
        column: 1,
      },
    });
  });

  test('if column is last and line is last does not move cursor', () => {
    const myState = {
      ...state,
      position: {
        line: 3,
        column: 6,
      },
    };
    expect(reduceEditorState(myState, [{type: 'MOVE_RIGHT'}])).toBe(myState);
  });
});

describe('DELETE_SELECTED', () => {
  test('from < to', () => {
    const myState: EditorState = {
      value: 'one\ntwo\nthree',
      position: {line: 3, column: 5},
      selection: {
        from: {line: 3, column: 2},
        to: {line: 3, column: 5},
      },
    };

    expect(
      reduceEditorState(myState, [{type: 'DELETE_SELECTED'}]),
    ).toStrictEqual({
      value: 'one\ntwo\nte',
      position: {line: 3, column: 2},
      selection: null,
    });
  });

  test('to > from', () => {
    const myState: EditorState = {
      value: 'one\ntwo\nthree',
      position: {line: 3, column: 5},
      selection: {
        from: {line: 3, column: 5},
        to: {line: 3, column: 2},
      },
    };

    expect(
      reduceEditorState(myState, [{type: 'DELETE_SELECTED'}]),
    ).toStrictEqual({
      value: 'one\ntwo\nte',
      position: {line: 3, column: 2},
      selection: null,
    });
  });

  test('from < to (multi-line)', () => {
    const myState: EditorState = {
      value: 'one\ntwo\nthree',
      position: {line: 3, column: 5},
      selection: {
        from: {line: 2, column: 2},
        to: {line: 3, column: 5},
      },
    };

    expect(
      reduceEditorState(myState, [{type: 'DELETE_SELECTED'}]),
    ).toStrictEqual({
      value: 'one\nte',
      position: {line: 2, column: 2},
      selection: null,
    });
  });

  test('from > to (multi-line)', () => {
    const myState: EditorState = {
      value: 'one\ntwo\nthree',
      position: {line: 3, column: 5},
      selection: {
        from: {line: 3, column: 5},
        to: {line: 2, column: 2},
      },
    };

    expect(
      reduceEditorState(myState, [{type: 'DELETE_SELECTED'}]),
    ).toStrictEqual({
      value: 'one\nte',
      position: {line: 2, column: 2},
      selection: null,
    });
  });
});

describe('BACKSPACE', () => {
  test('removes the character before the cursor, moves cursor left', () => {
    expect(reduceEditorState(state, [{type: 'BACKSPACE'}])).toStrictEqual({
      value: 'one\nwo\nthree',
      position: {
        line: 2,
        column: 1,
      },
      selection: null,
    });
  });

  test('if column is first, joins to prev line, moves cursor left', () => {
    expect(
      reduceEditorState(
        {
          ...state,
          position: {
            line: 2,
            column: 1,
          },
        },
        [{type: 'BACKSPACE'}],
      ),
    ).toStrictEqual({
      value: 'onetwo\nthree',
      position: {
        line: 1,
        column: 4,
      },
      selection: null,
    });
  });
});

describe('TYPE', () => {
  test('inserts char to right of cursor, moves cursor right', () => {
    expect(reduceEditorState(state, [{type: 'TYPE', char: 'X'}])).toStrictEqual(
      {
        value: 'one\ntXwo\nthree',
        position: {
          line: 2,
          column: 3,
        },
        selection: null,
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
        {value: before, position: {line: 1, column: 1}, selection: null},
        edits,
      ),
    ).toStrictEqual({
      value: after,
      position: {line: 1, column: 10},
      selection: null,
    });
  });
});
