import {useState, useMemo, useCallback} from 'react';
import {parsePatch, applyPatch} from 'diff';
import useAnimate from '@spudly/use-animate';
import getEdits from './getActions';
import {RenderApi, State} from './types';
import {reduce} from './reducer';

const useAnimatedDiff = (
  initialValue: string = '',
  patches: Array<string>,
): RenderApi => {
  if (patches.length === 0) {
    throw new Error('You must provide at least one patch!');
  }

  const [patchIndex, _setPatchIndex] = useState(0);
  const [editIndex, setEditIndex] = useState(0);

  const patchNames = useMemo(
    () =>
      patches.map(
        (patch, index) => parsePatch(patch)[0].newFileName || String(index),
      ),
    [patches],
  );

  const [startValue, endValue] = useMemo(() => {
    const startValue = patches
      .slice(0, patchIndex)
      .reduce((value, patch) => applyPatch(value, patch), initialValue);
    const endValue = applyPatch(startValue, patches[patchIndex]);
    return [startValue, endValue];
  }, [initialValue, patches, patchIndex]);

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

  const setPatchIndex = useCallback((index: number) => {
    _setPatchIndex(index);
    setEditIndex(0);
  }, []);

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
    setPatchIndex,
    patchNames,
    duration: editActions.length,
    elapsed: editIndex,
    seek: setEditIndex,
  };
};

export default useAnimatedDiff;
