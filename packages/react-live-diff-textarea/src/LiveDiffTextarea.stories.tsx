import React, {ComponentProps} from 'react';
import * as diff from 'diff';
import LiveDiffTextarea from './LiveDiffTextarea';

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

const patches = [
  {name: 'whom', code: diff.createPatch('hello', hello, whom)},
  {name: 'greeting', code: diff.createPatch('hello', whom, greeting)},
];

const render: ComponentProps<typeof LiveDiffTextarea>['render'] = (
  textarea,
  api,
) => (
  <div>
    {textarea}
    <div>
      <h1>{api.patch.name}</h1>
      <label>
        Speed{' '}
        <input
          type="range"
          min={0}
          step={1}
          max={100}
          value={api.speed}
          onChange={e => api.setSpeed(e.currentTarget.valueAsNumber)}
        />
      </label>
      <label>
        Seek{' '}
        <input
          type="range"
          min={0}
          step={1}
          max={api.duration}
          value={api.elapsed}
          onChange={e => api.seek(e.currentTarget.valueAsNumber)}
        />
      </label>
      <button type="button" disabled={api.isFirst} onClick={api.first}>
        First
      </button>
      <button type="button" disabled={api.isFirst} onClick={api.prev}>
        Prev
      </button>
      {api.isFinished ? (
        <>
          <button type="button" onClick={() => api.seek(0)}>
            restart
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={api.play}
            disabled={api.isPlaying || api.isFinished}
          >
            play
          </button>
          <button type="button" onClick={api.pause} disabled={!api.isPlaying}>
            pause
          </button>
          <button type="button" onClick={api.stop} disabled={!api.isPlaying}>
            stop
          </button>
        </>
      )}
      <button type="button" disabled={api.isLast} onClick={api.next}>
        Next
      </button>
      <button type="button" disabled={api.isLast} onClick={api.last}>
        Last
      </button>
    </div>
  </div>
);

export const liveDiffTextarea = () => {
  return (
    <LiveDiffTextarea
      initialValue={hello}
      patches={patches}
      style={{
        fontFamily: 'monospace',
        fontSize: 16,
        width: '80vw',
        height: '80vh',
      }}
      render={render}
    />
  );
};

export default {title: 'react-live-diff-textarea'};
