/**
 * @jest-environment jsdom
 **/
import React, {useRef} from 'react';
import {render, cleanup} from '@testing-library/react';
import useSelectionRange from './useSelectionRange';

const value = `Scram, McFly.
Marty, I'm sorry, but the only power source capable of generating one point twenty-one gigawatts of electricity is a bolt of lightning.
I don't wanna know your name. I don't wanna know anything anything about you.
Remember, fellas, the future is in your hands.`;

const Demo = ({start, end}: {start: number; end: number}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  useSelectionRange(ref, start, end);
  return (
    <label>
      Value <textarea ref={ref} value={value} readOnly />
    </label>
  );
};

afterEach(cleanup);

test('sets the selection range on the textarea (direction: forward)', () => {
  const {getByLabelText} = render(<Demo start={20} end={30} />);
  const textarea = getByLabelText('Value') as HTMLTextAreaElement;
  expect(textarea.selectionStart).toBe(20);
  expect(textarea.selectionEnd).toBe(30);
  expect(textarea.selectionDirection).toBe('forward');
});

test('sets the selection range on the textarea (direction: backward)', () => {
  const {getByLabelText} = render(<Demo start={30} end={20} />);
  const textarea = getByLabelText('Value') as HTMLTextAreaElement;
  expect(textarea.selectionStart).toBe(20);
  expect(textarea.selectionEnd).toBe(30);
  expect(textarea.selectionDirection).toBe('backward');
});

test('sets the selection range on the textarea (direction: none)', () => {
  const {getByLabelText} = render(<Demo start={25} end={25} />);
  const textarea = getByLabelText('Value') as HTMLTextAreaElement;
  expect(textarea.selectionStart).toBe(25);
  expect(textarea.selectionEnd).toBe(25);
  expect(textarea.selectionDirection).toBe('none');
});
