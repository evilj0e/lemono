import { ITime } from "./index.types";

export interface IIcons {
  // @TODO update types to keys from ITime
  work: any;
  coffee: any;
  social: any;
  lunch: any;
  default: any;
}

export interface ITimings {
  work: number;
  coffee: number;
  social: number;
  lunch: number;
}

export type IPeriods = ITime[];

export type IMenuItemsConctructor = () => Electron.MenuItemConstructorOptions[];
