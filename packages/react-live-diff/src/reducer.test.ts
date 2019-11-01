import {reduce} from './reducer';
import {getIndex} from './utils';
import {EditorState, EditAction} from './types';

const value = 'one\ntwo\nthree';

const state: EditorState = {
  value,
  selection: {
    from: getIndex(value, 2, 2),
    to: getIndex(value, 2, 2),
  },
};

describe('MOVE_UP', () => {
  test('moves cursor up', () => {
    expect(reduce(state, [{type: 'MOVE_UP'}])).toStrictEqual({
      ...state,
      selection: {
        from: getIndex(value, 1, 2),
        to: getIndex(value, 1, 2),
      },
    });
  });

  test('if already on line 1, returns state unmodified', () => {
    const myState = {
      ...state,
      selection: {
        from: getIndex(value, 1, 2),
        to: getIndex(value, 1, 2),
      },
    };
    expect(reduce(myState, [{type: 'MOVE_UP'}])).toBe(myState);
  });
});

describe('MOVE_DOWN', () => {
  test('moves cursor DOWN', () => {
    expect(reduce(state, [{type: 'MOVE_DOWN'}])).toStrictEqual({
      ...state,
      selection: {
        from: getIndex(value, 3, 2),
        to: getIndex(value, 3, 2),
      },
    });
  });

  test('if already on last line, returns state unmodified', () => {
    const myState = {
      ...state,
      selection: {
        from: getIndex(value, 3, 2),
        to: getIndex(value, 3, 2),
      },
    };
    expect(reduce(myState, [{type: 'MOVE_DOWN'}])).toBe(myState);
  });
});

describe('MOVE_LEFT', () => {
  test('moves the cursor to the left', () => {
    expect(reduce(state, [{type: 'MOVE_LEFT'}])).toStrictEqual({
      value: 'one\ntwo\nthree',
      selection: {
        from: getIndex(value, 2, 1),
        to: getIndex(value, 2, 1),
      },
    });
  });

  test('if column === 1, moves the cursor to the end of the prev line', () => {
    const myState = {
      ...state,
      selection: {
        from: getIndex(value, 2, 1),
        to: getIndex(value, 2, 1),
      },
    };
    expect(reduce(myState, [{type: 'MOVE_LEFT'}])).toStrictEqual({
      ...state,
      selection: {
        from: getIndex(value, 1, 4),
        to: getIndex(value, 1, 4),
      },
    });
  });

  test('if column === 1 and line === 1 does not move cursor', () => {
    const myState = {
      ...state,
      selection: {
        from: getIndex(value, 1, 1),
        to: getIndex(value, 1, 1),
      },
    };
    expect(reduce(myState, [{type: 'MOVE_LEFT'}])).toBe(myState);
  });
});

describe('MOVE_RIGHT', () => {
  test('moves the cursor to the right', () => {
    expect(reduce(state, [{type: 'MOVE_RIGHT'}])).toStrictEqual({
      value: 'one\ntwo\nthree',
      selection: {
        from: getIndex(value, 2, 3),
        to: getIndex(value, 2, 3),
      },
    });
  });

  test('if column is last, moves the cursor to the start of the next line', () => {
    const myState = {
      ...state,
      selection: {
        from: getIndex(value, 2, 4),
        to: getIndex(value, 2, 4),
      },
    };
    expect(reduce(myState, [{type: 'MOVE_RIGHT'}])).toStrictEqual({
      ...state,
      selection: {
        from: getIndex(value, 3, 1),
        to: getIndex(value, 3, 1),
      },
    });
  });

  test('if column is last and line is last does not move cursor', () => {
    const myState = {
      ...state,
      selection: {
        from: getIndex(value, 3, 6),
        to: getIndex(value, 3, 6),
      },
    };
    expect(reduce(myState, [{type: 'MOVE_RIGHT'}])).toBe(myState);
  });
});

describe('DELETE_SELECTED', () => {
  test('from < to', () => {
    const myState: EditorState = {
      value: 'one\ntwo\nthree',
      selection: {
        from: getIndex(value, 3, 2),
        to: getIndex(value, 3, 5),
      },
    };

    expect(reduce(myState, [{type: 'DELETE_SELECTED'}])).toStrictEqual({
      value: 'one\ntwo\nte',
      selection: {
        from: getIndex(value, 3, 2),
        to: getIndex(value, 3, 2),
      },
    });
  });

  test('to > from', () => {
    const myState: EditorState = {
      value: 'one\ntwo\nthree',
      selection: {
        from: getIndex(value, 3, 5),
        to: getIndex(value, 3, 2),
      },
    };

    expect(reduce(myState, [{type: 'DELETE_SELECTED'}])).toStrictEqual({
      value: 'one\ntwo\nte',
      selection: {
        from: getIndex(value, 3, 2),
        to: getIndex(value, 3, 2),
      },
    });
  });

  test('from < to (multi-line)', () => {
    const myState: EditorState = {
      value: 'one\ntwo\nthree',
      selection: {
        from: getIndex(value, 2, 2),
        to: getIndex(value, 3, 5),
      },
    };

    expect(reduce(myState, [{type: 'DELETE_SELECTED'}])).toStrictEqual({
      value: 'one\nte',
      selection: {
        from: getIndex(value, 2, 2),
        to: getIndex(value, 2, 2),
      },
    });
  });

  test('from > to (multi-line)', () => {
    const myState: EditorState = {
      value: 'one\ntwo\nthree',
      selection: {
        from: getIndex(value, 3, 5),
        to: getIndex(value, 2, 2),
      },
    };

    expect(reduce(myState, [{type: 'DELETE_SELECTED'}])).toStrictEqual({
      value: 'one\nte',
      selection: {
        from: getIndex(value, 2, 2),
        to: getIndex(value, 2, 2),
      },
    });
  });
});

