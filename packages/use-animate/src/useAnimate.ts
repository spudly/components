import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
} from 'react';

type AnimationEvents = {
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onDurationChange?: () => void;
  onTimeUpdate?: () => void;
};

const calcNewStartTime = (currentTime: number, playbackRate: number) => {
  if (currentTime === 0) {
    return Date.now();
  }

  return Date.now() - (currentTime / playbackRate) * 1000;
};

const useAnimate = (
  duration: number,
  currentTime: number,
  setCurrentTime: Dispatch<SetStateAction<number>>,
  playbackRate: number,
  {
    onDurationChange,
    onPlay,
    onPause,
    onEnded,
    onTimeUpdate,
  }: AnimationEvents = {},
) => {
  const [paused, setPaused] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);
  const ended = currentTime >= duration;

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    onDurationChange?.();
  }, [duration, onDurationChange]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    onTimeUpdate?.();
  }, [currentTime, onTimeUpdate]);

  useEffect(() => {
    if (paused) {
      // eslint-disable-next-line no-unused-expressions
      onPause?.();
    } else {
      // eslint-disable-next-line no-unused-expressions
      onPlay?.();
    }
  }, [onPause, onPlay, paused]);

  const prevPlaybackRateRef = useRef(playbackRate);
  useEffect(() => {
    setStartTime(calcNewStartTime(currentTime, playbackRate));
    prevPlaybackRateRef.current = playbackRate;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playbackRate]);

  useEffect(() => {
    let expired = paused;
    const effect = () => {
      if (!expired) {
        if (ended) {
          setPaused(true);
          // eslint-disable-next-line no-unused-expressions
          onEnded?.();
          return;
        }
        const timeElapsed = ((Date.now() - startTime!) / 1000) * playbackRate;
        setCurrentTime(Math.min(timeElapsed, duration));
        requestAnimationFrame(effect);
      }
    };
    effect();
    return () => void (expired = true);
  }, [
    startTime,
    paused,
    playbackRate,
    duration,
    ended,
    setCurrentTime,
    onEnded,
  ]);

  const play = useCallback(() => {
    setPaused(false);
    if (ended) {
      setStartTime(Date.now());
      setCurrentTime(0);
    } else {
      setStartTime(calcNewStartTime(currentTime, playbackRate));
    }
  }, [currentTime, ended, playbackRate, setCurrentTime]);

  const pause = useCallback(() => setPaused(true), []);

  const seek = useCallback(
    time => {
      setCurrentTime(time);
      setStartTime(calcNewStartTime(time, playbackRate));
    },
    [playbackRate, setCurrentTime],
  );

  return {paused, ended, playbackRate, play, pause, seek};
};

export {AnimationEvents};
export default useAnimate;
