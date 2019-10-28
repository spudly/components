import {useEffect, RefObject} from 'react';

const useSelectionRange = (
  ref: RefObject<HTMLTextAreaElement>,
  from: number,
  to: number,
) => {
  useEffect(() => {
    const textarea = ref.current;
    if (!textarea) {
      return;
    }
    const direction = from === to ? 'none' : from < to ? 'forward' : 'backward';
    textarea.setSelectionRange(from, to, direction);
  }, [from, ref, to]);
};

export default useSelectionRange;
