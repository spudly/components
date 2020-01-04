import React, {useState} from 'react';
import * as icons from './index';

type IconName = keyof typeof icons;

const names: Array<IconName> = Object.keys(icons).sort() as any;
const sizes: Array<number> = [16, 32, 64, 128, 256];

export const Icons = () => {
  const [size, setSize] = useState(48);
  return (
    <>
      <input
        type="range"
        value={sizes.indexOf(size)}
        min={0}
        max={sizes.length - 1}
        step={1}
        onChange={e => setSize(sizes[e.currentTarget.valueAsNumber])}
      />
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {names.map(name => {
          const Icon = icons[name];
          return (
            <div style={{textAlign: 'center', width: size * 2}}>
              <div title={`<${name} />`}>
                <Icon
                  key={`${name}-${size}`}
                  size={`${size}px`}
                  style={{margin: '1em', background: '#ddd'}}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default {title: 'icons'};
