import React, {
  useRef,
  useState,
  ComponentType,
  ComponentProps,
  ReactElement,
  useCallback,
  ReactNode,
} from 'react';
import {StopIcon, PauseIcon, PlayIcon} from '@spudly/icons';

type Playable = {
  play: () => unknown;
  pause: () => unknown;
  readonly duration: number;
  currentTime: number;
  readonly ended: boolean;
  readonly paused: boolean;
};

type PlayableComponentType =
  | 'audio'
  | 'video'
  | (Playable & ComponentType<any>);

const formatTime = (elapsedSeconds: number) =>
  [Math.floor(elapsedSeconds / 60), elapsedSeconds % 60]
    .map(n => String(n).padStart(2, '0'))
    .join(':');

type Props<T extends PlayableComponentType> = {
  children: ReactElement<ComponentProps<T>, T>;
  render: (
    player: ReactElement<ComponentProps<T>>,
    controls: ReactNode,
  ) => ReactElement;
};

const MediaController = <T extends PlayableComponentType>({
  render,
  children,
}: Props<T>) => {
  const ref = useRef<Playable>(null);
  const [{paused, duration, currentTime}, setState] = useState({
    paused: false,
    duration: 0,
    currentTime: 0,
  });
  const playing = !paused && currentTime > 0;

  const sync = useCallback(() => {
    const player = ref.current!;
    setState({
      paused: player.paused,
      duration: player.duration,
      currentTime: player.currentTime,
    });
  }, []);

  return render(
    React.cloneElement<ComponentProps<T>>(React.Children.only(children), {
      ref,
      onDurationChange: sync,
      onEnded: sync,
      onPause: sync,
      onPlay: sync,
      onTimeUpdate: sync,
    } as ComponentProps<T>),
    <>
      <div style={{textAlign: 'center'}}>
        <button
          type="button"
          onClick={() => {
            // eslint-disable-next-line no-unused-expressions
            ref.current?.pause();
            ref.current!.currentTime = 0;
          }}
          disabled={!playing}
        >
          <StopIcon />
        </button>
        <button
          type="button"
          onClick={() => ref.current?.play()}
          disabled={playing}
        >
          <PlayIcon />
        </button>
        <button
          type="button"
          onClick={() => ref.current?.pause()}
          disabled={!playing}
        >
          <PauseIcon />
        </button>
      </div>
      <div style={{textAlign: 'center'}}>
        {formatTime(Math.round(currentTime))} /{' '}
        {formatTime(Math.round(duration))}
      </div>
      <div style={{textAlign: 'center'}}>
        <input
          type="range"
          min="0"
          max={Math.ceil(duration)}
          value={currentTime}
          onChange={e =>
            (ref.current!.currentTime = e.currentTarget.valueAsNumber)
          }
        />
      </div>
    </>,
  );
};

export default MediaController;
