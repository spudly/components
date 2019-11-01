import * as diff from 'diff';
import times from '@spudly/times';
import {EditAction, EditorState} from './types';
import {reduce} from './reducer';
import {getPosition} from './utils';

type EditsAndEditorState = {edits: Array<EditAction>; state: EditorState};

const processNewEdits = (
  edits: Array<EditAction>,
  newEdits: Array<EditAction>,
  state: EditorState,
): EditsAndEditorState => ({
  edits: [...edits, ...newEdits],
  state: reduce(state, newEdits),
});

const move = (
  {edits, state}: EditsAndEditorState,
  next: number,
  select: boolean = false,
) => {
  const newEdits: Array<EditAction> = [];

  const prevPosition = getPosition(state.value, state.selection.to);
  const nextPosition = getPosition(state.value, next);

  const lineDiff = Math.abs(prevPosition.line - nextPosition.line);
  newEdits.push(
    ...times(lineDiff, {
      type: nextPosition.line < prevPosition.line ? 'MOVE_UP' : 'MOVE_DOWN',
      select,
    } as EditAction),
  );
  const afterMovingLines = processNewEdits(edits, newEdits, state);
  const columnAfterMovingLines = getPosition(
    afterMovingLines.state.value,
    afterMovingLines.state.selection.from,
  ).column;
  const colDiff = Math.abs(columnAfterMovingLines - nextPosition.column);
  newEdits.push(
    ...times(colDiff, {
      type:
        nextPosition.column < columnAfterMovingLines
          ? 'MOVE_LEFT'
          : 'MOVE_RIGHT',
      select,
    } as EditAction),
  );
  const nextResult = processNewEdits(edits, newEdits, state);
  return nextResult;
};

const add = (
  {edits, state}: EditsAndEditorState,
  {value}: diff.Change,
): EditsAndEditorState =>
  processNewEdits(
    edits,
    value.split('').map(char => ({type: 'TYPE', char} as EditAction)),
    state,
  );

const remove = (
  editsAndEditorState: EditsAndEditorState,
  {value}: diff.Change,
): EditsAndEditorState => {
  // move to end of stuff we want to delete
  const movedEditsAndEditorState = move(
    editsAndEditorState,
    editsAndEditorState.state.selection.to + value.length,
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
  const {edits} = changes.reduce(
    (editsAndEditorState, change, changeIndex) => {
      if (editsAndEditorState.state.value === endValue) {
        // we're done. no need to look at the other changes
        return editsAndEditorState;
      }
      let next = editsAndEditorState;
      if (changeIndex === 0 && (change.added || change.removed)) {
        next = move(editsAndEditorState, 0);
      }
      if (change.added) {
        return add(next, change);
      }
      if (change.removed) {
        return remove(next, change);
      }
      return move(
        next,
        (changeIndex === 0 ? 0 : next.state.selection.to) + change.value.length,
      );
    },
    {edits: [], state: initialState} as EditsAndEditorState,
  );
  return edits;
};

export default getEdits;
