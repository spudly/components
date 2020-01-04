import React from 'react';
import * as diff from 'diff';
import AnimatedMonaco from './AnimatedMonaco';

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

// export const animatedMonaco = () => {
//   return (
//     <AnimatedMonaco
//       initialValue={initialValue}
//       patches={patches}
//       options={{
//         language: 'javascript',
//         theme: 'vs-dark',
//       }}
//       style={{
//         width: '80vw',
//         height: '300px',
//       }}
//       render={(editor, api) => {
//         const {
//           duration,
//           currentTime,
//           ended,
//           paused,
//           trackIndex,
//           trackNames,
//           pause,
//           play,
//           setTrackIndex,
//           setPlaybackRate,
//           playbackRate,
//         } = api;
//         return (
//           <div>
//             {editor}
//             <div>
//               <h1>{trackNames[trackIndex]}</h1>
//               <select
//                 size={patches.length}
//                 value={trackIndex}
//                 onChange={e => setTrackIndex(Number(e.currentTarget.value))}
//               >
//                 {trackNames.map((name, index) => (
//                   <option key={name} value={index}>
//                     {name}
//                   </option>
//                 ))}
//               </select>
//               <label>
//                 Speed{' '}
//                 <input
//                   type="range"
//                   min={0}
//                   step={1}
//                   max={100}
//                   value={playbackRate}
//                   onChange={e => setPlaybackRate(e.currentTarget.valueAsNumber)}
//                 />
//               </label>
//               <label>
//                 Seek{' '}
//                 <input
//                   type="range"
//                   min={0}
//                   step={1}
//                   max={duration}
//                   value={currentTime}
//                   onChange={e => {
//                     api.currentTime = e.currentTarget.valueAsNumber;
//                   }}
//                 />
//               </label>
//               <button
//                 type="button"
//                 disabled={trackIndex === 0}
//                 onClick={() => setTrackIndex(0)}
//               >
//                 First
//               </button>
//               <button
//                 type="button"
//                 disabled={trackIndex === 0}
//                 onClick={() => setTrackIndex(Math.max(trackIndex - 1, 0))}
//               >
//                 Prev
//               </button>
//               {ended ? (
//                 <>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       api.currentTime = 0;
//                     }}
//                   >
//                     restart
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <button
//                     type="button"
//                     onClick={play}
//                     disabled={!paused || ended}
//                   >
//                     play
//                   </button>
//                   <button type="button" onClick={pause} disabled={paused}>
//                     pause
//                   </button>
//                 </>
//               )}
//               <button
//                 type="button"
//                 disabled={trackIndex === patches.length - 1}
//                 onClick={() =>
//                   setTrackIndex(Math.min(trackIndex + 1, patches.length - 1))
//                 }
//               >
//                 Next
//               </button>
//               <button
//                 type="button"
//                 disabled={trackIndex === patches.length - 1}
//                 onClick={() => setTrackIndex(patches.length - 1)}
//               >
//                 Last
//               </button>
//             </div>
//           </div>
//         );
//       }}
//     />
//   );
// };

export default {title: 'animated-monaco'};
