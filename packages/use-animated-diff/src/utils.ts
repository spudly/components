export const getIndex = (
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

export const getPosition = (value: string, index: number): [number, number] => {
  if (index < 0 || index > value.length) {
    throw new Error('out of bounds');
  }
  const lines = (value + ' ').slice(0, index + 1).split(/(?<=\n)/);
  const line = lines.length;
  const column = lines[lines.length - 1].length;
  return [line, column];
};
