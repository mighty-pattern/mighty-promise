import { Queue } from "../data-structure/Queue";
import { delay } from "../utils";

type Task = () => any;
export class TaskQueue {
  private readonly queue = new Queue<Task>();
  private workers: TaskWorker[] = [];
  private maxParallelNum = 1;
  private taskInterval = 0;
  constructor({
    maxParallelNum = 1,
    taskInterval = 0,
  }: {
    maxParallelNum?: number;
    taskInterval?: number;
  } = {}) {
    this.maxParallelNum = Math.max(maxParallelNum, 1);
    this.taskInterval = taskInterval;
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
      this.workers.push(new TaskWorker(this.queue, this.taskInterval));
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
  constructor(private queue: Queue<Task>, private interval: number) {}
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
      setTimeout(() => {
        throw e;
      });
    }
  }

  get busy() {
    return this._busy;
  }
}
