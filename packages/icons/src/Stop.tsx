import React from 'react';
import {Props} from './types';

const StopIcon = ({size = '1em', fill = 'currentColor', ...props}: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} {...props}>
    <path d="M6 6h12v12H6V6z" />
  </svg>
);

export default StopIcon;
