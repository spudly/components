import React, {ComponentProps} from 'react';
import LiveDiffTextarea from './LiveDiffTextarea';
// @ts-ignore
import initialValue from 'raw-loader!../fixtures/AudioPlayer.txt';
// @ts-ignore
import patch1 from 'raw-loader!../fixtures/AudioPlayer.withPresentationComponents.txt';

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
      <button type="button" onClick={api.play} disabled={api.isPlaying}>
        play
      </button>
      <button type="button" onClick={api.pause} disabled={!api.isPlaying}>
        pause
      </button>
      <button type="button" onClick={api.stop} disabled={!api.isPlaying}>
        stop
      </button>
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
      initialValue={initialValue}
      patches={[{name: 'do something', code: patch1}]}
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

export default {title: 'react-live-diff'};
