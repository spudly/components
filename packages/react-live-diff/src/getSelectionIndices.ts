import getCharIndex from './getCharIndex';
import {Selection} from './types';

const getSelectionIndices = (
  value: string,
  selection: Selection,
): [number, number] => [
  getCharIndex(value, selection.from.line, selection.from.column),
  getCharIndex(value, selection.to.line, selection.to.column),
];

export default getSelectionIndices;
