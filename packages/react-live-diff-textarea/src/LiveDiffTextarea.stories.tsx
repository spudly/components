import React, {ComponentProps} from 'react';
import * as diff from 'diff';
import LiveDiffTextarea from './LiveDiffTextarea';

const marty = `Ronald Reagon, the actor? Then who's vice president, Jerry Lewis? I suppose Jane Wymann is the first lady. Uh, I think so. Shut your filthy mouth, I'm not that kind of girl. Ah. Whoa. Hey, don't I know you from somewhere?
Hey Dad, George, hey, you on the bike. That's a Florence Nightingale effect. It happens in hospitals when nurses fall in love with their patients. Go to it, kid. Erased from existence. Lorraine, are you up there? Quiet.
You're gonna break his arm. Biff, leave him alone. Let him go. Let him go. Well, they're bigger than me. I don't wanna see you in here again. Ah. Whoa. No.`;

const asPirate = `Ronald Reagon, th' actor? Then who's firs' mate, Jerry Lewis? I suppose Jane Wymann be th' first beauty. Uh, I reckon so. Shut yer filthy mouth, I be nah that kind o' poppet. Sink me. Whoa. Ahoy, don't I know ye from somewhere?
Ahoy Dad, George, ahoy, ye on th' bike. That's a Florence Nightingale effect. It happens in hospitals when nurses fall in love wit' thar patients. Go t' it, sprog. Erased from existence. Lorraine, are ye up thar? Quiet.
Ye're gonna break his arm. Biff, leave 'im alone. Let 'im go. Let 'im go. Well, they be bigger than me. I don't wanna see ye in here again. Sink me. Whoa. No.`;

const asYoda = `Ronald reagon, the actor? Then who's vice president, jerry lewis? The first lady I suppose jane wymann is. Uh, so I think. Your filthy mouth shut, i'm not that kind of girl. Ah. Whoa. Hey, I know you from somewhere do not?
Hey dad, george, hey, you on the bike. That's a florence nightingale effect. In love with their patients it happens in hospitals when nurses fall. To it go, kid. Erased from existence. Lorraine, you up there are? Quiet. his arm
You're gonna break. Biff, him alone leave. Him go let. Him go let. Well, they're bigger than me. Wanna see you in here again I do not. Ah. Whoa. No.`;

const asPirateDiff = diff.createPatch('marty', marty, asPirate);
const asYodaDiff = diff.createPatch('marty', asPirate, asYoda);

const patches = [
  {name: 'asPirate', code: asPirateDiff},
  {name: 'asYoda', code: asYodaDiff},
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
      initialValue={marty}
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

export default {title: 'react-live-diff'};
