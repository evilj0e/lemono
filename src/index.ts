import { app, Menu, Tray, Notification } from "electron";

import Timer from "./timer";

import { ICONS, PERIODS, TIMINGS, NOTIFICATIONS } from "./constants";

import { ITime } from "./index.types";

class Lemono {
  private time: number = 0;
  private state: boolean = false;
  private periodIndex = 0;
  private timer: Timer;
  private tray: Electron.Tray;

  constructor() {
    this.tray = new Tray(ICONS.default);
    this.initTimer();
    this.renderMenu();
  }

  get currentPeriod(): ITime {
    return PERIODS[this.periodIndex];
  }

  get currentDelay(): number {
    return TIMINGS[this.currentPeriod] * 60 || 0;
  }

  get menu(): Electron.MenuItemConstructorOptions[] {
    const isRunning = this.state;
    const isInitialState = !this.state && !this.periodIndex && !this.time;
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

    if (isRunning) {
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
    if (!this.state) {
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

  initTimer() {
    this.timer = new Timer();

    this.timer
      .on("start", this.onPeriodEnd.bind(this))
      .on("stop", this.onPeriodEnd.bind(this))
      .on("skip", this.onPeriodEnd.bind(this))
      .on("update", this.onUpdate.bind(this));
  }

  renderTray() {
    this.tray.setImage(
      this.currentPeriod ? ICONS[this.currentPeriod] : ICONS.default
    );
  }

  renderMenu() {
    const menu = Menu.buildFromTemplate(this.menu);

    this.tray.setContextMenu(menu);
  }

  renderTitle() {
    this.tray.setTitle(this.title);
  }

  renderNotification() {
    new Notification(this.notificationTitle).show();
  }

  updateTime() {
    this.time -= 1;
  }

  onPeriodEnd() {
    this.timer.stop("all");

    this.state = false;
    this.time = 0;

    this.periodIndex++;

    this.renderTray();
    this.renderMenu();
    this.renderTitle();
    this.renderNotification();
  }

  onUpdate() {
    this.updateTime();
    this.renderTitle();
  }

  start() {
    if (!this.time) {
      this.time = this.currentDelay;
    }

    this.state = true;
    this.timer
      .stop("all")
      .repeat("update", 1000)
      .once("start", (this.time + 1) * 1000);

    this.renderTray();
    this.renderMenu();
  }

  stop() {
    this.state = false;
    this.timer.stop("all");

    this.renderTray();
    this.renderMenu();
  }

  skip() {
    this.onPeriodEnd();
    this.start();
  }

  resume() {
    this.start();

    this.renderTray();
    this.renderMenu();
  }

  quit() {
    app.quit();
  }
}

app.dock.hide();
app.on("ready", () => {
  new Lemono();
});
