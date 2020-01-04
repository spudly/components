import React, {ComponentProps, forwardRef, Ref} from 'react';
import {LiveProvider, LivePreview, LiveError} from 'react-live';
import AnimatedMonaco, {RenderApi} from '@spudly/animated-monaco';
// @ts-ignore
import Split from 'react-split';

type Props = {
  startValue: string;
  endValue: string;
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
      startValue,
      endValue,
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
  ) => (
    <AnimatedMonaco
      ref={ref}
      startValue={startValue}
      endValue={endValue}
      style={{minWidth: 0, overflow: 'hidden'}}
      options={monacoOptions}
      onDurationChange={onDurationChange}
      onEnded={onEnded}
      onPause={onPause}
      onPlay={onPlay}
      onTimeUpdate={onTimeUpdate}
      render={(editor, api) => (
        <>
          <style
            dangerouslySetInnerHTML={{
              __html: `
              .gutter {
                cursor: col-resize;
                background: white;
                opacity: 0;
                transition: 0.5s;
              }
              .gutter:hover {
                opacity: 0.1;
              }
            `,
            }}
          />
          <Split
            sizes={[50, 50]}
            direction="horizontal"
            style={{height: '100%', display: 'flex', flexDirection: 'row'}}
            gutterSize={20}
          >
            <div style={{height: '100%'}}>{editor}</div>
            <div>
              <LiveProvider {...reactLiveOptions} code={api.value}>
                <LiveError />
                <LivePreview />
              </LiveProvider>
            </div>
          </Split>
        </>
      )}
    />
  ),
);

AnimatedReactLive.displayName = 'AnimatedReactLive';

export {RenderApi};
export default AnimatedReactLive;
