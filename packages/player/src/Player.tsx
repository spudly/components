import React, {FunctionComponent, ReactElement, CSSProperties} from 'react';
import {
  PlayIcon,
  PauseIcon,
  SkipPreviousIcon,
  SkipNextIcon,
} from '@spudly/icons';

const formatTime = (seconds: number) =>
  [Math.round(seconds / 60), Math.round(seconds % 60)]
    .map(n => String(n).padStart(2, '0'))
    .join(':');

type Props = {
  currentTime: number;
  duration: number;
  paused: boolean;
  ended: boolean;
  playbackRate: number;
  seek: (to: number) => unknown;
  play: () => unknown;
  pause: () => unknown;
  setPlaybackRate: (playbackRate: number) => void;
  tracks?: Array<{name: string}>;
  trackIndex?: number;
  setTrackIndex?: (trackIndex: number) => void;
  render: (style: CSSProperties) => ReactElement;
  style?: CSSProperties;
};

const IconButton = (props: JSX.IntrinsicElements['button']) => (
  <button
    type="button"
    {...props}
    style={{
      ...props.style,
      marginRight: '1em',
      border: 0,
      background: 'none',
      color: 'white',
      cursor: 'pointer',
    }}
  />
);

const Player: FunctionComponent<Props> = ({
  currentTime,
  duration,
  paused,
  play,
  pause,
  tracks,
  trackIndex,
  setTrackIndex,
  playbackRate,
  setPlaybackRate,
  seek,
  render,
  style = {},
}) => (
  <div
    style={{
      background: 'black',
      border: '1px solid #555',
      color: 'white',
      width: 'max-content',
      maxWidth: '100%',
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}
  >
    <div style={{flexGrow: 1}}>
      {render({
        display: 'block',
        margin: '1em',
        maxWidth: 'calc(100% - 2em)',
      })}
    </div>
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: 'calc(100% - 2em)',
        margin: '1em',
      }}
    >
      {tracks && (
        <IconButton
          disabled={trackIndex === 0}
          onClick={() => setTrackIndex?.(Math.max((trackIndex || 0) - 1, 0))}
        >
          <SkipPreviousIcon size="1.5em" />
        </IconButton>
      )}
      <IconButton onClick={paused ? play : pause}>
        {paused ? <PlayIcon size="1.5em" /> : <PauseIcon size="1.5em" />}
      </IconButton>
      {tracks && (
        <IconButton
          disabled={trackIndex === tracks.length - 1}
          onClick={() =>
            setTrackIndex?.(Math.min((trackIndex || 0) + 1, tracks.length - 1))
          }
        >
          <SkipNextIcon size="1.5em" />
        </IconButton>
      )}
      <div style={{margin: '1em'}}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
      <input
        aria-label="Seek"
        type="range"
        min={0}
        step={0.001}
        max={duration}
        value={currentTime}
        onChange={e => seek(e.currentTarget.valueAsNumber)}
        style={{flexGrow: 1, marginLeft: '1em'}}
      />
      <IconButton
        onClick={() =>
          setPlaybackRate(playbackRate >= 4 ? 1 : playbackRate + 1)
        }
      >
        {playbackRate}x
      </IconButton>
    </div>
  </div>
);

export default Player;
