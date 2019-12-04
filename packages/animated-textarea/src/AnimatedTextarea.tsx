import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  RefObject,
  forwardRef,
  Ref,
} from 'react';
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
};

type SelectionInfo = {
  selectionStart: number;
  selectionEnd: number;
  selectionDirection: string;
};

const AnimatedTextarea = forwardRef(
  ({initialValue, patches, onChange, ...props}: Props, ref: Ref<RenderApi>) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const api = useAnimatedDiff(initialValue, patches);
    useImperativeHandle<RenderApi, RenderApi>(ref, () => api, [api]);
    useEffect(() => {
      const t = textareaRef.current!;
      if (t.value !== api.value) {
        t.value = api.value;
      }
    }, [api.value]);
    useSelectionRange(textareaRef, api.selectionStart, api.selectionEnd);
    const [line] = getPosition(api.value, api.selectionEnd);
    useScrollToLine(textareaRef, api.value, line);
    useFocus(textareaRef, api.value, api.selectionStart, api.selectionEnd);

    return (
      <textarea
        ref={textareaRef}
        onChange={e => {
          api.onChange(
            e.currentTarget.value,
            e.currentTarget.selectionStart,
            e.currentTarget.selectionEnd,
          );
        }}
        {...props}
      />
    );
  },
);

AnimatedTextarea.displayName = 'AnimatedTextarea';

export default AnimatedTextarea;
