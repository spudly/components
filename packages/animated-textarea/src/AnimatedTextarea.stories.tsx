import React from 'react';
import * as diff from 'diff';
import AnimatedTextarea from './AnimatedTextarea';
import Player from '@spudly/player';
import usePlayer from '@spudly/use-player';

// const hello = `import React from 'react';
// import ReactDOM from 'react-dom';

// const Hello = () => <p>Hello World!</p>;

// const root = document.querySelector('#root');
// ReactDOM.render(<Hello />, root);

// export default React;`;

const hello = `a
bb

d`;

const whom = `a
bb

df`;

// const whom = `import React from 'react';
// import ReactDOM from 'react-dom';

// const Hello = ({whom}) => <p>Hello {whom}!</p>;

// const root = document.querySelector('#root');
// ReactDOM.render(<Hello whom="darkness, my old friend" />, root);

// export default React;`;

const greeting = `import React from 'react';
import ReactDOM from 'react-dom';

const Hello = ({greeting, whom}) => <p>{greeting} {whom}!</p>;

const root = document.querySelector('#root');
ReactDOM.render(<Hello greeting="Greetings," whom="Earthlings" />, root);

export default React;`;

const patches = [
  diff.createPatch('whom', hello, whom),
  diff.createPatch('greeting', whom, greeting),
];

export const animatedTextarea = () => {
  const {mediaProps, ...controlProps} = usePlayer<
    typeof AnimatedTextarea,
    HTMLVideoElement
  >();
  return (
    <Player
      {...controlProps}
      render={style => (
        <AnimatedTextarea
          initialValue={hello}
          patches={patches}
          style={{
            ...style,
            fontFamily: 'monospace',
            fontSize: 16,
            width: '80vw',
            height: '40vh',
            color: 'white',
            background: '#222',
            border: '1px solid #333',
          }}
        />
      )}
    />
  );
};

export default {title: 'animated-textarea'};
