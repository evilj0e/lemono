import {
  TimerAction,
  ITimerCallback,
  ITimerEvents,
  TimerType
} from "./timer.types";

class Timer {
  private events: ITimerEvents = {};
  private onceTimer: NodeJS.Timeout = null;
  private repeatTimer: NodeJS.Timeout = null;

  on(event: TimerAction, cb: ITimerCallback): Timer {
    if (cb) {
      if (this.events[event] instanceof Array) {
        this.events[event].push(cb);
      } else {
        this.events[event] = [cb];
      }
    }

    return this;
  }

  off(event: TimerAction): Timer {
    this.stop(TimerType.All);

    delete this.events[event];

    return this;
  }

  stop(type: TimerType): Timer {
    if ([TimerType.All, TimerType.Once].includes(type)) {
      clearTimeout(this.onceTimer);
    }

    if ([TimerType.All, TimerType.Repeat].includes(type)) {
      clearInterval(this.repeatTimer);
    }

    return this;
  }

  once(event: TimerAction, delay: number = 0): Timer {
    clearTimeout(this.onceTimer);

    const subscriptions = this.events[event];

    if (subscriptions && subscriptions.length) {
      this.onceTimer = setTimeout(() => {
        subscriptions.forEach(cb => cb(event));
      }, delay);
    }

    return this;
  }

  repeat(event: TimerAction, delay: number = 1000): Timer {
    clearInterval(this.repeatTimer);

    const subscriptions = this.events[event];

    if (subscriptions && subscriptions.length) {
      const trigger: (cb: ITimerCallback) => void = cb => cb(event);

      subscriptions.forEach(trigger);

      this.repeatTimer = setInterval(() => {
        subscriptions.forEach(trigger);
      }, delay);
    }

    return this;
  }
}

export default Timer;
