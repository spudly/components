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
  readonly ended: boolean;
  readonly paused: boolean;
  currentTime: number;
  playbackRate: number;
};

type PlayerApi<T extends ElementType> = {
  mediaProps: Partial<ComponentPropsWithRef<T>>;
  currentTime: number;
  duration: number;
  paused: boolean;
  play: () => unknown;
  pause: () => unknown;
  ended: boolean;
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  seek: (time: number) => void;
};

// TODO: move this into a separate package
const useRaf = (fn: () => void, condition: boolean) => {
  useEffect(() => {
    if (condition) {
      let stop = false;
      const handleFrame = () => {
        if (!stop) {
          fn();
          requestAnimationFrame(handleFrame);
        }
      };
      requestAnimationFrame(handleFrame);
      return () => {
        stop = true;
      };
    }
  }, [fn, condition]);
};

const usePlayer = <
  COMP extends ElementType,
  PLAYABLE extends Playable
>(): PlayerApi<COMP> => {
  const ref = useRef<PLAYABLE | null>(null);
  const [
    {paused, currentTime, ended, duration, playbackRate},
    setState,
  ] = useState({
    paused: true,
    currentTime: 0,
    ended: false,
    duration: 0,
    playbackRate: 1,
  });

  const updateState = useCallback(() => {
    const api = ref.current;
    if (api) {
      const {paused, currentTime, ended, duration, playbackRate} = api;
      setState({
        paused,
        currentTime,
        ended,
        duration,
        playbackRate,
      });
    }
  }, []);

  useRaf(updateState, !paused);

  const play = useCallback(() => {
    // eslint-disable-next-line no-unused-expressions
    ref.current?.play();
  }, []);

  const pause = useCallback(() => ref.current?.pause(), []);
  const seek = useCallback(time => {
    if (ref.current) {
      ref.current.currentTime = time;
    }
  }, []);
  const setPlaybackRate = useCallback(rate => {
    if (ref.current) {
      ref.current.playbackRate = rate;
    }
  }, []);

  const mediaProps: Partial<ComponentPropsWithRef<COMP>> = useMemo(() => {
    return {
      ref,
      onDurationChange: updateState,
      onEnded: updateState,
      onPause: updateState,
      onPlay: updateState,
      onTimeUpdate: updateState,
    };
  }, [updateState]);

  return {
    mediaProps,
    currentTime,
    seek,
    duration,
    paused,
    play,
    pause,
    ended,
    playbackRate,
    setPlaybackRate,
  };
};

export {Playable, PlayerApi};
export default usePlayer;
