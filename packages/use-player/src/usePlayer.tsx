import {useRef, useCallback, useState, useEffect} from 'react';

type Playable = {
  readonly duration: number;
  pause: () => unknown;
  currentTime: number;
  play: () => unknown;
};

const usePlayer = <API extends Playable>() => {
  const ref = useRef<API>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [elapsed, seek] = useState(0);

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

  const play = useCallback(() => ref.current?.play(), []);

  const pause = useCallback(() => ref.current?.pause(), []);

  const getMediaProps = useCallback(
    () => ({
      ref,
      onDurationChange: () => setDuration(ref.current!.duration),
      onEnded: () => {
        setIsPlaying(false);
        seek(0);
      },
      onPause: () => setIsPlaying(false),
      onPlay: () => setIsPlaying(true),
    }),
    [],
  );

  return {
    getMediaProps,
    elapsed,
    seek,
    duration,
    isPlaying,
    play,
    pause,
  };
};

export default usePlayer;
