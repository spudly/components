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
  playbackRate: number;
  currentTime: number;
  duration: number;
  paused: boolean;
  ended: boolean;
  play: () => void;
  pause: () => void;
  setPlaybackRate: (rate: number) => void;
  onChange?: (
    value: string,
    selectionStart: number,
    selectionEnd: number,
  ) => void;
};
