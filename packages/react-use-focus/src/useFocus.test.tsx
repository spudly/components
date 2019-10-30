/**
 * @jest-environment jsdom
 */
import React, {ReactElement, useRef, RefObject} from 'react';
import ReactDOM from 'react-dom';
import sleep from '@spudly/sleep';
import {Simulate, act} from 'react-dom/test-utils';
import useFocus from './useFocus';

const _focus = HTMLInputElement.prototype.focus;
afterAll(() => {
  HTMLInputElement.prototype.focus = _focus;
});

type Api = {
  id: string;
  onClick: () => void;
};

type Props = {
  api: Api;
  sensetiveProp: string;
  render: (ref: RefObject<HTMLInputElement>, api: Api) => ReactElement;
};

const Demo = (props: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  const wrappedApi = useFocus(ref, props.api, [props.sensetiveProp]);
  return props.render(ref, wrappedApi);
};

const renderProp = (ref: RefObject<HTMLInputElement>, api: Api) => {
  return (
    <>
      <input ref={ref} />
      <button {...api} />
    </>
  );
};

test('when initially mounted, focuses', async () => {
  const focus = (HTMLInputElement.prototype.focus = jest.fn());
  const container = document.createElement('div');
  document.body!.appendChild(container);
  const api: Api = {id: 'BUTTON_ID', onClick: () => {}};
  ReactDOM.render(
    <Demo api={api} sensetiveProp="unchanged" render={renderProp} />,
    container,
  );
  await sleep(100);
  expect(focus).toHaveBeenCalledTimes(1);
});

test('when trigger prop changes, focuses', async () => {
  const container = document.createElement('div');
  document.body!.appendChild(container);
  const api: Api = {id: 'BUTTON_ID', onClick: () => {}};
  ReactDOM.render(
    <Demo api={api} sensetiveProp="unchanged" render={renderProp} />,
    container,
  );
  await sleep(100);
  const input = container.querySelector('input');
  const focus = (HTMLInputElement.prototype.focus = jest.fn());
  act(() => {
    Simulate.blur(input!);
  });
  await sleep(100);
  expect(focus).not.toHaveBeenCalled();
  act(() => {
    ReactDOM.render(
      <Demo api={api} sensetiveProp="changed" render={renderProp} />,
      container,
    );
  });
  expect(focus).toHaveBeenCalledTimes(1);
});

test('when api function is called, focuses', async () => {
  const container = document.createElement('div');
  document.body!.appendChild(container);
  const api: Api = {id: 'BUTTON_ID', onClick: () => {}};
  ReactDOM.render(
    <Demo api={api} sensetiveProp="unchanged" render={renderProp} />,
    container,
  );
  await sleep(100);
  const focus = (HTMLInputElement.prototype.focus = jest.fn());
  const button = container.querySelector('button')!;
  expect(button.id).toBe('BUTTON_ID');
  expect(focus).not.toHaveBeenCalled();
  Simulate.click(button);
  expect(focus).toHaveBeenCalledTimes(1);
});
