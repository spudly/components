import {diffWordsWithSpace, Change} from 'diff';
import times from '@spudly/times';
import {Action, State} from './types';
import {reduce} from './reducer';
import {getPosition} from './utils';

type EditsAndState = {edits: Array<Action>; state: State};

const processNewEdits = (
  edits: Array<Action>,
  newEdits: Array<Action>,
  state: State,
): EditsAndState => ({
  edits: [...edits, ...newEdits],
  state: reduce(state, newEdits),
});

const move = (
  {edits, state}: EditsAndState,
  next: number,
  select: boolean = false,
) => {
  const newEdits: Array<Action> = [];

  const [prevLine] = getPosition(state.value, state.selectionEnd);
  const [nextLine, nextColumn] = getPosition(state.value, next);

  const lineDiff = Math.abs(prevLine - nextLine);
  newEdits.push(
    ...times(lineDiff, {
      type: nextLine < prevLine ? 'MOVE_UP' : 'MOVE_DOWN',
      select,
    } as Action),
  );
  const afterMovingLines = processNewEdits(edits, newEdits, state);
  const [, columnAfterMovingLines] = getPosition(
    afterMovingLines.state.value,
    afterMovingLines.state.selectionStart,
  );
  const colDiff = Math.abs(columnAfterMovingLines - nextColumn);
  newEdits.push(
    ...times(colDiff, {
      type: nextColumn < columnAfterMovingLines ? 'MOVE_LEFT' : 'MOVE_RIGHT',
      select,
    } as Action),
  );
  const nextResult = processNewEdits(edits, newEdits, state);
  return nextResult;
};

const add = ({edits, state}: EditsAndState, {value}: Change): EditsAndState =>
  processNewEdits(
    edits,
    value.split('').map(char => ({type: 'TYPE', char} as Action)),
    state,
  );

const remove = (
  editsAndState: EditsAndState,
  {value}: Change,
): EditsAndState => {
  // move to end of stuff we want to delete
  const movedEditsAndState = move(
    editsAndState,
    editsAndState.state.selectionEnd + value.length,
    true,
  );
  return processNewEdits(
    movedEditsAndState.edits,
    [{type: 'DELETE_SELECTED'}],
    movedEditsAndState.state,
  );
};

const getEdits = (initialState: State, endValue: string): Array<Action> => {
  const changes = diffWordsWithSpace(initialState.value, endValue);
  const {edits} = changes.reduce(
    (editsAndState, change, changeIndex) => {
      if (editsAndState.state.value === endValue) {
        // we're done. no need to look at the other changes
        return editsAndState;
      }
      let next = editsAndState;
      if (changeIndex === 0 && (change.added || change.removed)) {
        next = move(editsAndState, 0);
      }
      if (change.added) {
        return add(next, change);
      }
      if (change.removed) {
        return remove(next, change);
      }
      return move(
        next,
        (changeIndex === 0 ? 0 : next.state.selectionEnd) + change.value.length,
      );
    },
    {edits: [], state: initialState} as EditsAndState,
  );
  return edits;
};

export default getEdits;
