/**
 * @jest-environment jsdom
 **/
import React, {useState} from 'react';
import {render, cleanup, fireEvent, wait} from '@testing-library/react';
import useAnimate from './useAnimate';
import '@testing-library/jest-dom/extend-expect';

const Progress = ({
  baseSpeed,
  onEnded,
}: {
  baseSpeed?: number;
  onEnded?: () => void;
}) => {
  const duration = 100;
  const [elapsed, seek] = useState(0);
  const {
    isPlaying,
    isFinished,
    speed,
    setSpeed,
    play,
    pause,
  } = useAnimate(duration, elapsed, seek, baseSpeed, {onEnded});
  return (
    <>
      <div
        role="progressbar"
        aria-valuenow={elapsed}
        aria-valuemin={0}
        aria-valuemax={duration}
        style={{width: `${elapsed}%`}}
      >
        {elapsed}%
      </div>
      <label>
        <input type="checkbox" checked={isPlaying} readOnly /> Is Playing?
      </label>
      <label>
        <input type="checkbox" checked={isFinished} readOnly /> Is Finished?
      </label>
      <label>
        Speed
        <input
          type="number"
          value={speed}
          onChange={e => setSpeed(Number(e.currentTarget.value))}
        />
      </label>
      <button type="button" onClick={play}>
        play
      </button>
      <button type="button" onClick={pause}>
        pause
      </button>
    </>
  );
};

beforeEach(() => {
  jest
    .spyOn(window, 'requestAnimationFrame')
    .mockImplementation(cb => setTimeout(cb, 0));
  jest.spyOn(Date, 'now');
});

type MockRaf = jest.MockedFunction<typeof window.requestAnimationFrame>;

type MockNow = jest.MockedFunction<typeof Date.now>;

afterEach(() => {
  (window.requestAnimationFrame as MockRaf).mockRestore();
  (Date.now as MockNow).mockRestore();
  cleanup();
});

test('renders', () => {
  const {getByRole} = render(<Progress />);
  expect(getByRole('progressbar')).toHaveStyle(`width: 0%`);
});

test('play', async () => {
  (Date.now as MockNow).mockReturnValue(0);
  const {getByRole, getByText, getByLabelText} = render(<Progress />);
  expect(getByRole('progressbar')).toHaveStyle(`width: 0%`);
  expect(getByLabelText('Is Playing?')).not.toBeChecked();
  expect(getByLabelText('Is Finished?')).not.toBeChecked();
  fireEvent.click(getByText('play'));
  expect(getByLabelText('Is Playing?')).toBeChecked();
  (Date.now as MockNow).mockReturnValue(50);
  await wait(() => expect(getByRole('progressbar')).toHaveStyle(`width: 50%`));
  (Date.now as MockNow).mockReturnValue(75);
  await wait(() => expect(getByRole('progressbar')).toHaveStyle(`width: 75%`));
  (Date.now as MockNow).mockReturnValue(101);
  await wait(() => expect(getByRole('progressbar')).toHaveStyle(`width: 100%`));
  await wait(() => expect(getByLabelText('Is Playing?')).not.toBeChecked());
  expect(getByLabelText('Is Finished?')).toBeChecked();
});

test('play: baseSpeed: 2', async () => {
  (Date.now as MockNow).mockReturnValue(0);
  const {getByRole, getByText, getByLabelText} = render(
    <Progress baseSpeed={2} />,
  );
  expect(getByRole('progressbar')).toHaveStyle(`width: 0%`);
  expect(getByLabelText('Is Playing?')).not.toBeChecked();
  expect(getByLabelText('Is Finished?')).not.toBeChecked();
  fireEvent.click(getByText('play'));
  expect(getByLabelText('Is Playing?')).toBeChecked();
  (Date.now as MockNow).mockReturnValue(10);
  await wait(() => expect(getByRole('progressbar')).toHaveStyle(`width: 20%`));
  (Date.now as MockNow).mockReturnValue(20);
  await wait(() => expect(getByRole('progressbar')).toHaveStyle(`width: 40%`));
  (Date.now as MockNow).mockReturnValue(55);
  await wait(() => expect(getByRole('progressbar')).toHaveStyle(`width: 100%`));
  await wait(() => expect(getByLabelText('Is Playing?')).not.toBeChecked());
  expect(getByLabelText('Is Finished?')).toBeChecked();
});

test('calls onEnded if provided', async () => {
  const onEnded = jest.fn();
  (Date.now as MockNow).mockReturnValue(0);
  const {getByText, getByLabelText} = render(<Progress onEnded={onEnded} />);
  fireEvent.click(getByText('play'));
  (Date.now as MockNow).mockReturnValue(101);
  await wait(() => expect(getByLabelText('Is Finished?')).toBeChecked());
  expect(onEnded).toHaveBeenCalledTimes(1);
});

test('pause', async () => {
  (Date.now as MockNow).mockReturnValue(0);
  const {getByRole, getByText, getByLabelText} = render(<Progress />);
  expect(getByRole('progressbar')).toHaveStyle(`width: 0%`);
  expect(getByLabelText('Is Playing?')).not.toBeChecked();
  expect(getByLabelText('Is Finished?')).not.toBeChecked();
  fireEvent.click(getByText('play'));
  expect(getByLabelText('Is Playing?')).toBeChecked();
  (Date.now as MockNow).mockReturnValue(50);
  await wait(() => expect(getByRole('progressbar')).toHaveStyle(`width: 50%`));
  fireEvent.click(getByText('pause'));
  await wait(() => expect(getByLabelText('Is Playing?')).not.toBeChecked());
  expect(getByRole('progressbar')).toHaveStyle(`width: 50%`);
});

test('setSpeed', async () => {
  (Date.now as MockNow).mockReturnValue(0);
  const {getByRole, getByText, getByLabelText} = render(<Progress />);
  expect(getByRole('progressbar')).toHaveStyle(`width: 0%`);
  expect(getByLabelText('Is Playing?')).not.toBeChecked();
  expect(getByLabelText('Is Finished?')).not.toBeChecked();
  fireEvent.click(getByText('play'));
  expect(getByLabelText('Is Playing?')).toBeChecked();
  (Date.now as MockNow).mockReturnValue(50);
  await wait(() => expect(getByRole('progressbar')).toHaveStyle(`width: 50%`));
  fireEvent.change(getByLabelText('Speed'), {target: {value: '50'}});
  (Date.now as MockNow).mockReturnValue(100);
  await wait(() => expect(getByRole('progressbar')).toHaveStyle(`width: 75%`));
});
