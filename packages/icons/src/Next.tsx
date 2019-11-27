import React from 'react';
import {Props} from './types';

const NextIcon = ({size = '1em', fill = 'currentColor', ...props}: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} {...props}>
    <path d="M0 19v-14l12 7-12 7zm12 0v-14l12 7-12 7z" />
  </svg>
);

export default NextIcon;
