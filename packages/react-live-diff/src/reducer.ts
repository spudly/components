import {EditorState, EditAction} from './types';
import {getNumColumns, getPosition, getIndex, getNumLines} from './utils';
import stringSplice from '@spudly/string-splice';

const updatePosition = (
  state: EditorState,
  nextIndex: number,
  select?: boolean | undefined,
): EditorState => ({
  ...state,
  selection: {
    from: select ? state.selection.from : nextIndex,
    to: nextIndex,
  },
});

const moveUp = (
  state: EditorState,
  select: boolean | undefined,
): EditorState => {
  const {line, column} = getPosition(state.value, state.selection.to);
  if (line <= 1) {
    return state;
  }
  const nextLine = line - 1;
  const nextColumn = Math.min(column, getNumColumns(state.value, nextLine));
  const nextIndex = getIndex(state.value, nextLine, nextColumn);
  return updatePosition(state, nextIndex, select);
};

const moveDown = (
  state: EditorState,
  select: boolean | undefined,
): EditorState => {
  const {line, column} = getPosition(state.value, state.selection.to);
  const numLines = getNumLines(state.value);
  if (line >= numLines) {
    return state;
  }
  const nextLine = line + 1;
  const nextColumn = Math.min(column, getNumColumns(state.value, nextLine));
  const nextIndex = getIndex(state.value, nextLine, nextColumn);
  return updatePosition(state, nextIndex, select);
};

const moveLeft = (
  state: EditorState,
  select: boolean | undefined,
): EditorState => {
  if (state.selection.to === 0) {
    return state;
  }
  return updatePosition(state, state.selection.to - 1, select);
};

const moveRight = (
  state: EditorState,
  select: boolean | undefined,
): EditorState => {
  if (state.selection.to >= state.value.length) {
    return state;
  }
  return updatePosition(state, state.selection.to + 1, select);
};

const backspace = (state: EditorState): EditorState => ({
  value: stringSplice(state.selection.to - 1, 1, '', state.value),
  selection: moveLeft(state, false).selection,
});

const type = (state: EditorState, char: string): EditorState => {
  const value = stringSplice(state.selection.to, 0, char, state.value);
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
  const firstIndex = Math.min(from, to);
  const lastIndex = Math.max(from, to);
  return {
    value: `${value.slice(0, firstIndex)}${value.slice(lastIndex)}`,
    selection: {from: firstIndex, to: firstIndex},
  };
};

const validateActionResult = (
  prevState: EditorState,
  nextState: EditorState,
  action: EditAction,
) => {
  const msg = `edit action (${action.type}) resulted in invalid state`;
  const {
    value: newValue,
    selection: {from: newFrom, to: newTo},
  } = nextState;
  if (
    [newValue, newFrom, newTo].some(
      value => value == null || (typeof value == 'number' && isNaN(value)),
    )
  ) {
    throw new Error(msg);
  }
  try {
    getPosition(newValue, newFrom);
    getPosition(newValue, newTo);
  } catch (error) {
    console.error(msg, {prevState, action, nextState});
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
