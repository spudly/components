import * as diff from 'diff';
import times from './times';
import {EditAction, EditorState, Position} from './types';
import editorStateReducer from './editorStateReducer';

type EditsAndEditorState = {edits: Array<EditAction>; state: EditorState};

type EditsReducerFn = (
  {edits, state}: EditsAndEditorState,
  {value, added, removed}: diff.Change,
) => EditsAndEditorState;

const processNewEdits = (
  edits: Array<EditAction>,
  newEdits: Array<EditAction>,
  state: EditorState,
): EditsAndEditorState => ({
  edits: [...edits, ...newEdits],
  state: editorStateReducer(state, newEdits),
});

const getNextPosition = (startPosition: Position, addedText: string) =>
  [...addedText].reduce(({line, column}, char): Position => {
    if (char === '\n') {
      return {line: line + 1, column: 1};
    }
    return {line, column: column + 1};
  }, startPosition);

const move = (
  {edits, state}: EditsAndEditorState,
  to: Position,
  select: boolean = false,
) => {
  const from = state.selection.from;
  const newEdits: Array<EditAction> = [];

  const lineDiff = Math.abs(from.line - to.line);
  const colDiff = Math.abs(from.column - to.column);
  newEdits.push(
    ...times(lineDiff, {
      type: to.line < from.line ? 'MOVE_UP' : 'MOVE_DOWN',
      select,
    } as EditAction),
  );
  newEdits.push(
    ...times(colDiff, {
      type: to.column < from.column ? 'MOVE_LEFT' : 'MOVE_RIGHT',
      select,
    } as EditAction),
  );
  return processNewEdits(edits, newEdits, state);
};

const add: EditsReducerFn = ({edits, state}, {value}) =>
  processNewEdits(
    edits,
    value.split('').map(char => ({type: 'TYPE', char} as EditAction)),
    state,
  );

const remove: EditsReducerFn = (
  editsAndEditorState: EditsAndEditorState,
  {value}: diff.Change,
) => {
  // move to end of stuff we want to delete
  const movedEditsAndEditorState = move(
    editsAndEditorState,
    getNextPosition(editsAndEditorState.state.selection.to, value),
    true,
  );
  return processNewEdits(
    movedEditsAndEditorState.edits,
    [{type: 'DELETE_SELECTED'}],
    movedEditsAndEditorState.state,
  );
};

const getEdits = (
  initialState: EditorState,
  endValue: string,
): Array<EditAction> => {
  const changes = diff.diffWordsWithSpace(initialState.value, endValue);
  changes.unshift();
  if (changes[0].added || changes[0].removed) {
    // first chars are changing, so inject a empty change first,
    // which makes it move to 1,1 before executing the changes
    changes.unshift({value: ''});
  }
  const {edits} = changes.reduce(
    (editsAndEditorState, change, changeIndex) => {
      if (editsAndEditorState.state.value === endValue) {
        // we're done. no need to look at the other changes
        return editsAndEditorState;
      }
      if (change.added) {
        return add(editsAndEditorState, change);
      }
      if (change.removed) {
        return remove(editsAndEditorState, change);
      }
      const nextPosition = getNextPosition(
        changeIndex === 0
          ? {line: 1, column: 1}
          : editsAndEditorState.state.selection.to,
        change.value,
      );
      return move(editsAndEditorState, nextPosition);
    },
    {edits: [], state: initialState} as EditsAndEditorState,
  );
  return edits;
};

export default getEdits;
