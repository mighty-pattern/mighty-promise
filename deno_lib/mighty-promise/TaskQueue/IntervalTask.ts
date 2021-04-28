import { TaskQueue } from "./TaskQueue.ts";

export class IntervalTask<T> {
  private queue: TaskQueue<T>;
  private _stopped = true;
  private _latestValue?: T;
  constructor(private task: () => T, interval: number) {
    this.queue = new TaskQueue({ maxParallelNum: 1, taskInterval: interval });
  }

  start() {
    this._stopped = false;
    this.loop(this._latestValue);
  }

  private loop = (value: T | undefined) => {
    if (this._stopped) {
      return;
    }

    this._latestValue = value;
    this.queue.push(this.task).then(this.loop);
  };

  stop() {
    this.queue.pause();
    this._stopped = true;
  }

  get stopped() {
    return this._stopped;
  }

  get running() {
    return !this._stopped;
  }

  get latestValue() {
    return this._latestValue;
  }

  destroy() {
    this.stop();
    this.queue.destroy();
    this._latestValue = undefined;
  }
}
