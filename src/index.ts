import { app, Menu, Tray, Notification, BrowserWindow } from "electron";

import Timer from "./timer";

import { ICONS, PERIODS, TIMINGS, NOTIFICATIONS } from "./constants";

import { Period } from "./index.types";
import { TimerAction, TimerType } from "./timer.types";

class Lemono {
  private time: number = 0;
  private isRunning: boolean = false;
  private periodIndex = 0;
  private timer: Timer;
  private tray: Electron.Tray;

  constructor() {
    this.tray = new Tray(ICONS.default);
    this.initTimer();
    this.renderMenu();
  }

  get currentPeriod(): Period {
    return PERIODS[this.periodIndex];
  }

  get currentDelay(): number {
    return TIMINGS[this.currentPeriod] * 60 || 0;
  }

  get menu(): Electron.MenuItemConstructorOptions[] {
    const isInitialState = !this.isRunning && !this.periodIndex && !this.time;
    const isFinished = this.currentPeriod === undefined;

    if (isFinished) {
      return [{ label: "Quit", click: () => this.quit() }];
    }

    let actions: Electron.MenuItemConstructorOptions[] = [
      {
        label: `Start ${this.currentPeriod}`,
        click: () => this.start()
      },
      { label: "Stop", click: () => this.stop() }
    ];

    if (this.isRunning) {
      actions = [
        {
          label: `Skip ${this.currentPeriod}`,
          click: () => this.skip()
        },
        { label: "Stop", click: () => this.stop() }
      ];
    }

    if (isInitialState) {
      actions = [{ label: "Run", click: () => this.start() }];
    }

    return actions.concat(
      {
        type: "separator"
      },
      { label: "Quit", click: () => this.quit() }
    );
  }

  get title(): string {
    if (!this.isRunning) {
      return "";
    }

    const seconds = this.time;
    const mm = Math.floor(seconds / 60);
    const ss = seconds - mm * 60;
    const format = (time: number) => (time < 10 ? `0${time}` : `${time}`);

    return ` ${format(mm)}:${format(ss)}`;
  }

  get notificationTitle(): Electron.NotificationConstructorOptions {
    return NOTIFICATIONS[this.currentPeriod || "default"];
  }

  initTimer(): void {
    this.timer = new Timer();

    this.timer
      .on(TimerAction.Start, this.onPeriodEnd.bind(this))
      .on(TimerAction.Stop, this.onPeriodEnd.bind(this))
      .on(TimerAction.Skip, this.onPeriodEnd.bind(this))
      .on(TimerAction.Update, this.onUpdate.bind(this));
  }

  renderTray(): void {
    this.tray.setImage(
      this.currentPeriod ? ICONS[this.currentPeriod] : ICONS.default
    );
  }

  renderMenu(): void {
    const menu = Menu.buildFromTemplate(this.menu);

    this.tray.setContextMenu(menu);
  }

  renderTitle(): void {
    switch (process.platform) {
      case "win32":
        return this.tray.setToolTip(this.title);

      case "darwin":
        return this.tray.setTitle(this.title);
    }
  }

  renderNotification(): void {
    new Notification(this.notificationTitle).show();
  }

  updateTime(): void {
    this.time -= 1;
  }

  onPeriodEnd(): void {
    this.timer.stop(TimerType.All);

    this.isRunning = false;
    this.time = 0;

    this.periodIndex++;

    this.renderTray();
    this.renderMenu();
    this.renderTitle();
    this.renderNotification();
  }

  onUpdate(): void {
    this.updateTime();
    this.renderTitle();
  }

  start(): void {
    if (!this.time) {
      this.time = this.currentDelay;
    }

    this.isRunning = true;
    this.timer
      .stop(TimerType.All)
      .repeat(TimerAction.Update, 1000)
      .once(TimerAction.Start, (this.time + 1) * 1000);

    this.renderTray();
    this.renderMenu();
  }

  stop(): void {
    this.isRunning = false;
    this.timer.stop(TimerType.All);

    this.renderTray();
    this.renderMenu();
  }

  skip(): void {
    this.onPeriodEnd();
    this.start();
  }

  resume(): void {
    this.start();

    this.renderTray();
    this.renderMenu();
  }

  quit(): void {
    app.quit();
  }
}

app.on("ready", () => {
  switch (process.platform) {
    case "win32": {
      new BrowserWindow({
        skipTaskbar: true,
        show: false
      }).hide();

      break;
    }
    case "darwin": {
      app.dock.hide();

      break;
    }
  }

  new Lemono();
});
