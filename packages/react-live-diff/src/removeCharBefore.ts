import {Position} from './types';

const removeCharBefore = (value: string, position: Position): string =>
  value
    .split('\n')
    .reduce(
      (lines, line, lineIndex) => {
        const lineNumber = lineIndex + 1;
        if (lineNumber !== position.line) {
          return [...lines, line];
        }
        if (position.column === 1) {
          return [...lines.slice(0, -1), `${lines[lines.length - 1]}${line}`];
        }
        return [
          ...lines,
          `${line.slice(0, position.column - 2)}${line.slice(
            position.column - 1,
          )}`,
        ];
      },
      [] as Array<string>,
    )
    .join('\n');

export default removeCharBefore;
