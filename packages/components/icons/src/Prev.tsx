import React from 'react';
import {Props} from './types';

const PrevIcon = ({size = '1em', fill = 'currentColor', ...props}: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} {...props}>
    <path d="M12 12l12-7v14l-12-7zm-12 0l12-7v14l-12-7z" />
  </svg>
);

export default PrevIcon;
