import getCharIndex from './getCharIndex';
import {Position, Selection} from './types';

const getSelectionIndices = (
  value: string,
  position: Position,
  selection: Selection | null,
): [number, number] => {
  if (selection) {
    return [
      getCharIndex(value, selection.from),
      getCharIndex(value, selection.to),
    ];
  } else {
    const index = getCharIndex(value, position);
    return [index, index];
  }
};

export default getSelectionIndices;
