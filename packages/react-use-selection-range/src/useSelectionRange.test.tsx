/**
 * @jest-environment jsdom
 */
import React, {useRef} from 'react';
import ReactDOM from 'react-dom';
import useSelectionRange from './useSelectionRange';
import sleep from '@spudly/sleep';

afterEach(() => {
  jest.restoreAllMocks();
});

const noop = () => {};

const Demo = ({start, end}: {start: number; end: number}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  useSelectionRange(ref, start, end);
  return <textarea ref={ref} value="012345678" onChange={noop} />;
};

test('sets the selection range of a textarea (none)', async () => {
  const spy = jest.spyOn(HTMLTextAreaElement.prototype, 'setSelectionRange');
  const div = document.createElement('div');
  await new Promise(resolve =>
    ReactDOM.render(<Demo start={4} end={4} />, div, resolve),
  );
  await sleep(100);
  expect(spy).toHaveBeenCalledWith(4, 4, 'none');
});

test('sets the selection range of a textarea (forward)', async () => {
  const spy = jest.spyOn(HTMLTextAreaElement.prototype, 'setSelectionRange');
  const div = document.createElement('div');
  await new Promise(resolve =>
    ReactDOM.render(<Demo start={4} end={6} />, div, resolve),
  );
  await sleep(100);
  expect(spy).toHaveBeenCalledWith(4, 6, 'forward');
});

test('sets the selection range of a textarea (backward)', async () => {
  const spy = jest.spyOn(HTMLTextAreaElement.prototype, 'setSelectionRange');
  const div = document.createElement('div');
  await new Promise(resolve =>
    ReactDOM.render(<Demo start={6} end={4} />, div, resolve),
  );
  await sleep(100);
  expect(spy).toHaveBeenCalledWith(6, 4, 'backward');
});
