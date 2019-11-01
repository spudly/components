import {Position, Selection} from './types';

export const getCharIndex = (
  value: string,
  line: number,
  column: number,
): number => {
  if (line < 1 || column < 1) {
    throw new Error('out of bounds');
  }
  const lines = value.split(/(?<=\n)/);
  return lines.reduce((index, chars, lineIndex) => {
    const lineNumber = lineIndex + 1;
    const isLastLine = lineNumber === lines.length;
    if (lineNumber < line) {
      return index + chars.length;
    }
    if (lineNumber === line) {
      const lastColumn = isLastLine ? chars.length + 1 : chars.length;
      if (column < 1 || column > lastColumn) {
        throw new Error('out of bounds');
      }
      return index + column - 1;
    }
    return index;
  }, 0);
};

export const getNumColumns = (value: string, line: number) => {
  if (line === 0) {
    throw new Error('invalid line number');
  }
  return value.split(/\n/)[line - 1].length + 1;
};

export const getNumLines = (value: string) => value.split('\n').length;

export const getPositionForIndex = (value: string, index: number): Position => {
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

export const getSelectionIndices = (
  value: string,
  selection: Selection,
): [number, number] => [
  getCharIndex(value, selection.from.line, selection.from.column),
  getCharIndex(value, selection.to.line, selection.to.column),
];

export const insertCharAfter = (
  value: string,
  position: Position,
  char: string,
) =>
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

export const makePosition = (
  value: string,
  opts: {
    line?: number | null | undefined;
    column?: number | null | undefined;
    index?: number | null | undefined;
  },
) => {
  if (opts.line != null && opts.column != null) {
    return {
      line: opts.line,
      column: opts.column,
      index: getCharIndex(value, opts.line, opts.column),
    };
  }
  if (opts.index != null) {
    return getPositionForIndex(value, opts.index);
  }
  throw new Error('Unable to make position with supplied data');
};

export const removeCharBefore = (value: string, position: Position): string =>
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
