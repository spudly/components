import React from 'react';
import * as diff from 'diff';
import AnimatedTextarea from './AnimatedTextarea';

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
  return (
    <AnimatedTextarea
      initialValue={hello}
      patches={patches}
      style={{
        fontFamily: 'monospace',
        fontSize: 16,
        width: '80vw',
        height: '40vh',
      }}
      render={(
        textarea,
        {
          duration,
          elapsed,
          isFinished,
          isPlaying,
          patchIndex,
          patchNames,
          pause,
          play,
          seek,
          setPatchIndex,
          setSpeed,
          speed,
          stop,
        },
      ) => (
        <div>
          {textarea}
          <div>
            <h1>{patchNames[patchIndex]}</h1>
            <select
              size={patches.length}
              value={patchIndex}
              onChange={e => setPatchIndex(Number(e.currentTarget.value))}
            >
              {patchNames.map((name, index) => (
                <option key={name} value={index}>
                  {name}
                </option>
              ))}
            </select>
            <label>
              Speed{' '}
              <input
                type="range"
                min={1}
                step={1}
                max={100}
                value={speed}
                onChange={e => setSpeed(e.currentTarget.valueAsNumber)}
              />
            </label>
            <label>
              Seek{' '}
              <input
                type="range"
                min={0}
                step={1}
                max={duration}
                value={elapsed}
                onChange={e => seek(e.currentTarget.valueAsNumber)}
              />
            </label>
            <button
              type="button"
              disabled={patchIndex === 0}
              onClick={() => setPatchIndex(0)}
            >
              First
            </button>
            <button
              type="button"
              disabled={patchIndex === 0}
              onClick={() => setPatchIndex(Math.max(patchIndex - 1, 0))}
            >
              Prev
            </button>
            {isFinished ? (
              <>
                <button type="button" onClick={() => seek(0)}>
                  restart
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={play}
                  disabled={isPlaying || isFinished}
                >
                  play
                </button>
                <button type="button" onClick={pause} disabled={!isPlaying}>
                  pause
                </button>
                <button type="button" onClick={stop} disabled={!isPlaying}>
                  stop
                </button>
              </>
            )}
            <button
              type="button"
              disabled={patchIndex === patches.length - 1}
              onClick={() =>
                setPatchIndex(Math.min(patchIndex + 1, patches.length - 1))
              }
            >
              Next
            </button>
            <button
              type="button"
              disabled={patchIndex === patches.length - 1}
              onClick={() => setPatchIndex(patches.length - 1)}
            >
              Last
            </button>
          </div>
        </div>
      )}
    />
  );
};

export default {title: 'animated-textarea'};
