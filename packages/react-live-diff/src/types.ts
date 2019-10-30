export type Patch = {
  name: string;
  code: string;
};

export type Position = {line: number; column: number; index: number};

export type Selection = {
  from: Position;
  to: Position;
};

export type EditorState = {
  value: string;
  selection: Selection;
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
  selection: Selection;
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
