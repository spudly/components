import React, {FunctionComponent} from 'react';
import * as diff from 'diff';
import AnimatedReactLive, {RenderApi} from './AnimatedReactLive';
import usePlayer from '@spudly/use-player';

const hello = `const Hello = () => <p>Hello World!</p>;

render(<Hello />);`;

const whom = `const Hello = ({whom}) => <p>Hello {whom}!</p>;

render(<Hello whom="darkness, my old friend" />);`;

const greeting = `const Hello = ({greeting, whom}) => <p>{greeting} {whom}!</p>;

render(<Hello greeting="Greetings," whom="Earthlings" />);`;

const initialValue = hello;

const patches = [
  diff.createPatch('whom', hello, whom),
  diff.createPatch('greeting', whom, greeting),
];

const formatTime = (seconds: number) =>
  [Math.round(seconds / 60), Math.round(seconds % 60)]
    .map(n => String(n).padStart(2, '0'))
    .join(':');

const Controls: FunctionComponent<{
  currentTime: number;
  seek: (to: number) => unknown;
  duration: number;
  paused: boolean;
  play: () => unknown;
  pause: () => unknown;
  // ---
  // trackNames: Array<string>;
  // trackIndex: number;
  // setTrackIndex: (trackIndex: number) => void;
  ended: boolean;
  playbackRate: number;
  setPlaybackRate: (playbackRate: number) => void;
}> = ({
  currentTime,
  duration,
  paused,
  play,
  pause,
  // trackNames,
  // trackIndex,
  // setTrackIndex,
  ended,
  playbackRate,
  setPlaybackRate,
  seek,
}) => (
  <>
    <button onClick={play} disabled={!paused}>
      play
    </button>
    <button onClick={pause} disabled={paused}>
      pause
    </button>
    {formatTime(currentTime)} / {formatTime(duration)}
    {/* <select
      size={patches.length}
      value={trackIndex}
      onChange={e => setTrackIndex(Number(e.currentTarget.value))}
    >
      {trackNames.map((name, index) => (
        <option key={name} value={index}>
          {name}
        </option>
      ))}
    </select> */}
    <label>
      Playback Rate{' '}
      <input
        type="range"
        min={1}
        step={1}
        max={100}
        value={playbackRate}
        onChange={e => setPlaybackRate(e.currentTarget.valueAsNumber)}
      />
    </label>
    <label>
      Seek{' '}
      <input
        type="range"
        min={0}
        step={1}
        max={duration}
        value={currentTime}
        onChange={e => seek(e.currentTarget.valueAsNumber)}
      />
    </label>
    {/* <button
      type="button"
      disabled={trackIndex === 0}
      onClick={() => setTrackIndex(0)}
    >
      First
    </button>
    <button
      type="button"
      disabled={trackIndex === 0}
      onClick={() => setTrackIndex(Math.max(trackIndex - 1, 0))}
    >
      Prev
    </button> */}
    {/* <button
      type="button"
      disabled={trackIndex === patches.length - 1}
      onClick={() =>
        setTrackIndex(Math.min(trackIndex + 1, patches.length - 1))
      }
    >
      Next
    </button>
    <button
      type="button"
      disabled={trackIndex === patches.length - 1}
      onClick={() => setTrackIndex(patches.length - 1)}
    >
      Last
    </button> */}
  </>
);

export const AnimatedReactLiveDemo: FunctionComponent<{}> = () => {
  const api = usePlayer<typeof AnimatedReactLive, RenderApi>();
  return (
    <div
      style={{
        height: '80vh',
        margin: 0,
        padding: 0,
      }}
    >
      <AnimatedReactLive
        {...api.mediaProps}
        initialValue={initialValue}
        patches={patches}
        monacoOptions={{
          language: 'javascript',
          theme: 'vs-light',
          automaticLayout: true,
        }}
        reactLiveOptions={{
          noInline: true,
          disabled: true,
          scope: {...React},
        }}
        containerProps={{
          style: {
            height: '100%',
          },
        }}
      />
      <Controls {...api} />
    </div>
  );
};

export default {title: 'animated-react-live'};
