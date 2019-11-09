import * as path from "path";

import { IIcons, ITimings, IPeriods } from "./constants.types";
import { Period } from "./index.types";

const ASSETS = path.join(__dirname, "../assets");

export const ICONS: IIcons = {
  default: path.join(ASSETS, "lemon.png"),
  [Period.Work]: path.join(ASSETS, "work.png"),
  [Period.Coffee]: path.join(ASSETS, "coffee.png"),
  [Period.Social]: path.join(ASSETS, "social.png"),
  [Period.Lunch]: path.join(ASSETS, "soup.png")
};

export const TIMINGS: ITimings = {
  // minutes
  [Period.Work]: 25,
  [Period.Coffee]: 5,
  [Period.Social]: 15,
  [Period.Lunch]: 60
};

/*
For TARGET_AMOUNT_COUNT of work periods should be 
TARGET_AMOUNT_COUNT * 2 period of work and some kinds of pauses.
*/
export const PERIODS: IPeriods = [
  Period.Work,
  Period.Coffee,
  Period.Work,
  Period.Coffee,
  Period.Work,
  Period.Coffee,
  Period.Work,
  Period.Social,
  Period.Work,
  Period.Coffee,
  Period.Work,
  Period.Lunch,
  Period.Work,
  Period.Social,
  Period.Work,
  Period.Coffee,
  Period.Work,
  Period.Social,
  Period.Work,
  Period.Coffee,
  Period.Work,
  Period.Lunch,
  Period.Work,
  Period.Coffee,
  Period.Work,
  Period.Coffee
];

export const NOTIFICATIONS = {
  [Period.Coffee]: {
    title: "Have a break",
    body: "How about a cup of coffee?"
  },
  [Period.Work]: {
    title: "Time to work",
    body: "It's sad, but the job won't do itself."
  },
  [Period.Social]: {
    title: "Time for socal life",
    body: "It's time to put likes on the instagram."
  },
  [Period.Lunch]: {
    title: "Food fetish time",
    body: "Time for a little refreshment, I think."
  },
  default: {
    title: "You're great!",
    body: " Have a rest! See you tomorrow!"
  }
};
