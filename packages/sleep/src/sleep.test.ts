import sleep from './sleep';

test('waits n milliseconds', async () => {
  jest.useFakeTimers();
  let resolved = false;
  const promise = sleep(1000).then(() => (resolved = true));

  expect(jest.getTimerCount()).toBe(1);
  expect(resolved).toBe(false);

  jest.runTimersToTime(1000);
  await promise;

  expect(jest.getTimerCount()).toBe(0);
  expect(resolved).toBe(true);
});
