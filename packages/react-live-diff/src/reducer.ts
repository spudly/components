import {EditorState, EditAction} from './types';
import {getNumColumns, getPosition, getIndex, getNumLines} from './utils';
import stringSplice from '@spudly/string-splice';

const updatePosition = (
  state: EditorState,
  nextIndex: number,
  select?: boolean | undefined,
): EditorState => ({
  ...state,
  selectionStart: select ? state.selectionStart : nextIndex,
  selectionEnd: nextIndex,
});

const moveUp = (
  state: EditorState,
  select: boolean | undefined,
): EditorState => {
  const {line, column} = getPosition(state.value, state.selectionEnd);
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
  const {line, column} = getPosition(state.value, state.selectionEnd);
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
  if (state.selectionEnd === 0) {
    return state;
  }
  return updatePosition(state, state.selectionEnd - 1, select);
};

const moveRight = (
  state: EditorState,
  select: boolean | undefined,
): EditorState => {
  if (state.selectionEnd >= state.value.length) {
    return state;
  }
  return updatePosition(state, state.selectionEnd + 1, select);
};

const backspace = (state: EditorState): EditorState => {
  if (state.selectionEnd === 0) {
    throw new Error('nothing to delete');
  }
  const nextIndex = Math.max(state.selectionEnd - 1, 0);
  return {
    value: stringSplice(state.selectionEnd - 1, 1, '', state.value),
    selectionStart: nextIndex,
    selectionEnd: nextIndex,
  };
};

const type = (state: EditorState, char: string): EditorState => {
  const value = stringSplice(state.selectionEnd, 0, char, state.value);
  const nextIndex = state.selectionStart + 1;
  return {
    ...state,
    value,
    selectionStart: nextIndex,
    selectionEnd: nextIndex,
  };
};

const deleteSelection = ({
  value,
  selectionStart,
  selectionEnd,
}: EditorState): EditorState => {
  const firstIndex = Math.min(selectionStart, selectionEnd);
  const lastIndex = Math.max(selectionStart, selectionEnd);
  return {
    value: `${value.slice(0, firstIndex)}${value.slice(lastIndex)}`,
    selectionStart: firstIndex,
    selectionEnd: firstIndex,
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
    selectionStart: newSelectionStart,
    selectionEnd: newSelectionEnd,
  } = nextState;
  if (
    [newValue, newSelectionStart, newSelectionEnd].some(
      value => value == null || (typeof value == 'number' && isNaN(value)),
    )
  ) {
    throw new Error(msg);
  }
  try {
    getPosition(newValue, newSelectionStart);
    getPosition(newValue, newSelectionEnd);
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
