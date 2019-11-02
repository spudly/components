import {useState, useMemo, useCallback} from 'react';
import {parsePatch, applyPatch} from 'diff';
import useAnimate from '@spudly/use-animate';
import getEdits from './getActions';
import {RenderApi, State} from './types';
import {reduce} from './reducer';

const useLiveDiff = (
  initialValue: string = '',
  patches: Array<string>,
): RenderApi => {
  if (patches.length === 0) {
    throw new Error('You must provide at least one patch!');
  }

  const [patchIndex, setPatchIndex] = useState(0);
  const [editIndex, setEditIndex] = useState(0);

  const parsedPatches = useMemo(
    () => patches.map(patch => parsePatch(patch)[0]),
    [patches],
  );

  const [startValue, endValue] = useMemo(() => {
    const startValue = parsedPatches
      .slice(0, patchIndex)
      .reduce((value, patch) => applyPatch(value, patch), initialValue);
    const endValue = applyPatch(startValue, parsedPatches[patchIndex]);
    return [startValue, endValue];
  }, [initialValue, parsedPatches, patchIndex]);

  const [editActions, {value, selectionStart, selectionEnd}] = useMemo(() => {
    const initialState: State = {
      value: startValue,
      selectionStart: 0,
      selectionEnd: 0,
    };
    const actions = getEdits(initialState, endValue);
    const state = reduce(initialState, actions.slice(0, editIndex));
    return [actions, state];
  }, [startValue, endValue, editIndex]);

  const {
    isPlaying,
    isFinished,
    speed,
    setSpeed,
    play,
    pause,
    stop,
  } = useAnimate(editActions.length, editIndex, setEditIndex);

  const first = useCallback(() => {
    setPatchIndex(0);
    setEditIndex(0);
  }, []);

  const prev = useCallback(() => {
    setPatchIndex(index => Math.max(index - 1, 0));
    setEditIndex(0);
  }, []);

  const next = useCallback(() => {
    setPatchIndex(index => Math.min(index + 1, patches.length - 1));
    setEditIndex(0);
  }, [patches.length]);

  const last = useCallback(() => {
    setPatchIndex(patches.length - 1);
    setEditIndex(0);
  }, [patches.length]);

  return {
    value,
    selectionStart,
    selectionEnd,
    isPlaying,
    isFinished,
    speed,
    setSpeed,
    play,
    pause,
    stop,
    patchIndex,
    patch: parsedPatches[patchIndex],
    isFirst: patchIndex === 0,
    isLast: patchIndex === patches.length - 1,
    duration: editActions.length,
    elapsed: editIndex,
    seek: setEditIndex,
    first,
    prev,
    next,
    last,
  };
};

export default useLiveDiff;
