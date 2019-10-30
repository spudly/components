import {EditorState, EditAction, Position} from './types';
import getNumColumns from './getNumColumns';
import getNumLines from './getNumLines';
import removeCharBefore from './removeCharBefore';
import insertCharAfter from './insertCharAfter';
import getCharIndex from './getCharIndex';
import makePosition from './makePosition';

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

const reduceEditorState = (state: EditorState, actions: Array<EditAction>) =>
  actions.reduce((state, action) => {
    switch (action.type) {
      case 'MOVE_UP':
        return moveUp(state, action.select);
      case 'MOVE_DOWN':
        return moveDown(state, action.select);
      case 'MOVE_LEFT':
        return moveLeft(state, action.select);
      case 'MOVE_RIGHT':
        return moveRight(state, action.select);
      case 'BACKSPACE':
        return backspace(state);
      case 'TYPE':
        return type(state, action.char);
      case 'DELETE_SELECTED':
        return deleteSelection(state);
      default:
        throw new Error(`Unrecognized Action: ${(action as EditAction, type)}`);
    }
  }, state);

export default reduceEditorState;
