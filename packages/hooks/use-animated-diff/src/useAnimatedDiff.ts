import {useState, useMemo, useCallback} from 'react';
import {parsePatch, applyPatch} from 'diff';
import useAnimate from '@spudly/use-animate';
import getActions from './getActions';
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
  const [dynamicState, setDynamicState] = useState<State | null>(null);

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
    const initialState: State = dynamicState ?? {
      value: startValue,
      selectionStart: 0,
      selectionEnd: 0,
    };
    const actions = getActions(initialState, endValue);
    const state = reduce(initialState, actions.slice(0, editIndex));
    return [actions, state];
  }, [dynamicState, startValue, endValue, editIndex]);

  const setPatchIndex = useCallback(
    (index: number) => {
      _setPatchIndex(index);
      if (index < patchIndex) {
        setDynamicState(null);
      }
      setEditIndex(0);
    },
    [patchIndex],
  );

  const handleFinished = useCallback(() => {
    if (patchIndex < patches.length - 1) {
      setPatchIndex(patchIndex + 1);
    }
  }, [patchIndex, patches.length, setPatchIndex]);

  const {
    isPlaying,
    isFinished,
    speed,
    setSpeed,
    play,
    pause,
    stop,
  } = useAnimate(
    editActions.length,
    editIndex,
    setEditIndex,
    0.02,
    handleFinished,
  );

  const handleChange = useCallback(
    (value, selectionStart, selectionEnd) => {
      if (isPlaying) {
        pause();
      }
      setEditIndex(0);
      setDynamicState({value, selectionStart, selectionEnd});
    },
    [isPlaying, pause],
  );

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
    onChange: handleChange,
  };
};

export default useAnimatedDiff;
