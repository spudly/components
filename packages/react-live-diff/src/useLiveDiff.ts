import {useState, useEffect, useMemo, Dispatch, SetStateAction} from 'react';
import * as diff from 'diff';
import getEdits from './getEdits';
import {Patch, RenderApi, EditorState} from './types';
import editorStateReducer from './editorStateReducer';

const usePatches = (initialValue: string = '', patches: Array<Patch>) => {
  if (patches.length === 0) {
    throw new Error('You must provide at least one patch!');
  }
  const [patchIndex, setPatchIndex] = useState(0);
  const startValue = patches
    .slice(0, patchIndex)
    .reduce((value, patch) => diff.applyPatch(value, patch.code), initialValue);
  const endValue = diff.applyPatch(startValue, patches[patchIndex].code);
  return {
    patchIndex,
    patch: patches[patchIndex],
    setPatchIndex,
    startValue,
    endValue,
    isFirst: patchIndex === 0,
    isLast: patchIndex === patches.length - 1,
  };
};

const usePatch = (startValue: string, endValue: string) => {
  const [editIndex, setEditIndex] = useState(0);
  const editActions = useMemo(
    () =>
      getEdits(
        {
          value: startValue,
          selection: {from: {line: 1, column: 1}, to: {line: 1, column: 1}},
        },
        endValue,
      ),
    [startValue, endValue],
  );

  const {value, selection} = editorStateReducer(
    {
      value: startValue,
      selection: {from: {line: 1, column: 1}, to: {line: 1, column: 1}},
    } as EditorState,
    editActions.slice(0, editIndex),
  );

  return {value, selection, editActions, editIndex, setEditIndex};
};

const useAnimate = (
  duration: number,
  elapsed: number,
  seek: Dispatch<SetStateAction<number>>,
) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [speed, setSpeed] = useState(50);
  const isFinished = elapsed >= duration;

  useEffect(() => {
    let expired = !isPlaying;
    const effect = () => {
      if (!expired) {
        if (isFinished) {
          setIsPlaying(false);
          return;
        }
        const timeElapsed = Date.now() - startTime!;
        seek(Math.floor((timeElapsed / 25) * (speed / 100)));
        requestAnimationFrame(effect);
      }
    };
    effect();
    return () => void (expired = true);
  }, [startTime, isPlaying, speed, duration, isFinished, seek]);

  const play = () => {
    setIsPlaying(true);
    setStartTime(Date.now());
  };
  const pause = () => {
    setIsPlaying(false);
  };
  const stop = () => {
    setIsPlaying(false);
    seek(0);
  };

  return {isPlaying, isFinished, speed, setSpeed, play, pause, stop};
};

const useLiveDiff = (
  initialValue: string = '',
  patches: Array<Patch>,
): RenderApi => {
  const patchesApi = usePatches(initialValue, patches);
  const patchApi = usePatch(patchesApi.startValue, patchesApi.endValue);
  const duration = patchApi.editActions.length;
  const elapsed = patchApi.editIndex;
  const seek = patchApi.setEditIndex;
  const animateApi = useAnimate(duration, elapsed, seek);

  return {
    ...patchesApi,
    ...patchApi,
    ...animateApi,
    duration,
    elapsed,
    seek,
    first: () => {
      patchesApi.setPatchIndex(0);
      patchApi.setEditIndex(0);
    },
    prev: () => {
      patchesApi.setPatchIndex(Math.max(patchesApi.patchIndex - 1, 0));
      patchApi.setEditIndex(0);
    },
    next: () => {
      patchesApi.setPatchIndex(
        Math.min(patchesApi.patchIndex + 1, patches.length - 1),
      );
      patchApi.setEditIndex(0);
    },
    last: () => {
      patchesApi.setPatchIndex(patches.length - 1);
      patchApi.setEditIndex(0);
    },
  };
};

export default useLiveDiff;
