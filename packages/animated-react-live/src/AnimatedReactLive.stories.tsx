import React, {FunctionComponent, CSSProperties} from 'react';
import AnimatedReactLive, {RenderApi} from './AnimatedReactLive';
import usePlayer from '@spudly/use-player';
import Player from '@spudly/player';

const startValue = `const Hello = () => <p>Hello World!</p>;

render(<Hello />);`;

const endValue = `const Hello = ({greeting, whom}) => <p>{greeting} {whom}!</p>;

render(<Hello greeting="Greetings," whom="Earthlings" />);`;

export const AnimatedReactLiveDemo: FunctionComponent<{}> = () => {
  const {mediaProps, ...controlProps} = usePlayer<
    typeof AnimatedReactLive,
    RenderApi
  >();
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        body {
          margin: 0;
          height: 100vh;
        }
        #root {
          height: 100%;
        }
      `,
        }}
      />
      <Player
        {...controlProps}
        style={{width: '100%', height: '100%'} as CSSProperties}
        render={style => (
          <AnimatedReactLive
            {...mediaProps}
            startValue={startValue}
            endValue={endValue}
            monacoOptions={{
              language: 'javascript',
              theme: 'vs-dark',
              minimap: {enabled: false},
              formatOnType: true,
              showFoldingControls: 'always',
              wordWrap: 'on',
              wrappingIndent: 'deepIndent',
            }}
            reactLiveOptions={{
              noInline: true,
              disabled: true,
              scope: {...React},
            }}
            containerProps={{
              style: {
                height: '100%',
              },
            }}
          />
        )}
      />
    </>
  );
};

export default {title: 'animated-react-live'};
