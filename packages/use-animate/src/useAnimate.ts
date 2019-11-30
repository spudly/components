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
};

const calcNewStartTime = (
  currentTime: number,
  speed: number,
  baseSpeed: number,
) => {
  const newCurrentTime = currentTime / (speed / 100) / baseSpeed;
  return Date.now() - newCurrentTime;
};

const useAnimate = (
  duration: number,
  currentTime: number,
  seek: Dispatch<SetStateAction<number>>,
  baseSpeed: number = 1,
  {onDurationChange, onPlay, onPause, onEnded}: AnimationEvents = {},
) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [speed, _setSpeed] = useState(100);
  const isFinished = currentTime >= duration;

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    onDurationChange?.();
  }, [duration, onDurationChange]);

  useEffect(() => {
    let expired = !isPlaying;
    const effect = () => {
      if (!expired) {
        if (isFinished) {
          setIsPlaying(false);
          // eslint-disable-next-line no-unused-expressions
          onEnded?.();
          return;
        }
        const timeElapsed = Date.now() - startTime!;
        seek(Math.min(timeElapsed * baseSpeed * (speed / 100), duration));
        requestAnimationFrame(effect);
      }
    };
    effect();
    return () => void (expired = true);
  }, [
    startTime,
    isPlaying,
    speed,
    duration,
    isFinished,
    seek,
    baseSpeed,
    onEnded,
  ]);

  const play = useCallback(() => {
    setIsPlaying(true);
    setStartTime(calcNewStartTime(currentTime, speed, baseSpeed));
    // eslint-disable-next-line no-unused-expressions
    onPlay?.();
  }, [baseSpeed, currentTime, onPlay, speed]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    // eslint-disable-next-line no-unused-expressions
    onPause?.();
  }, [onPause]);

  const setSpeed = useCallback(
    (newSpeed: number) => {
      setStartTime(calcNewStartTime(currentTime, newSpeed, baseSpeed));
      _setSpeed(newSpeed);
    },
    [baseSpeed, currentTime],
  );

  return {isPlaying, isFinished, speed, setSpeed, play, pause};
};

export {AnimationEvents};
export default useAnimate;
