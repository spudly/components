import React from 'react';
import {Props} from './types';

const LastIcon = ({size = '1em', fill = 'currentColor', ...props}: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} {...props}>
    <path d="M0 19v-14l11 7-11 7zm11 0v-14l11 7-11 7zm13-13h-2v12h2v-12z" />
  </svg>
);

export default LastIcon;
