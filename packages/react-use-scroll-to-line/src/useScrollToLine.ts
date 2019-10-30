import {useEffect, RefObject} from 'react';

const parsePx = (value: string | null): number =>
  value != null ? parseInt(value, 10) : 0;

const useScrollToLine = (
  elRef: RefObject<HTMLElement>,
  value: string,
  line: number,
) => {
  useEffect(() => {
    const el = elRef.current!;
    const {height} = el!.getBoundingClientRect();
    const {scrollHeight} = el!;
    const {paddingTop, paddingBottom} = getComputedStyle(el);
    const numLines = value.split('\n').length;
    const lineHeight =
      (scrollHeight - parsePx(paddingTop) - parsePx(paddingBottom)) / numLines;
    el!.scrollTo(
      0,
      Math.max(Math.floor(line - height / lineHeight / 2) * lineHeight, 0),
    );
  }, [value, line, elRef]);
};

export default useScrollToLine;
