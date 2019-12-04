import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';

type AnimationEvents = {
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onDurationChange?: () => void;
  onTimeUpdate?: () => void;
};

const calcNewStartTime = (currentTime: number, playbackRate: number) => {
  const newCurrentTime = currentTime / playbackRate;
  return Date.now() - newCurrentTime;
};

const useAnimate = (
  duration: number,
  currentTime: number,
  seek: Dispatch<SetStateAction<number>>,
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

  useEffect(() => {
    setStartTime(calcNewStartTime(currentTime, playbackRate));
  }, [currentTime, playbackRate]);

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
        const timeElapsed = Date.now() - startTime!;
        seek(Math.min(timeElapsed * playbackRate, duration));
        requestAnimationFrame(effect);
      }
    };
    effect();
    return () => void (expired = true);
  }, [startTime, paused, playbackRate, duration, ended, seek, onEnded]);

  const play = useCallback(() => {
    setPaused(false);
    setStartTime(calcNewStartTime(currentTime, playbackRate));
  }, [currentTime, playbackRate]);

  const pause = useCallback(() => {
    setPaused(true);
  }, []);

  return {paused, ended, playbackRate, play, pause};
};

export {AnimationEvents};
export default useAnimate;
