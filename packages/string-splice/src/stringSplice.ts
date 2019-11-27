import curry from '@spudly/curry';

const stringSplice = curry(
  (start: number, deleteCount: number, chars: string, s: string): string => {
    start = Math.min(start, s.length);
    if (start < 0) {
      start = s.length + start;
      if (start < 0) {
        start = 0;
      }
    }

    const before = s.slice(0, start);
    const after = s.slice(start + Math.max(deleteCount, 0));

    return `${before}${chars || ''}${after}`;
  },
);

export default stringSplice;
