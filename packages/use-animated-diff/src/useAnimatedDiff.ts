import {useState, useMemo, useCallback} from 'react';
import {parsePatch, applyPatch} from 'diff';
import useAnimate, {AnimationEvents} from '@spudly/use-animate';
import getActions from './getActions';
import {RenderApi, State} from './types';
import {reduce} from './reducer';

const useAnimatedDiff = (
  initialValue: string = '',
  patches: Array<string>,
  events: AnimationEvents = {},
): RenderApi => {
  if (patches.length === 0) {
    throw new Error('You must provide at least one patch!');
  }

  const [trackIndex, _setTrackIndex] = useState(0);
  const [editIndex, setEditIndex] = useState(0);
  const [dynamicState, setDynamicState] = useState<State | null>(null);
  const seek = useCallback(
    currentTime => setEditIndex(Math.floor(currentTime)),
    [],
  );

  const trackNames = useMemo(
    () =>
      patches.map(
        (patch, index) => parsePatch(patch)[0].newFileName || String(index),
      ),
    [patches],
  );

  const [startValue, endValue] = useMemo(() => {
    const startValue = patches
      .slice(0, trackIndex)
      .reduce((value, patch) => applyPatch(value, patch), initialValue);
    const endValue = applyPatch(startValue, patches[trackIndex]);
    return [startValue, endValue];
  }, [initialValue, patches, trackIndex]);

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

  const setTrackIndex = useCallback(
    (index: number) => {
      _setTrackIndex(index);
      if (index < trackIndex) {
        setDynamicState(null);
      }
      seek(0);
    },
    [trackIndex, seek],
  );

  const onEnded = useCallback(() => {
    if (trackIndex < patches.length - 1) {
      setTrackIndex(trackIndex + 1);
      setDynamicState(null);
    }
    // eslint-disable-next-line no-unused-expressions
    events.onEnded?.();
  }, [events.onEnded, trackIndex, patches.length, setTrackIndex]);

  const {
    paused,
    ended,
    playbackRate,
    setPlaybackRate,
    play,
    pause,
  } = useAnimate(editActions.length, editIndex, seek, 0.02, {
    ...events,
    onEnded,
  });

  const handleChange = useCallback(
    (value, selectionStart, selectionEnd) => {
      if (!paused) {
        pause();
      }
      seek(0);
      setDynamicState({value, selectionStart, selectionEnd});
    },
    [pause, paused, seek],
  );

  return {
    value,
    selectionStart,
    selectionEnd,
    paused,
    ended,
    playbackRate,
    setPlaybackRate,
    play,
    pause,
    trackIndex,
    setTrackIndex,
    trackNames,
    duration: editActions.length,
    get currentTime() {
      return editIndex;
    },
    set currentTime(time) {
      seek(time);
    },
    onChange: handleChange,
  };
};

export default useAnimatedDiff;
