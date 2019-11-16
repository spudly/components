import {useEffect, RefObject} from 'react';

const useSelectionRange = (
  ref: RefObject<HTMLTextAreaElement>,
  selectionStart: number,
  selectionEnd: number,
) => {
  useEffect(() => {
    const textarea = ref.current;
    if (!textarea) {
      return;
    }
    const direction =
      selectionStart === selectionEnd
        ? 'none'
        : selectionStart < selectionEnd
        ? 'forward'
        : 'backward';
    textarea.setSelectionRange(selectionStart, selectionEnd, direction);
  }, [selectionStart, ref, selectionEnd]);
};

export default useSelectionRange;
