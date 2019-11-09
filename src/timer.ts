import {
  ITimerActions,
  ITimerCallback,
  ITimerEvents,
  ITimerType
} from "./timer.types";

class Timer {
  private events: ITimerEvents = {};
  private onceTimer: NodeJS.Timeout = null;
  private repeatTimer: NodeJS.Timeout = null;

  on(event: ITimerActions, cb: ITimerCallback) {
    if (cb) {
      if (this.events[event] instanceof Array) {
        this.events[event].push(cb);
      } else {
        this.events[event] = [cb];
      }
    }

    return this;
  }

  off(event: ITimerActions) {
    this.stop("all");

    delete this.events[event];

    return this;
  }

  stop(type: ITimerType) {
    if (["all", "once"].includes(type)) {
      clearTimeout(this.onceTimer);
    }

    if (["all", "repeat"].includes(type)) {
      clearInterval(this.repeatTimer);
    }

    return this;
  }

  once(event: ITimerActions, delay: number = 0) {
    clearTimeout(this.onceTimer);

    const subscriptions = this.events[event];

    if (subscriptions && subscriptions.length) {
      this.onceTimer = setTimeout(() => {
        subscriptions.forEach(cb => cb(event));
      }, delay);
    }

    return this;
  }

  repeat(event: ITimerActions, delay: number = 1000) {
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
