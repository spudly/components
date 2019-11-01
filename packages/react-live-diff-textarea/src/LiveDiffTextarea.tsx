import React, {useRef, ReactElement} from 'react';
import {
  useLiveDiff,
  Patch,
  RenderApi,
  getPosition,
} from '@spudly/react-live-diff';
import useScrollToLine from '@spudly/react-use-scroll-to-line';
import useSelectionRange from '@spudly/react-use-selection-range';
import useFocus from '@spudly/react-use-focus';

type Props = JSX.IntrinsicElements['textarea'] & {
  initialValue: string;
  patches: Array<Patch>;
  onChange?: (value: string) => void;
  render: (textarea: ReactElement, api: RenderApi) => ReactElement;
};

const LiveDiffTextarea = ({
  initialValue,
  patches,
  onChange,
  render,
  ...props
}: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const api = useLiveDiff(initialValue, patches);
  useSelectionRange(textareaRef, api.selectionStart, api.selectionEnd);
  const line = getPosition(api.value, api.selectionEnd).line;
  useScrollToLine(textareaRef, api.value, line);
  const apiWithFocus = useFocus(textareaRef, api, [
    api.value,
    api.selectionStart,
    api.selectionEnd,
  ]);
  return render(
    <textarea ref={textareaRef} value={api.value} {...props} />,
    apiWithFocus,
  );
};

export default LiveDiffTextarea;
