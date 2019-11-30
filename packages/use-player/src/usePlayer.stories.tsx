import React, {FunctionComponent} from 'react';
import usePlayer from './usePlayer';
// @ts-ignore
import bigBuckBunny from './media/big-buck-bunny.mp4';
// @ts-ignore
import cheer from './media/cheer.mp3';

export default {title: 'use-player'};

const formatTime = (seconds: number) =>
  [Math.round(seconds / 60), Math.round(seconds % 60)]
    .map(n => String(n).padStart(2, '0'))
    .join(':');

const DemoControls: FunctionComponent<{
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

export const AudioPlayer = () => {
  const {mediaProps, ...controlProps} = usePlayer<'audio', HTMLAudioElement>();
  return (
    <>
      <h1>Audio Player</h1>
      <audio {...mediaProps} src={cheer} />
      <DemoControls {...controlProps} />
    </>
  );
};

export const VideoPlayer = () => {
  const {mediaProps, ...controlProps} = usePlayer<'video', HTMLVideoElement>();
  return (
    <>
      <h1>Video Player</h1>
      <video {...mediaProps} src={bigBuckBunny} width="500" />
      <DemoControls {...controlProps} />
    </>
  );
};
