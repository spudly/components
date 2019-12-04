import React, {
  FunctionComponent,
  useMemo,
  useRef,
  useCallback,
  useState,
} from 'react';
import Player from './Player';
// @ts-ignore
import bigBuckBunny from './media/big-buck-bunny.mp4';

const tracks = [
  {name: 'big buck bunny', src: bigBuckBunny},
  {
    name: 'other video',
    src: 'http://techslides.com/demos/sample-videos/small.mp4',
  },
];

export const PlayerDemo: FunctionComponent<{}> = () => {
  const ref = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState({
    currentTime: 0,
    duration: 0,
    paused: true,
    playbackRate: 1,
    ended: false,
  });
  const [trackIndex, setTrackIndex] = useState(0);

  const updateState = useCallback(() => {
    const media = ref.current;
    if (media) {
      setState({
        currentTime: media.currentTime,
        duration: media.duration,
        paused: media.paused,
        playbackRate: media.playbackRate,
        ended: media.ended,
      });
    }
  }, []);

  const events = useMemo(
    () => ({
      onDurationChange: updateState,
      onEnded: updateState,
      onPause: updateState,
      onPlay: updateState,
      onTimeUpdate: updateState,
      onRateChange: updateState,
    }),
    [updateState],
  );

  const actions = useMemo(
    () => ({
      play: () => {
        // eslint-disable-next-line no-unused-expressions
        ref.current?.play();
      },
      pause: () => {
        // eslint-disable-next-line no-unused-expressions
        ref.current?.pause();
      },
      setPlaybackRate: (rate: number) => {
        if (ref.current) {
          ref.current.playbackRate = rate;
        }
      },
      seek: (time: number) => {
        if (ref.current) {
          ref.current.currentTime = time;
        }
      },
    }),
    [],
  );

  return (
    <Player
      {...state}
      {...actions}
      tracks={tracks}
      trackIndex={trackIndex}
      setTrackIndex={setTrackIndex}
      render={style => (
        <video
          ref={ref}
          src={tracks[trackIndex].src}
          style={style}
          {...events}
        />
      )}
    />
  );
};

export default {title: 'player'};
