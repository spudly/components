import {useState, useCallback} from 'react';

// TODO: move this to a new package
const modulo = (index: number, length: number): number =>
  ((index % length) + length) % length;

const usePlaylist = <T>(tracks: Array<T>) => {
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (target: number) => setIndex(modulo(target, tracks.length)),
    [tracks.length],
  );

  return [tracks, index, go];
};

export default usePlaylist;
