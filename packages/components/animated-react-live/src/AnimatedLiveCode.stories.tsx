import React from 'react';
import * as diff from 'diff';
import AnimatedLiveCode from './AnimatedLiveCode';

const hello = `import React from 'react';
import ReactDOM from 'react-dom';

const Hello = () => <p>Hello World!</p>;

const root = document.querySelector('#root');
ReactDOM.render(<Hello />, root);

export default React;`;

const whom = `import React from 'react';
import ReactDOM from 'react-dom';

const Hello = ({whom}) => <p>Hello {whom}!</p>;

const root = document.querySelector('#root');
ReactDOM.render(<Hello whom="darkness, my old friend" />, root);

export default React;`;

const greeting = `import React from 'react';
import ReactDOM from 'react-dom';

const Hello = ({greeting, whom}) => <p>{greeting} {whom}!</p>;

const root = document.querySelector('#root');
ReactDOM.render(<Hello greeting="Greetings," whom="Earthlings" />, root);

export default React;`;

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
      <AnimatedLiveCode
        initialValue={initialValue}
        patches={patches}
        monacoOptions={{
          language: 'javascript',
          theme: 'vs-dark',
          automaticLayout: true,
        }}
        reactLiveOptions={{}}
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
