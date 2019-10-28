import getCharIndex from './getCharIndex';
import {Selection} from './types';

const getSelectionIndices = (
  value: string,
  selection: Selection,
): [number, number] => [
  getCharIndex(value, selection.from),
  getCharIndex(value, selection.to),
];

export default getSelectionIndices;
