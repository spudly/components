import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';

const useAnimate = (
  duration: number,
  elapsed: number,
  seek: Dispatch<SetStateAction<number>>,
  baseSpeed: number = 1,
) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [speed, _setSpeed] = useState(100);
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
        seek(Math.min(timeElapsed * baseSpeed * (speed / 100), duration));
        requestAnimationFrame(effect);
      }
    };
    effect();
    return () => void (expired = true);
  }, [startTime, isPlaying, speed, duration, isFinished, seek, baseSpeed]);

  const play = useCallback(() => {
    setIsPlaying(true);
    setStartTime(Date.now());
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    seek(0);
  }, [seek]);

  const setSpeed = useCallback(
    (speed: number) => {
      const newTimeElapsed = elapsed / (speed / 100) / baseSpeed;
      const newStartTime = Date.now() - newTimeElapsed;
      setStartTime(newStartTime);
      _setSpeed(speed);
    },
    [baseSpeed, elapsed],
  );

  return {isPlaying, isFinished, speed, setSpeed, play, pause, stop};
};

export default useAnimate;
