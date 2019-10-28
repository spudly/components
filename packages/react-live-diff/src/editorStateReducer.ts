import {EditorState, EditAction, Position} from './types';
import getNumColumns from './getNumColumns';
import getNumLines from './getNumLines';
import removeCharBefore from './removeCharBefore';
import insertCharAfter from './insertCharAfter';
import getCharIndex from './getCharIndex';

const updatePosition = (
  state: EditorState,
  nextPosition: Position,
  selection?: boolean | undefined,
): EditorState => ({
  ...state,
  position: nextPosition,
  selection: selection
    ? {
        from: state.selection ? state.selection.from : state.position,
        to: nextPosition,
      }
    : null,
});

const moveUp = (
  state: EditorState,
  selection: boolean | undefined,
): EditorState => {
  const {
    position: {line, column},
  } = state;
  if (line <= 1) {
    return state;
  }
  const nextPosition: Position = {
    line: line - 1,
    column: column,
  };
  return updatePosition(state, nextPosition, selection);
};

const moveDown = (
  state: EditorState,
  selection: boolean | undefined,
): EditorState => {
  const {
    value,
    position: {line, column},
  } = state;
  const numLines = value.split('\n').length;
  if (line >= numLines) {
    return state;
  }
  const nextPosition = {
    line: line + 1,
    column,
  };
  return updatePosition(state, nextPosition, selection);
};

const moveLeft = (
  state: EditorState,
  selection: boolean | undefined,
): EditorState => {
  const {line, column} = state.position;
  if (column <= 1 && line <= 1) {
    return state;
  }
  if (column <= 1) {
    return updatePosition(
      state,
      {
        line: line - 1,
        column: getNumColumns(state.value, line - 1),
      },
      selection,
    );
  }
  return updatePosition(state, {line, column: column - 1}, selection);
};

const moveRight = (
  state: EditorState,
  selection: boolean | undefined,
): EditorState => {
  const {
    value,
    position: {line, column},
  } = state;
  const isLastLine = line >= getNumLines(value);
  const isLastColumn = column >= getNumColumns(value, line);
  if (isLastColumn && isLastLine) {
    return state;
  }
  if (isLastColumn) {
    return updatePosition(
      state,
      {
        line: line + 1,
        column: 1,
      },
      selection,
    );
  }
  return updatePosition(
    state,
    {
      line,
      column: column + 1,
    },
    selection,
  );
};

const backspace = (state: EditorState): EditorState => ({
  value: removeCharBefore(state.value, state.position),
  position: moveLeft(state, false).position,
  selection: null,
});

const type = (state: EditorState, char: string): EditorState => {
  const value = insertCharAfter(state.value, state.position, char);
  return {
    ...state,
    value,
    position: moveRight({...state, value}, false).position,
  };
};

const deleteSelectioned = ({value, selection}: EditorState): EditorState => {
  if (!selection) {
    throw new Error('no selection!?');
  }
  const {from, to} = selection;
  const fromIndex = getCharIndex(value, from);
  const toIndex = getCharIndex(value, to);
  return {
    value: `${value.slice(0, Math.min(fromIndex, toIndex))}${value.slice(
      Math.max(fromIndex, toIndex),
    )}`,
    position: fromIndex < toIndex ? from : to,
    selection: null,
  };
};

const reduceEditorState = (state: EditorState, actions: Array<EditAction>) =>
  actions.reduce((state, action) => {
    switch (action.type) {
      case 'MOVE_UP':
        return moveUp(state, action.selection);
      case 'MOVE_DOWN':
        return moveDown(state, action.selection);
      case 'MOVE_LEFT':
        return moveLeft(state, action.selection);
      case 'MOVE_RIGHT':
        return moveRight(state, action.selection);
      case 'BACKSPACE':
        return backspace(state);
      case 'TYPE':
        return type(state, action.char);
      case 'DELETE_SELECTED':
        return deleteSelectioned(state);
      default:
        throw new Error(`Unrecognized Action: ${(action as EditAction, type)}`);
    }
  }, state);

export default reduceEditorState;
