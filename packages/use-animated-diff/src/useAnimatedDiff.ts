import {useState, useMemo, useCallback} from 'react';
import useAnimate, {AnimationEvents} from '@spudly/use-animate';
import getActions from './getActions';
import {RenderApi, State} from './types';
import {reduce} from './reducer';

const BASE_PLAYBACK_RATE = 20;

const useAnimatedDiff = (
  startValue: string,
  endValue: string,
  events: AnimationEvents = {},
): RenderApi => {
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const initialState: State = {
    value: startValue,
    selectionStart: 0,
    selectionEnd: 0,
  };

  const editActions = useMemo(() => getActions(initialState, endValue), [
    initialState,
    endValue,
  ]);

  const editIndex = Math.min(
    Math.floor(currentTime * BASE_PLAYBACK_RATE),
    editActions.length,
  );

  const duration = editActions.length / BASE_PLAYBACK_RATE;

  const {paused, ended, play, pause, seek} = useAnimate(
    duration,
    currentTime,
    setCurrentTime,
    playbackRate,
    events,
  );

  const {value, selectionStart, selectionEnd} = useMemo(
    () => reduce(initialState, editActions.slice(0, editIndex)),
    [editActions, editIndex, initialState],
  );

  return {
    value,
    selectionStart,
    selectionEnd,
    paused,
    ended,
    setPlaybackRate,
    play,
    pause,
    duration,
    get currentTime() {
      return currentTime;
    },
    set currentTime(time) {
      seek(time);
    },
    get playbackRate() {
      return playbackRate;
    },
    set playbackRate(rate) {
      setPlaybackRate(rate);
    },
  };
};

export default useAnimatedDiff;
