import React, {FunctionComponent} from 'react';
import usePlayer from './usePlayer';
import bigBuckBunny from './media/big-buck-bunny.mp4';
import cheer from './media/cheer.mp3';

export default {title: 'use-player'};

const formatTime = (seconds: number) =>
  [Math.round(seconds / 60), Math.round(seconds % 60)]
    .map(n => String(n).padStart(2, '0'))
    .join(':');

const DemoControls: FunctionComponent<{
  elapsed: number;
  seek: (to: number) => unknown;
  duration: number;
  isPlaying: boolean;
  play: () => unknown;
  pause: () => unknown;
}> = ({elapsed, seek, duration, isPlaying, play, pause}) => (
  <>
    <button onClick={play} disabled={isPlaying}>
      play
    </button>
    <button onClick={pause} disabled={!isPlaying}>
      pause
    </button>
    {formatTime(elapsed)} / {formatTime(duration)}
  </>
);

export const AudioPlayer = () => {
  const {getMediaProps, ...controlProps} = usePlayer<HTMLAudioElement>();
  return (
    <>
      <h1>Audio Player</h1>
      <audio {...getMediaProps()} src={cheer} />
      <DemoControls {...controlProps} />
    </>
  );
};

export const VideoPlayer = () => {
  const {getMediaProps, ...controlProps} = usePlayer<HTMLVideoElement>();
  return (
    <>
      <h1>Video Player</h1>
      <video {...getMediaProps()} src={bigBuckBunny} width="500" />
      <DemoControls {...controlProps} />
    </>
  );
};
