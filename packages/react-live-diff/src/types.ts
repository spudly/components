export type Patch = {
  // TODO: deprecate this. just use 'code' directly and get name from code header
  name: string;
  code: string;
};

export type Position = {line: number; column: number};

export type EditorState = {
  value: string; // TODO: change this to {value, selectionStart, selectionEnd}
  selectionStart: number;
  selectionEnd: number;
};

export type EditAction =
  | {type: 'MOVE_UP'; select?: boolean}
  | {type: 'MOVE_RIGHT'; select?: boolean}
  | {type: 'MOVE_DOWN'; select?: boolean}
  | {type: 'MOVE_LEFT'; select?: boolean}
  | {type: 'DELETE_SELECTED'}
  | {type: 'BACKSPACE'}
  | {type: 'TYPE'; char: string};

export type RenderApi = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
  patch: Patch;
  speed: number;
  elapsed: number;
  duration: number;
  patchIndex: number;
  isFirst: boolean;
  isLast: boolean;
  isPlaying: boolean;
  isFinished: boolean;
  first: () => void;
  prev: () => void;
  next: () => void;
  last: () => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setSpeed: (speed: number) => void;
  seek: (elapsed: number) => void;
};
