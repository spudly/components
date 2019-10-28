export type Patch = {
  name: string;
  code: string;
};

export type Position = {line: number; column: number};

export type Selection = {
  from: Position;
  to: Position;
};

export type EditorState = {
  value: string;
  position: Position;
  selection: Selection | null;
};

export type EditAction =
  | {type: 'MOVE_UP'; selection?: boolean}
  | {type: 'MOVE_RIGHT'; selection?: boolean}
  | {type: 'MOVE_DOWN'; selection?: boolean}
  | {type: 'MOVE_LEFT'; selection?: boolean}
  | {type: 'DELETE_SELECTED'}
  | {type: 'BACKSPACE'}
  | {type: 'TYPE'; char: string};

export type RenderApi = {
  value: string;
  position: Position;
  selection: Selection | null;
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
