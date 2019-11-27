import React from 'react';
import {Props} from './types';

const PlayIcon = ({size = '1em', fill = 'currentColor', ...props}: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} {...props}>
    <path d="M2 24v-24l20 12-20 12z" />
  </svg>
);

export default PlayIcon;
