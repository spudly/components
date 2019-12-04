import React, {CSSProperties, ReactElement} from 'react';
import Player from '@spudly/player';
import usePlayer from './usePlayer';
// @ts-ignore
import bigBuckBunny from './media/big-buck-bunny.mp4';
// @ts-ignore
import cheer from './media/cheer.mp3';

export default {title: 'use-player'};

export const AudioPlayer = () => {
  const {mediaProps, ...controlProps} = usePlayer<'audio', HTMLAudioElement>();
  return (
    <Player
      render={() => <audio {...mediaProps} src={cheer} />}
      {...controlProps}
    />
  );
};

export const VideoPlayer = () => {
  const {mediaProps, ...controlProps} = usePlayer<'video', HTMLVideoElement>();
  return (
    <Player
      render={(style: CSSProperties): ReactElement => (
        <video {...mediaProps} src={bigBuckBunny} style={style} />
      )}
      {...controlProps}
    />
  );
};
