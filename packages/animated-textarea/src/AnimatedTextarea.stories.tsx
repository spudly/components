import React from 'react';
import AnimatedTextarea, {RenderApi} from './AnimatedTextarea';
import Player from '@spudly/player';
import usePlayer from '@spudly/use-player';

const hello = `import React from 'react';
import ReactDOM from 'react-dom';

const Hello = () => <p>Hello World!</p>;

const root = document.querySelector('#root');
ReactDOM.render(<Hello />, root);

export default React;`;

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

export const AnimatedTextareaDemo = () => {
  const {mediaProps, ...controlProps} = usePlayer<
    typeof AnimatedTextarea,
    RenderApi
  >();
  return (
    <Player
      {...controlProps}
      render={style => (
        <AnimatedTextarea
          {...mediaProps}
          startValue={hello}
          endValue={greeting}
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
