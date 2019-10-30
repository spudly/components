import {Position} from './types';

const getPositionForIndex = (value: string, index: number): Position => {
  if (index < 0 || index > value.length) {
    throw new Error('out of bounds');
  }
  const lines = (value + ' ').slice(0, index + 1).split(/(?<=\n)/);
  return {
    line: lines.length,
    column: lines[lines.length - 1].length,
    index,
  };
};

export default getPositionForIndex;
