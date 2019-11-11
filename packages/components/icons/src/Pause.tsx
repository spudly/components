import React from 'react';
import {Props} from './types';

const PauseIcon = ({size = '1em', fill = 'currentColor', ...props}: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} {...props}>
    <path d="M10 24h-6v-24h6v24zm10-24h-6v24h6v-24z" />
  </svg>
);

export default PauseIcon;
