import React from 'react';
import * as icons from './index';

type IconName = keyof typeof icons;

const names: Array<IconName> = Object.keys(icons).sort() as any;
const sizes: Array<number> = [16, 32, 64, 128, 256];

export const Icons = () => (
  <>
    {sizes.map(size => (
      <>
        <h1>Size: {size}px</h1>
        <div style={{display: 'flex'}}>
          {names.map(name => {
            const Icon = icons[name];
            return (
              <Icon
                key={`${name}-${size}`}
                size={`${size}px`}
                style={{margin: '1em', background: '#ddd'}}
              />
            );
          })}
        </div>
      </>
    ))}
  </>
);

export default {title: 'icons'};
