import {diffWordsWithSpace, Change} from 'diff';
import times from '@spudly/times';
import {Action, State} from './types';
import {reduce} from './reducer';
import {getPosition} from './utils';

type ActionsAndState = {actions: Array<Action>; state: State};

const processNewActions = (
  actions: Array<Action>,
  newActions: Array<Action>,
  state: State,
): ActionsAndState => ({
  actions: [...actions, ...newActions],
  state: reduce(state, newActions),
});

const move = (
  {actions, state}: ActionsAndState,
  next: number,
  select: boolean = false,
) => {
  const newActions: Array<Action> = [];

  const [prevLine] = getPosition(state.value, state.selectionEnd);
  const [nextLine, nextColumn] = getPosition(state.value, next);

  const lineDiff = Math.abs(prevLine - nextLine);
  newActions.push(
    ...times(lineDiff, {
      type: nextLine < prevLine ? 'MOVE_UP' : 'MOVE_DOWN',
      select,
    } as Action),
  );
  const afterMovingLines = processNewActions(actions, newActions, state);
  const [, columnAfterMovingLines] = getPosition(
    afterMovingLines.state.value,
    afterMovingLines.state.selectionEnd,
  );
  const colDiff = Math.abs(columnAfterMovingLines - nextColumn);
  newActions.push(
    ...times(colDiff, {
      type: nextColumn < columnAfterMovingLines ? 'MOVE_LEFT' : 'MOVE_RIGHT',
      select,
    } as Action),
  );
  const nextResult = processNewActions(actions, newActions, state);
  if (nextResult.state.selectionEnd !== next) {
    throw new Error(
      `expected nextResult to have position ${next} but got ${nextResult.state.selectionEnd}`,
    );
  }
  return nextResult;
};

const add = (
  {actions, state}: ActionsAndState,
  {value}: Change,
): ActionsAndState =>
  processNewActions(
    actions,
    value.split('').map(char => ({type: 'TYPE', char} as Action)),
    state,
  );

const remove = (
  ActionsAndState: ActionsAndState,
  {value}: Change,
): ActionsAndState => {
  // move to end of stuff we want to delete
  const movedActionsAndState = move(
    ActionsAndState,
    ActionsAndState.state.selectionEnd + value.length,
    true,
  );
  return processNewActions(
    movedActionsAndState.actions,
    [{type: 'DELETE_SELECTED'}],
    movedActionsAndState.state,
  );
};

const getActions = (initialState: State, endValue: string): Array<Action> => {
  const changes = diffWordsWithSpace(initialState.value, endValue);
  const {actions} = changes.reduce(
    (ActionsAndState, change, changeIndex) => {
      if (ActionsAndState.state.value === endValue) {
        // we're done. no need to look at the other changes
        return ActionsAndState;
      }
      let next = ActionsAndState;
      if (changeIndex === 0 && (change.added || change.removed)) {
        next = move(ActionsAndState, 0);
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
    {actions: [], state: initialState} as ActionsAndState,
  );
  return actions;
};

export default getActions;
