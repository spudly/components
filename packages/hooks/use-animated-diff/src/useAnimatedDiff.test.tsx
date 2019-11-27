/**
 * @jest-environment jsdom
 **/
import React, {useRef} from 'react';
import useSelectionRange from '@spudly/use-selection-range';
import {render, cleanup, fireEvent, wait} from '@testing-library/react';
import * as diff from 'diff';
import useAnimatedDiff from './useAnimatedDiff';
import '@testing-library/jest-dom/extend-expect';

const hello = `import React from 'react';
import ReactDOM from 'react-dom';

const Hello = () => <p>Hello World!</p>;

const root = document.querySelector('#root');
ReactDOM.render(<Hello />, root);

export default React;`;

const whom = `import React from 'react';
import ReactDOM from 'react-dom';

const Hello = ({whom}) => <p>Hello {whom}!</p>;

const root = document.querySelector('#root');
ReactDOM.render(<Hello whom="darkness, my old friend" />, root);

export default React;`;

const greeting = `import React from 'react';
import ReactDOM from 'react-dom';

const Hello = ({greeting, whom}) => <p>{greeting} {whom}!</p>;

const root = document.querySelector('#root');
ReactDOM.render(<Hello greeting="Greetings," whom="Earthlings" />, root);

export default React;`;

const patches = [
  diff.createPatch('whom', hello, whom),
  diff.createPatch('greeting', whom, greeting),
];

const AnimatedTextarea = ({
  initialValue,
  patches,
}: {
  initialValue?: string;
  patches: Array<string>;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const api = useAnimatedDiff(initialValue, patches);
  useSelectionRange(textareaRef, api.selectionStart, api.selectionEnd);
  return (
    <>
      <div data-testid="names">{api.patchNames.join(', ')}</div>
      <div data-testid="isPlaying">{String(api.isPlaying)}</div>
      <label>
        Code
        <textarea
          ref={textareaRef}
          value={api.value}
          onChange={e => {
            api.onChange(
              e.currentTarget.value,
              e.currentTarget.selectionStart,
              e.currentTarget.selectionEnd,
            );
          }}
        />
      </label>
      <button
        type="button"
        onClick={() => api.setPatchIndex(api.patchIndex + 1)}
      >
        next patch
      </button>
      <button
        type="button"
        onClick={() => api.setPatchIndex(api.patchIndex - 1)}
      >
        prev patch
      </button>
      <button type="button" onClick={api.play}>
        play
      </button>
      <button type="button" onClick={api.pause}>
        pause
      </button>
      <button type="button" onClick={api.stop}>
        stop
      </button>
      <label>
        Speed
        <input
          type="number"
          value={api.speed}
          onChange={e => api.setSpeed(Number(e.currentTarget.value))}
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
    <AnimatedTextarea initialValue={hello} patches={patches} />,
  );
  expect(getByLabelText('Code')).toHaveValue(hello);
});

test('if patches.length is 0, throws', () => {
  expect(() =>
    render(<AnimatedTextarea initialValue={hello} patches={[]} />),
  ).toThrow('You must provide at least one patch!');
});

test('plays through all the patches', async () => {
  const {getByTestId, getByLabelText, getByText} = render(
    <AnimatedTextarea initialValue={hello} patches={patches} />,
  );
  const code = getByLabelText('Code') as HTMLTextAreaElement;
  expect(code).toHaveValue(hello);
  fireEvent.change(getByLabelText('Speed'), {target: {value: '1000'}});

  fireEvent.click(getByText('play'));
  expect(getByTestId('isPlaying')).toHaveTextContent('true');
  await new Promise(resolve => setTimeout(resolve, 1000));
  await wait(() => expect(getByTestId('isPlaying')).toHaveTextContent('false'));
  expect(code).toHaveValue(whom);

  fireEvent.click(getByText('play'));
  expect(getByTestId('isPlaying')).toHaveTextContent('true');
  await new Promise(resolve => setTimeout(resolve, 1000));
  await wait(() => expect(getByTestId('isPlaying')).toHaveTextContent('false'));
  expect(code).toHaveValue(greeting);
});

test('setPatchIndex', () => {
  const {getByText, getByLabelText} = render(
    <AnimatedTextarea initialValue={hello} patches={patches} />,
  );
  fireEvent.click(getByText('next patch'));
  expect(getByLabelText('Code')).toHaveValue(whom);
});

test('setPatchIndex: resets changes if new patchIndex < old patch index, then plays to next patch', async () => {
  const {getByText, getByTestId, getByLabelText} = render(
    <AnimatedTextarea initialValue={hello} patches={patches} />,
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
  expect(code).toHaveValue(whom);
});

test('defaults initialValue to empty string', () => {
  const {getByLabelText} = render(
    <AnimatedTextarea patches={[diff.createPatch('to test', '', 'test')]} />,
  );
  expect(getByLabelText('Code')).toHaveValue('');
});

test('if patch filename is empty, uses index instead', () => {
  const {getByTestId} = render(
    <AnimatedTextarea
      patches={[
        diff.createPatch('', '', 'test'),
        diff.createPatch('', 'test', 'best'),
        diff.createPatch('', 'best', 'belt'),
      ]}
    />,
  );
  expect(getByTestId('names')).toHaveTextContent('0, 1, 2');
});

test('on change, then play, transforms user-edited code to next patch result', async () => {
  const {getByTestId, getByLabelText, getByText} = render(
    <AnimatedTextarea initialValue={hello} patches={patches} />,
  );
  const code = getByLabelText('Code') as HTMLTextAreaElement;
  expect(code).toHaveValue(hello);
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
  fireEvent.change(getByLabelText('Speed'), {target: {value: '1000'}});
  fireEvent.click(getByText('play'));
  expect(getByTestId('isPlaying')).toHaveTextContent('true');
  await new Promise(resolve => setTimeout(resolve, 1000));
  await wait(() => expect(getByTestId('isPlaying')).toHaveTextContent('false'));
  expect(code).toHaveValue(whom);
});

test('onChange (while playing ) pauses', async () => {
  const {getByTestId, getByLabelText, getByText} = render(
    <AnimatedTextarea initialValue={hello} patches={patches} />,
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
  expect(code).toHaveValue(whom);
});
