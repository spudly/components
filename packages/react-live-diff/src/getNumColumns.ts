const getNumColumns = (value: string, line: number) => {
  if (line === 0) {
    throw new Error('invalid line number');
  }
  return value.split(/\n/)[line - 1].length + 1;
};

export default getNumColumns;
