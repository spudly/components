const getNumberPrecision = (a: number): number => {
  if (!isFinite(a)) {
    return 0;
  }
  let precision = 0;
  let factor = 1;
  while (Math.round(a * factor) / factor !== a) {
    precision++;
    factor *= 10;
  }
  return precision;
};

export default getNumberPrecision;
