import React from 'react';
import {Props} from './types';

const SkipNextIcon = ({
  size = '1em',
  fill = 'currentColor',
  ...props
}: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} {...props}>
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />{' '}
  </svg>
);

export default SkipNextIcon;
