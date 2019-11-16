/**
 * @jest-environment jsdom
 **/
import React, {useRef} from 'react';
import useSelectionRange from '@spudly/use-selection-range';
import {render, cleanup, fireEvent} from '@testing-library/react';
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
      <label>
        Code
        <textarea ref={textareaRef} value={api.value} readOnly />
      </label>
      <button type="button" onClick={() => api.setPatchIndex(1)}>
        next patch
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
      {/* <button type="button" onClick={api.setSpeed: (speed: number) => void; */}
      {/* <button type="button" onClick={api.seek: (elapsed: number) => void; */}
    </>
  );
};

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  (console.error as jest.MockedFunction<typeof console.error>).mockRestore();
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

test('setPatchIndex', () => {
  const {getByText, getByLabelText} = render(
    <AnimatedTextarea initialValue={hello} patches={patches} />,
  );
  fireEvent.click(getByText('next patch'));
  expect(getByLabelText('Code')).toHaveValue(whom);
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
