import React from 'react';
import {Props} from './types';

const SkipPreviousIcon = ({
  size = '1em',
  fill = 'currentColor',
  ...props
}: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} {...props}>
    <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
  </svg>
);

export default SkipPreviousIcon;
