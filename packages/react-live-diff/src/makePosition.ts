import getCharIndex from './getCharIndex';
import getPositionForIndex from './getPositionForIndex';

type MaybeNumber = number | null | undefined;

type Options = {line?: MaybeNumber; column?: MaybeNumber; index?: MaybeNumber};

const makePosition = (value: string, opts: Options) => {
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

export default makePosition;
