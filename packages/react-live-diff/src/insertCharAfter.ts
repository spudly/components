import {Position} from './types';

const insertCharAfter = (value: string, position: Position, char: string) =>
  value
    .split('\n')
    .reduce(
      (lines, line, lineIndex) => {
        const lineNumber = lineIndex + 1;
        if (lineNumber !== position.line) {
          return [...lines, line];
        }
        return [
          ...lines,
          `${line.slice(0, position.column - 1)}${char}${line.slice(
            position.column - 1,
          )}`,
        ];
      },
      [] as Array<string>,
    )
    .join('\n');

export default insertCharAfter;
