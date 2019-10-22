const range = (
  from: number,
  to: number,
  step: number = from <= to ? 1 : -1,
): Array<number> => {
  const nums = [];
  for (let i = from; i < to; i += step) {
    nums.push(i);
  }
  return nums;
};

export default range;
