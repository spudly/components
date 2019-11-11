export type State = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

export type Action =
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
  speed: number;
  elapsed: number;
  duration: number;
  patchNames: Array<string>;
  patchIndex: number;
  isPlaying: boolean;
  isFinished: boolean;
  setPatchIndex: (index: number) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setSpeed: (speed: number) => void;
  seek: (elapsed: number) => void;
};
