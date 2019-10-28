import {Position} from './types';

const getCharIndex = (value: string, position: Position): number =>
  value.split('\n').reduce((index, line, lineIndex) => {
    const lineNumber = lineIndex + 1;
    if (lineNumber < position.line) {
      return index + line.length + 1;
    }
    if (lineNumber === position.line) {
      return index + position.column - 1;
    }
    return index;
  }, 0);

export default getCharIndex;
