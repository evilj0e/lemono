export type ITimerActions = "start" | "stop" | "skip" | "update";

export type ITimerType = "once" | "repeat" | "all";

export type ITimerCallback = (event: ITimerActions) => void;

export interface ITimerEvents {
  [key: string]: Array<ITimerCallback>;
}
