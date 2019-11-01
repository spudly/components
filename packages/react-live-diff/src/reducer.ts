import {EditorState, EditAction, Position} from './types';
import {
  getNumColumns,
  getNumLines,
  getCharIndex,
  insertCharAfter,
  makePosition,
  removeCharBefore,
} from './utils';

const updatePosition = (
  state: EditorState,
  nextPosition: Position,
  select?: boolean | undefined,
): EditorState => ({
  ...state,
  selection: {
    from: select ? state.selection.from : nextPosition,
    to: nextPosition,
  },
});

const moveUp = (
  state: EditorState,
  select: boolean | undefined,
): EditorState => {
  const {line, column} = state.selection.to;
  if (line <= 1) {
    return state;
  }
  const nextLine = line - 1;
  const nextColumn = Math.min(column, getNumColumns(state.value, nextLine));
  const nextPosition: Position = makePosition(state.value, {
    line: nextLine,
    column: nextColumn,
  });
  return updatePosition(state, nextPosition, select);
};

const moveDown = (
  state: EditorState,
  select: boolean | undefined,
): EditorState => {
  const {
    value,
    selection: {
      to: {line, column},
    },
  } = state;
  const numLines = value.split(/(?<=\n)/).length;
  if (line >= numLines) {
    return state;
  }
  const nextLine = line + 1;
  const nextColumn = Math.min(column, getNumColumns(state.value, nextLine));
  const nextPosition = makePosition(state.value, {
    line: nextLine,
    column: nextColumn,
  });
  return updatePosition(state, nextPosition, select);
};

const moveLeft = (
  state: EditorState,
  select: boolean | undefined,
): EditorState => {
  const {
    value,
    selection: {
      to: {index},
    },
  } = state;
  if (index === 0) {
    return state;
  }
  return updatePosition(
    state,
    makePosition(state.value, {index: index - 1}),
    select,
  );
};

const moveRight = (
  state: EditorState,
  select: boolean | undefined,
): EditorState => {
  const {
    value,
    selection: {
      to: {index},
    },
  } = state;
  if (index >= value.length) {
    return state;
  }
  return updatePosition(state, makePosition(value, {index: index + 1}), select);
};

const backspace = (state: EditorState): EditorState => ({
  value: removeCharBefore(state.value, state.selection.to),
  selection: moveLeft(state, false).selection,
});

const type = (state: EditorState, char: string): EditorState => {
  const value = insertCharAfter(state.value, state.selection.to, char);
  return {
    ...state,
    value,
    selection: moveRight({...state, value}, false).selection,
  };
};

const deleteSelection = ({value, selection}: EditorState): EditorState => {
  if (!selection) {
    throw new Error('no selection!?');
  }
  const {from, to} = selection;
  const fromIndex = getCharIndex(value, from.line, from.column);
  const toIndex = getCharIndex(value, to.line, to.column);
  const position = fromIndex < toIndex ? from : to;
  return {
    value: `${value.slice(0, Math.min(fromIndex, toIndex))}${value.slice(
      Math.max(fromIndex, toIndex),
    )}`,
    selection: {from: position, to: position},
  };
};

const validateActionResult = (
  {value, selection: {from, to}}: EditorState,
  {value: newValue, selection: {from: newFrom, to: newTo}}: EditorState,
  action: EditAction,
) => {
  const msg = `edit action (${action.type}) resulted in invalid state`;
  if (
    [
      newValue,
      newFrom.index,
      newFrom.line,
      newFrom.column,
      newFrom.index,
      newFrom.line,
      newFrom.column,
    ].some(value => value == null || (typeof value == 'number' && isNaN(value)))
  ) {
    throw new Error(msg);
  }
  try {
    makePosition(newValue, newFrom);
    makePosition(newValue, newTo);
  } catch (error) {
    throw new Error(msg);
  }
};

export const reducer = (state: EditorState, action: EditAction) => {
  let newState: EditorState;
  switch (action.type) {
    case 'MOVE_UP':
      newState = moveUp(state, action.select);
      break;
    case 'MOVE_DOWN':
      newState = moveDown(state, action.select);
      break;
    case 'MOVE_LEFT':
      newState = moveLeft(state, action.select);
      break;
    case 'MOVE_RIGHT':
      newState = moveRight(state, action.select);
      break;
    case 'BACKSPACE':
      newState = backspace(state);
      break;
    case 'TYPE':
      newState = type(state, action.char);
      break;
    case 'DELETE_SELECTED':
      newState = deleteSelection(state);
      break;
    default:
      throw new Error(`Unrecognized Action: ${(action as EditAction, type)}`);
  }
  validateActionResult(state, newState, action);
  return newState;
};

export const reduce = (state: EditorState, actions: Array<EditAction>) =>
  actions.reduce(reducer, state);
