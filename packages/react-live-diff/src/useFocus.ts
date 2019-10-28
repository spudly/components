import {useEffect, RefObject, useMemo} from 'react';

const useFocus = <API extends {[key: string]: unknown}>(
  ref: RefObject<HTMLElement>,
  api: API,
  focusTriggers: Array<unknown>,
): API => {
  useEffect(
    () => {
      const el = ref.current;
      if (!el) {
        return;
      }
      el.focus();
    },
    // eslint-disable-next-line
    focusTriggers,
  );

  return useMemo(() => {
    const focusFirst = <ARGS extends Array<any>>(
      fn: (...args: ARGS) => void,
    ) => (...args: ARGS) => {
      if (ref.current) {
        ref.current.focus();
      }
      return fn(...args);
    };
    const newApi: Partial<API> = {};
    Object.keys(api).forEach((key: keyof API) => {
      const value: any = api[key];
      newApi[key] = typeof value === 'function' ? focusFirst(value) : value;
    });
    return (newApi as any) as API;
  }, [api, ref]);
};

export default useFocus;
