import getNumberPrecision from '@spudly/get-number-precision';

const range = (
  from: number,
  to: number,
  step: number = from <= to ? 1 : -1,
): Array<number> => {
  const nums = [];
  if (!Number.isInteger(step)) {
    const factor = 10 ** getNumberPrecision(step);
    return range(from * factor, to * factor, step * factor).map(
      n => n / factor,
    );
  }
  for (let i = from; from < to ? i < to : i > to; i += step) {
    nums.push(i);
  }
  return nums;
};

export default range;
