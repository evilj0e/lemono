export enum TimerAction {
  Start,
  Stop,
  Skip,
  Update
}

export enum TimerType {
  Once,
  Repeat,
  All
}

export type ITimerCallback = (event: TimerAction) => void;

export interface ITimerEvents {
  [key: string]: Array<ITimerCallback>;
}
