import React, {useEffect, useRef, ReactElement, RefObject} from 'react';
import {
  useAnimatedDiff,
  RenderApi,
  getPosition,
} from '@spudly/use-animated-diff';
import useSelectionRange from '@spudly/use-selection-range';

const useFocus = (
  ref: RefObject<HTMLTextAreaElement>,
  value: string,
  selectionStart: number,
  selectionEnd: number,
) => {
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [ref, value, selectionStart, selectionEnd]);
};

const parsePx = (value: string | null): number =>
  value != null ? parseInt(value, 10) : 0;

const useScrollToLine = (
  elRef: RefObject<HTMLElement>,
  value: string,
  line: number,
) => {
  useEffect(() => {
    const el = elRef.current!;
    const {height} = el?.getBoundingClientRect();
    const {scrollHeight} = el!;
    const {paddingTop, paddingBottom} = getComputedStyle(el);
    const numLines = value.split('\n').length;
    const lineHeight =
      (scrollHeight - parsePx(paddingTop) - parsePx(paddingBottom)) / numLines;
    // eslint-disable-next-line no-unused-expressions, no-restricted-globals
    el?.scrollTo(
      0,
      Math.max(Math.floor(line - height / lineHeight / 2) * lineHeight, 0),
    );
  }, [value, line, elRef]);
};

type Props = JSX.IntrinsicElements['textarea'] & {
  initialValue: string;
  patches: Array<string>;
  onChange?: (value: string) => void;
  render: (textarea: ReactElement, api: RenderApi) => ReactElement;
};

const AnimatedDiffTextarea = ({
  initialValue,
  patches,
  onChange,
  render,
  ...props
}: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const api = useAnimatedDiff(initialValue, patches);
  useSelectionRange(textareaRef, api.selectionStart, api.selectionEnd);
  const [line] = getPosition(api.value, api.selectionEnd);
  useScrollToLine(textareaRef, api.value, line);
  useFocus(textareaRef, api.value, api.selectionStart, api.selectionEnd);
  return render(
    <textarea ref={textareaRef} value={api.value} {...props} />,
    api,
  );
};

export default AnimatedDiffTextarea;
