import { Period } from "./index.types";

export interface IIcons {
  [Period.Work]: string;
  [Period.Coffee]: string;
  [Period.Social]: string;
  [Period.Lunch]: string;
  default: string;
}

export interface ITimings {
  [Period.Work]: number;
  [Period.Coffee]: number;
  [Period.Social]: number;
  [Period.Lunch]: number;
}

export type IPeriods = Period[];

export type IMenuItemsConctructor = () => Electron.MenuItemConstructorOptions[];
