import React from 'react';
import {Props} from './types';

const FastForwardIcon = ({
  size = '1em',
  fill = 'currentColor',
  ...props
}: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} {...props}>
    <path d="M4,18l8.5-6L4,6V18z M13,6v12l8.5-6L13,6z" />
  </svg>
);

export default FastForwardIcon;
