import {useEffect, RefObject} from 'react';

const useSelectionRange = (
  ref: RefObject<HTMLTextAreaElement>,
  selectionStart: number,
  selectionEnd: number,
) => {
  useEffect(() => {
    const direction =
      selectionStart === selectionEnd
        ? 'none'
        : selectionStart < selectionEnd
        ? 'forward'
        : 'backward';
    ref.current!.setSelectionRange(
      Math.min(selectionStart, selectionEnd),
      Math.max(selectionStart, selectionEnd),
      direction,
    );
  }, [selectionStart, ref, selectionEnd]);
};

export default useSelectionRange;
