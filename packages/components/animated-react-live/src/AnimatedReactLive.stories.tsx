import React from 'react';
import * as diff from 'diff';
import AnimatedReactLive from './AnimatedReactLive';

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

export const animatedLiveCode = () => {
  return (
    <div
      style={{
        height: '80vh',
        width: '80vw',
        margin: '0 auto',
      }}
    >
      <AnimatedReactLive
        initialValue={initialValue}
        patches={patches}
        monacoOptions={{
          language: 'javascript',
          theme: 'vs-dark',
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
    </div>
  );
};

export default {title: 'animated-react-live'};
