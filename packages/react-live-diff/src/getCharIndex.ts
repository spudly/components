const getCharIndex = (value: string, line: number, column: number): number => {
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

export default getCharIndex;
