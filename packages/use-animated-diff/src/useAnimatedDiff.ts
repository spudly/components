import {useState, useMemo, useCallback} from 'react';
import {parsePatch, applyPatch} from 'diff';
import useAnimate, {AnimationEvents} from '@spudly/use-animate';
import getActions from './getActions';
import {RenderApi, State} from './types';
import {reduce} from './reducer';

const BASE_PLAYBACK_RATE = 0.02; // edit actions per millisecond

const useAnimatedDiff = (
  initialValue: string = '',
  patches: Array<string>,
  events: AnimationEvents = {},
): RenderApi => {
  if (patches.length === 0) {
    throw new Error('You must provide at least one patch!');
  }

  const [trackIndex, _setTrackIndex] = useState(0);
  const [dynamicState, setDynamicState] = useState<State | null>(null);
  const [currentTime, seek] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(100);

  const [startValue, endValue] = useMemo(() => {
    const startValue = patches
      .slice(0, trackIndex)
      .reduce((value, patch) => applyPatch(value, patch), initialValue);
    const endValue = applyPatch(startValue, patches[trackIndex]);
    return [startValue, endValue];
  }, [initialValue, patches, trackIndex]);

  const initialState: State = dynamicState ?? {
    value: startValue,
    selectionStart: 0,
    selectionEnd: 0,
  };

  const editActions = useMemo(() => {
    const actions = getActions(initialState, endValue);
    return actions;
  }, [initialState, endValue]);

  const editIndex = Math.floor(
    currentTime * BASE_PLAYBACK_RATE * (playbackRate / 100),
  );

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

  const {paused, ended, play, pause} = useAnimate(
    editActions.length * BASE_PLAYBACK_RATE,
    currentTime,
    seek,
    BASE_PLAYBACK_RATE * playbackRate,
    {
      ...events,
      onEnded,
    },
  );

  const {value, selectionStart, selectionEnd} = useMemo(
    () => reduce(initialState, editActions.slice(0, editIndex)),
    [editActions, editIndex, initialState],
  );

  const trackNames = useMemo(
    () =>
      patches.map(
        (patch, index) => parsePatch(patch)[0].newFileName || String(index),
      ),
    [patches],
  );

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
