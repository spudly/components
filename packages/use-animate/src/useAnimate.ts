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

const calcNewStartTime = (
  currentTime: number,
  playbackRate: number,
  basePlaybackRate: number,
) => {
  const newCurrentTime = currentTime / (playbackRate / 100) / basePlaybackRate;
  return Date.now() - newCurrentTime;
};

const useAnimate = (
  duration: number,
  currentTime: number,
  seek: Dispatch<SetStateAction<number>>,
  basePlaybackRate: number = 1,
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
  const [playbackRate, _setPlaybackRate] = useState(100);
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
        seek(
          Math.min(
            timeElapsed * basePlaybackRate * (playbackRate / 100),
            duration,
          ),
        );
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
    seek,
    basePlaybackRate,
    onEnded,
  ]);

  const play = useCallback(() => {
    setPaused(false);
    setStartTime(calcNewStartTime(currentTime, playbackRate, basePlaybackRate));
  }, [basePlaybackRate, currentTime, playbackRate]);

  const pause = useCallback(() => {
    setPaused(true);
  }, []);

  const setPlaybackRate = useCallback(
    (newSpeed: number) => {
      setStartTime(calcNewStartTime(currentTime, newSpeed, basePlaybackRate));
      _setPlaybackRate(newSpeed);
    },
    [basePlaybackRate, currentTime],
  );

  return {paused, ended, playbackRate, setPlaybackRate, play, pause};
};

export {AnimationEvents};
export default useAnimate;