describe('BACKSPACE', () => {
  test('removes the character before the cursor, moves cursor left', () => {
    expect(reduce(state, [{type: 'BACKSPACE'}])).toStrictEqual({
      value: 'one\nwo\nthree',
      selection: {
        from: getIndex(value, 2, 1),
        to: getIndex(value, 2, 1),
      },
    });
  });

  test('if column is first, joins to prev line, moves cursor left', () => {
    expect(
      reduce(
        {
          ...state,
          selection: {
            from: getIndex(value, 2, 1),
            to: getIndex(value, 2, 1),
          },
        },
        [{type: 'BACKSPACE'}],
      ),
    ).toStrictEqual({
      value: 'onetwo\nthree',
      selection: {
        from: getIndex(value, 1, 4),
        to: getIndex(value, 1, 4),
      },
    });
  });
});

describe('TYPE', () => {
  test('inserts char to right of cursor, moves cursor right', () => {
    expect(reduce(state, [{type: 'TYPE', char: 'X'}])).toStrictEqual({
      value: 'one\ntXwo\nthree',
      selection: {
        from: getIndex(value, 2, 3),
        to: getIndex(value, 2, 3),
      },
    });
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
      reduce(
        {
          value: before,
          selection: {
            from: getIndex(before, 1, 1),
            to: getIndex(before, 1, 1),
          },
        },
        edits,
      ),
    ).toStrictEqual({
      value: after,
      selection: {
        from: getIndex(after, 1, 10),
        to: getIndex(after, 1, 10),
      },
    });
  });

  test('incremental changes: "a b c d e" => "c d e f g"', () => {
    let state = {
      value: 'a b c d e',
      selection: {
        from: getIndex('a b c d e', 1, 1),
        to: getIndex('a b c d e', 1, 1),
      },
    };
    state = reduce(state, [{type: 'MOVE_RIGHT', select: true}]);
    expect(state).toStrictEqual({
      value: 'a b c d e',
      selection: {
        from: getIndex('a b c d e', 1, 1),
        to: getIndex('a b c d e', 1, 2),
      },
    });
    state = reduce(state, [{type: 'MOVE_RIGHT', select: true}]);
    expect(state).toStrictEqual({
      value: 'a b c d e',
      selection: {
        from: getIndex('a b c d e', 1, 1),
        to: getIndex('a b c d e', 1, 3),
      },
    });
    state = reduce(state, [{type: 'MOVE_RIGHT', select: true}]);
    expect(state).toStrictEqual({
      value: 'a b c d e',
      selection: {
        from: getIndex('a b c d e', 1, 1),
        to: getIndex('a b c d e', 1, 4),
      },
    });
    state = reduce(state, [{type: 'MOVE_RIGHT', select: true}]);
    expect(state).toStrictEqual({
      value: 'a b c d e',
      selection: {
        from: getIndex('a b c d e', 1, 1),
        to: getIndex('a b c d e', 1, 5),
      },
    });
    state = reduce(state, [{type: 'DELETE_SELECTED'}]);
    expect(state).toStrictEqual({
      value: 'c d e',
      selection: {
        from: getIndex('c d e', 1, 1),
        to: getIndex('c d e', 1, 1),
      },
    });
    state = reduce(state, [{type: 'MOVE_RIGHT', select: false}]);
    expect(state).toStrictEqual({
      value: 'c d e',
      selection: {
        from: getIndex('c d e', 1, 2),
        to: getIndex('c d e', 1, 2),
      },
    });
    state = reduce(state, [{type: 'MOVE_RIGHT', select: false}]);
    expect(state).toStrictEqual({
      value: 'c d e',
      selection: {
        from: getIndex('c d e', 1, 3),
        to: getIndex('c d e', 1, 3),
      },
    });
    state = reduce(state, [{type: 'MOVE_RIGHT', select: false}]);
    expect(state).toStrictEqual({
      value: 'c d e',
      selection: {
        from: getIndex('c d e', 1, 4),
        to: getIndex('c d e', 1, 4),
      },
    });
    state = reduce(state, [{type: 'MOVE_RIGHT', select: false}]);
    expect(state).toStrictEqual({
      value: 'c d e',
      selection: {
        from: getIndex('c d e', 1, 5),
        to: getIndex('c d e', 1, 5),
      },
    });
    state = reduce(state, [{type: 'MOVE_RIGHT', select: false}]);
    expect(state).toStrictEqual({
      value: 'c d e',
      selection: {
        from: getIndex('c d e', 1, 6),
        to: getIndex('c d e', 1, 6),
      },
    });
    state = reduce(state, [{type: 'TYPE', char: ' '}]);
    expect(state).toStrictEqual({
      value: 'c d e ',
      selection: {
        from: getIndex('c d e ', 1, 7),
        to: getIndex('c d e ', 1, 7),
      },
    });
    state = reduce(state, [{type: 'TYPE', char: 'f'}]);
    expect(state).toStrictEqual({
      value: 'c d e f',
      selection: {
        from: getIndex('c d e f', 1, 8),
        to: getIndex('c d e f', 1, 8),
      },
    });
    state = reduce(state, [{type: 'TYPE', char: ' '}]);
    expect(state).toStrictEqual({
      value: 'c d e f ',
      selection: {
        from: getIndex('c d e f ', 1, 9),
        to: getIndex('c d e f ', 1, 9),
      },
    });
    state = reduce(state, [{type: 'TYPE', char: 'g'}]);
    expect(state).toStrictEqual({
      value: 'c d e f g',
      selection: {
        from: getIndex('c d e f g', 1, 10),
        to: getIndex('c d e f g', 1, 10),
      },
    });
  });

  test('incremental changes: "a b c↵d e f↵g h i" => "a b c↵d e f↵X h i"', () => {
    const startValue = 'a b c\nd e f\ng h i';
    const endValue = 'a b c\nd e f\nX h i';
    let state = {
      value: startValue,
      selection: {
        from: getIndex(startValue, 1, 6),
        to: getIndex(startValue, 1, 6),
      },
    };

    state = reduce(state, [{type: 'MOVE_DOWN', select: false}]);
    expect(state).toStrictEqual({
      value: 'a b c\nd e f\ng h i',
      selection: {
        from: getIndex('a b c\nd e f\ng h i', 2, 6),
        to: getIndex('a b c\nd e f\ng h i', 2, 6),
      },
    });
    state = reduce(state, [{type: 'MOVE_DOWN', select: false}]);
    expect(state).toStrictEqual({
      value: 'a b c\nd e f\ng h i',
      selection: {
        from: getIndex('a b c\nd e f\ng h i', 3, 6),
        to: getIndex('a b c\nd e f\ng h i', 3, 6),
      },
    });
    state = reduce(state, [{type: 'MOVE_LEFT', select: false}]);
    expect(state).toStrictEqual({
      value: 'a b c\nd e f\ng h i',
      selection: {
        from: getIndex('a b c\nd e f\ng h i', 3, 5),
        to: getIndex('a b c\nd e f\ng h i', 3, 5),
      },
    });
    state = reduce(state, [{type: 'MOVE_LEFT', select: false}]);
    expect(state).toStrictEqual({
      value: 'a b c\nd e f\ng h i',
      selection: {
        from: getIndex('a b c\nd e f\ng h i', 3, 4),
        to: getIndex('a b c\nd e f\ng h i', 3, 4),
      },
    });
    state = reduce(state, [{type: 'MOVE_LEFT', select: false}]);
    expect(state).toStrictEqual({
      value: 'a b c\nd e f\ng h i',
      selection: {
        from: getIndex('a b c\nd e f\ng h i', 3, 3),
        to: getIndex('a b c\nd e f\ng h i', 3, 3),
      },
    });
    state = reduce(state, [{type: 'MOVE_LEFT', select: false}]);
    expect(state).toStrictEqual({
      value: 'a b c\nd e f\ng h i',
      selection: {
        from: getIndex('a b c\nd e f\ng h i', 3, 2),
        to: getIndex('a b c\nd e f\ng h i', 3, 2),
      },
    });
    state = reduce(state, [{type: 'MOVE_LEFT', select: false}]);
    expect(state).toStrictEqual({
      value: 'a b c\nd e f\ng h i',
      selection: {
        from: getIndex('a b c\nd e f\ng h i', 3, 1),
        to: getIndex('a b c\nd e f\ng h i', 3, 1),
      },
    });
    state = reduce(state, [{type: 'MOVE_RIGHT', select: true}]);
    expect(state).toStrictEqual({
      value: 'a b c\nd e f\ng h i',
      selection: {
        from: getIndex('a b c\nd e f\ng h i', 3, 1),
        to: getIndex('a b c\nd e f\ng h i', 3, 2),
      },
    });
    state = reduce(state, [{type: 'DELETE_SELECTED'}]);
    expect(state).toStrictEqual({
      value: 'a b c\nd e f\n h i',
      selection: {
        from: getIndex('a b c\nd e f\n h i', 3, 1),
        to: getIndex('a b c\nd e f\n h i', 3, 1),
      },
    });
    state = reduce(state, [{type: 'TYPE', char: 'X'}]);
    expect(state).toStrictEqual({
      value: 'a b c\nd e f\nX h i',
      selection: {
        from: getIndex('a b c\nd e f\nX h i', 3, 2),
        to: getIndex('a b c\nd e f\nX h i', 3, 2),
      },
    });

    expect(state.value).toBe(endValue);
  });
});
