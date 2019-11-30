import {
  useRef,
  useCallback,
  useState,
  useEffect,
  ComponentPropsWithRef,
  ElementType,
  useMemo,
} from 'react';

type Playable = {
  readonly duration: number;
  readonly pause: () => unknown;
  readonly play: () => unknown;
  currentTime: number;
};

type PlayerApi<T extends ElementType> = {
  mediaProps: Partial<ComponentPropsWithRef<T>>;
  currentTime: number;
  seek: (to: number) => unknown;
  duration: number;
  isPlaying: boolean;
  play: () => unknown;
  pause: () => unknown;
};

const usePlayer = <
  T extends ElementType,
  R extends Playable
>(): PlayerApi<T> => {
  const ref = useRef<R | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, seek] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      let stop = false;
      const handleFrame = () => {
        if (stop) {
          return;
        }
        seek(ref.current!.currentTime);
        requestAnimationFrame(handleFrame);
      };
      requestAnimationFrame(handleFrame);
      return () => {
        stop = true;
      };
    }
  }, [isPlaying]);

  const play = useCallback(() => {
    // eslint-disable-next-line no-unused-expressions
    ref.current?.play();
  }, []);

  const pause = useCallback(() => ref.current?.pause(), []);

  const mediaProps: Partial<ComponentPropsWithRef<T>> = useMemo(() => {
    return {
      ref,
      onDurationChange: () => {
        setDuration(ref.current!.duration);
      },
      onEnded: () => {
        setIsPlaying(false);
        seek(0);
      },
      onPause: () => {
        setIsPlaying(false);
      },
      onPlay: () => {
        setIsPlaying(true);
      },
    };
  }, []);

  return {
    mediaProps,
    currentTime,
    seek,
    duration,
    isPlaying,
    play,
    pause,
  };
};

export {Playable, PlayerApi};
export default usePlayer;
