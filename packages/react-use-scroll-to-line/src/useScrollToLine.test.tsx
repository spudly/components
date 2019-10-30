/**
 * @jest-environment jsdom
 **/
import React, {useRef} from 'react';
import ReactDOM from 'react-dom';
import sleep from '@spudly/sleep';
import useScrollToLine from './useScrollToLine';

const value = `Shape up, man. You're a slacker. You wanna be a slacker for the rest of your life?
Watch this. Not me, the car, the car. My calculations are correct, when this baby hits eighty-eight miles per hour, your gonna see some serious shit. Watch this, watch this. Ha, what did I tell you, eighty-eight miles per hour. The temporal displacement occurred at exactly 1:20 a.m. and zero seconds.
Whoa, wait, Doc.
Bear with me, Marty, all of your questions will be answered. Roll tape, we'll proceed.
Yeah.
I gotta go, uh, I gotta go. Thanks very much, it was wonderful, you were all great. See you all later, much later.
George: you ever think of running for class president?
Oh.
This is more serious than I thought. Apparently your mother is amorously infatuated with you instead of your father.
I just wanna use the phone.
See, there's Biff out there waxing it right now. Now, Biff, I wanna make sure that we get two coats of wax this time, not just one.
The future, it's where you're going?
Well, safe and sound, now, n good old 1955.
Doc, look, all we need is a little plutonium.
Whoa, wait, Doc.`;

const Demo = ({line}: {line: number}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  useScrollToLine(ref, value, line);
  return <textarea rows={5} ref={ref} value={value} onChange={() => {}} />;
};

const _getBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
beforeAll(() => {
  HTMLElement.prototype.getBoundingClientRect = () => ({
    height: 100,
  } as any);
  Object.defineProperty(HTMLTextAreaElement.prototype, 'scrollHeight', {
    value: value.split('\n').length * 18 + 4,
    configurable: true,
  });
});

afterAll(() => {
  HTMLElement.prototype.getBoundingClientRect = _getBoundingClientRect;
});

test('scrolls the current line to the  middle of the element', async () => {
  const scrollTo = (HTMLTextAreaElement.prototype.scrollTo = jest.fn());
  const div = document.createElement('div');
  document.body.appendChild(div);
  ReactDOM.render(<Demo line={8} />, div);
  await sleep(100);
  expect(scrollTo).toHaveBeenCalledWith(0, 90);
});

test('first line => scrollTop: 0', async () => {
  const scrollTo = (HTMLTextAreaElement.prototype.scrollTo = jest.fn());
  const div = document.createElement('div');
  document.body.appendChild(div);
  ReactDOM.render(<Demo line={1} />, div);
  await sleep(100);
  expect(scrollTo).toHaveBeenCalledWith(0, 0);
});

test('last line => scrollTop: scrollHeight - height', async () => {
  const scrollTo = (HTMLTextAreaElement.prototype.scrollTo = jest.fn());
  const div = document.createElement('div');
  document.body.appendChild(div);
  ReactDOM.render(<Demo line={15} />, div);
  await sleep(100);
  expect(scrollTo).toHaveBeenCalledWith(0, 216);
});
