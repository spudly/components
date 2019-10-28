import React, {useRef, ReactElement} from 'react';
import useLiveDiff from './useLiveDiff';
import {Patch, RenderApi} from './types';
import useScrollToLine from './useScrollToLine';
import useSelectionRange from './useSelectionRange';
import getSelectionIndices from './getSelectionIndices';
import useFocus from './useFocus';

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
  const [from, to] = getSelectionIndices(
    // TODO: move this into useLiveDiff. replace position with selection
    api.value,
    api.position,
    api.selection,
  );
  useSelectionRange(textareaRef, from, to);
  useScrollToLine(textareaRef, api.value, api.position.line);
  const apiWithFocus = useFocus(textareaRef, api, [
    api.value,
    api.position,
    api.selection,
  ]);
  return render(
    <textarea ref={textareaRef} value={api.value} {...props} />,
    apiWithFocus,
  );
};

export default LiveDiffTextarea;
