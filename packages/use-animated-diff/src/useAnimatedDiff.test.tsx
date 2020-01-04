/**
 * @jest-environment jsdom
 **/
import React, {useRef} from 'react';
import useSelectionRange from '@spudly/use-selection-range';
import {render, cleanup, fireEvent, wait} from '@testing-library/react';
import useAnimatedDiff from './useAnimatedDiff';
import '@testing-library/jest-dom/extend-expect';

const hello = `import React from 'react';
import ReactDOM from 'react-dom';

const Hello = () => <p>Hello World!</p>;

const root = document.querySelector('#root');
ReactDOM.render(<Hello />, root);

export default React;`;

const greeting = `import React from 'react';
import ReactDOM from 'react-dom';

const Hello = ({greeting, whom}) => <p>{greeting} {whom}!</p>;

const root = document.querySelector('#root');
ReactDOM.render(<Hello greeting="Greetings," whom="Earthlings" />, root);

export default React;`;

const AnimatedTextarea = ({
  startValue,
  endValue,
}: {
  startValue: string;
  endValue: string;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const api = useAnimatedDiff(startValue, endValue);
  useSelectionRange(textareaRef, api.selectionStart, api.selectionEnd);
  return (
    <>
      <div data-testid="paused">{String(api.paused)}</div>
      <label>
        Code
        <textarea
          ref={textareaRef}
          value={api.value}
          onChange={e => {
            // eslint-disable-next-line no-unused-expressions
            api.onChange?.(
              e.currentTarget.value,
              e.currentTarget.selectionStart,
              e.currentTarget.selectionEnd,
            );
          }}
        />
      </label>
      <button type="button" onClick={api.play}>
        play
      </button>
      <button type="button" onClick={api.pause}>
        pause
      </button>
      <label>
        Playback Rate
        <input
          type="number"
          value={api.playbackRate}
          onChange={e => api.setPlaybackRate(Number(e.currentTarget.value))}
        />
      </label>
      {/* <button type="button" onClick={api.seek: (elapsed: number) => void; */}
    </>
  );
};

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  // (console.error as jest.MockedFunction<typeof console.error>).mockRestore();
  cleanup();
});

test('renders w/ initial value', () => {
  const {getByLabelText} = render(
    <AnimatedTextarea startValue={hello} endValue={greeting} />,
  );
  expect(getByLabelText('Code')).toHaveValue(hello);
});

test('plays', async () => {
  const {getByTestId, getByLabelText, getByText} = render(
    <AnimatedTextarea startValue={hello} endValue={greeting} />,
  );
  const code = getByLabelText('Code') as HTMLTextAreaElement;
  expect(code).toHaveValue(hello);
  fireEvent.change(getByLabelText('Speed'), {target: {value: '1000'}});

  fireEvent.click(getByText('play'));
  expect(getByTestId('isPlaying')).toHaveTextContent('true');
  await new Promise(resolve => setTimeout(resolve, 1000));
  await wait(() => expect(getByTestId('isPlaying')).toHaveTextContent('false'));
  expect(code).toHaveValue(greeting);
});

test('setTrackIndex', () => {
  const {getByText, getByLabelText} = render(
    <AnimatedTextarea startValue={hello} endValue={greeting} />,
  );
  fireEvent.click(getByText('next patch'));
  expect(getByLabelText('Code')).toHaveValue(greeting);
});

test('setTrackIndex: resets changes if new trackIndex < old patch index, then plays to next patch', async () => {
  const {getByText, getByTestId, getByLabelText} = render(
    <AnimatedTextarea startValue={hello} endValue={greeting} />,
  );
  fireEvent.click(getByText('next patch'));
  fireEvent.change(getByLabelText('Code'), {
    target: {
      value: 'new value',
      selectionStart: 0,
      selectionEnd: 0,
    },
  });
  const code = getByLabelText('Code');
  expect(code).toHaveValue('new value');
  fireEvent.click(getByText('prev patch'));
  expect(code).toHaveValue(hello);
  fireEvent.change(getByLabelText('Speed'), {target: {value: '1000'}});
  fireEvent.click(getByText('play'));
  expect(getByTestId('isPlaying')).toHaveTextContent('true');
  await new Promise(resolve => setTimeout(resolve, 1000));
  await wait(() => expect(getByTestId('isPlaying')).toHaveTextContent('false'));
  expect(code).toHaveValue(greeting);
});

test('onChange (while playing ) pauses', async () => {
  const {getByTestId, getByLabelText, getByText} = render(
    <AnimatedTextarea startValue={hello} endValue={greeting} />,
  );
  const code = getByLabelText('Code') as HTMLTextAreaElement;
  expect(code).toHaveValue(hello);
  fireEvent.click(getByText('play'));
  await new Promise(resolve => setTimeout(resolve, 100));
  const newValue = `import React from 'react';
import ReactDOM from 'react-dom';
😂🥺🔥😍😊🥰👍🤔
const Hello = () => <p>Hello World!</p>;

const root = document.querySelector('#root');
ReactDOM.render(<Hello />, root);

export default React;`;
  code.selectionStart = code.selectionEnd = 69;
  fireEvent.change(getByLabelText('Code'), {
    target: {
      value: newValue,
      selectionStart: 69,
      selectionEnd: 69,
    },
  });
  expect(code).toHaveValue(newValue);
  expect(code).toHaveProperty('selectionStart', 69);
  expect(code).toHaveProperty('selectionEnd', 69);
  expect(getByTestId('isPlaying')).toHaveTextContent('false');
  fireEvent.change(getByLabelText('Speed'), {target: {value: '1000'}});
  fireEvent.click(getByText('play'));
  expect(getByTestId('isPlaying')).toHaveTextContent('true');
  await new Promise(resolve => setTimeout(resolve, 1000));
  await wait(() => expect(getByTestId('isPlaying')).toHaveTextContent('false'));
  expect(code).toHaveValue(greeting);
});
