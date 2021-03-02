import { Queue } from "../data-structure/Queue";
import { delay } from "../utils";

type Task = () => any;
type ErrorHandler = (error?: any) => void;
export class TaskQueue {
  private readonly queue = new Queue<Task>();
  private workers: TaskWorker[] = [];
  private maxParallelNum = 1;
  private taskInterval = 0;
  private onError: ErrorHandler;
  constructor({
    maxParallelNum = 1,
    taskInterval = 0,
    onError = (error) => {
      throw error;
    },
  }: {
    maxParallelNum?: number;
    taskInterval?: number;
    onError?: ErrorHandler;
  } = {}) {
    this.maxParallelNum = Math.max(maxParallelNum, 1);
    this.taskInterval = taskInterval;
    this.onError = onError;
  }

  push(task: Task) {
    this.queue.push(task);
    this.start();
  }

  start() {
    let targetParallelNum = Math.min(
      this.queue.size + this.runningNum,
      this.maxParallelNum
    );
    while (this.workers.length < targetParallelNum) {
      this.workers.push(
        new TaskWorker(this.queue, this.taskInterval, this.onError)
      );
    }

    for (const worker of this.workers) {
      if (targetParallelNum === 0) {
        break;
      }

      targetParallelNum -= 1;
      if (worker.busy) {
        continue;
      }

      worker.run();
    }
  }

  get runningNum() {
    return this.workers.reduce((l, r) => l + (r.busy ? 1 : 0), 0);
  }

  pause() {
    this.workers.forEach((x) => x.destroy());
    this.workers = [];
  }

  destroy() {
    this.pause();
    this.queue.clear();
  }
}

class TaskWorker {
  private _busy: boolean = false;
  private _destroyed: boolean = false;
  constructor(
    private queue: Queue<Task>,
    private interval: number,
    private onError: ErrorHandler
  ) {}
  async run() {
    if (this._busy) {
      return;
    }

    this._busy = true;
    try {
      while (this.queue.size && !this._destroyed) {
        await this.runTask(this.queue.pop());
        await delay(this.interval);
      }
    } finally {
      this._busy = false;
    }
  }

  destroy() {
    this._destroyed = true;
  }

  private async runTask(task?: Task) {
    if (!task) {
      return;
    }

    try {
      await task();
    } catch (e) {
      this.onError(e);
    }
  }

  get busy() {
    return this._busy;
  }
}
