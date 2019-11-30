import React, {ComponentProps, useState, forwardRef, Ref} from 'react';
import {LiveProvider, LivePreview, LiveError} from 'react-live';
import AnimatedMonaco, {RenderApi} from '@spudly/animated-monaco';
// @ts-ignore
import SplitGrid from 'react-split-grid';
// import MediaController from './MediaController';

type Props = {
  initialValue: string;
  patches: Array<string>;
  monacoOptions: ComponentProps<typeof AnimatedMonaco>['options'];
  reactLiveOptions: Omit<ComponentProps<typeof LiveProvider>, 'ref'>;
  containerProps: any;
  onDurationChange?: () => void;
  onEnded?: () => void;
  onPause?: () => void;
  onPlay?: () => void;
  onTimeUpdate?: () => void;
};

const AnimatedReactLive = forwardRef(
  (
    {
      initialValue,
      patches,
      monacoOptions,
      reactLiveOptions,
      containerProps,
      onDurationChange,
      onEnded,
      onPause,
      onPlay,
      onTimeUpdate,
    }: Props,
    ref: Ref<RenderApi>,
  ) => {
    const [columns, setColumns] = useState('1fr 10px 1fr');

    return (
      <SplitGrid
        gridTemplateColumns={columns}
        onDrag={(_: any, __: any, columns: string) => setColumns(columns)}
        render={({getGridProps, getGutterProps}: any) => {
          const style = {
            ...containerProps.style,
            display: 'grid',
            gridTemplateColumns: columns,
            gridTemplateRows: '10fr 1fr',
          };
          return (
            <div {...getGridProps()} {...containerProps} style={style}>
              <AnimatedMonaco
                ref={ref}
                initialValue={initialValue}
                patches={patches}
                style={{minWidth: 0, overflow: 'hidden'}}
                options={monacoOptions}
                onDurationChange={onDurationChange}
                onEnded={onEnded}
                onPause={onPause}
                onPlay={onPlay}
                onTimeUpdate={onTimeUpdate}
                render={(editor, api) => (
                  <>
                    {editor}
                    <div
                      {...getGutterProps('column', 1)}
                      style={{
                        background: 'currentColor',
                        opacity: '0.5',
                        cursor: 'col-resize',
                      }}
                    />
                    <div>
                      <LiveProvider {...reactLiveOptions} code={api.value}>
                        <LiveError />
                        <LivePreview />
                      </LiveProvider>
                    </div>
                  </>
                )}
              />
            </div>
          );
        }}
      />
    );
  },
);

AnimatedReactLive.displayName = 'AnimatedReactLive';

export {RenderApi};
export default AnimatedReactLive;
