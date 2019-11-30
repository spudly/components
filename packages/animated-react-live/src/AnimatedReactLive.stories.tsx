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
  isPlaying: boolean;
  play: () => unknown;
  pause: () => unknown;
}> = ({currentTime, duration, isPlaying, play, pause}) => (
  <>
    <button onClick={play} disabled={isPlaying}>
      play
    </button>
    <button onClick={pause} disabled={!isPlaying}>
      pause
    </button>
    {formatTime(currentTime)} / {formatTime(duration)}
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
