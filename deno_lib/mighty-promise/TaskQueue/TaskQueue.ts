import { IQueue } from "../../data-structure/index.ts";
import { Queue } from "../../data-structure/Queue.ts";
import { ErrorHandler, DefaultErrorHandler } from "./ErrorHandler.ts";
import { IInnerTask, ITask } from "./ITask.ts";
import { TaskWorker } from "./TaskWorker.ts";

export class TaskQueue<T> {
  protected queue: IQueue<IInnerTask<T>>;
  private workers: TaskWorker[] = [];
  private maxParallelNum = 1;
  private taskInterval: number | null = 0;
  private onError: ErrorHandler;
  constructor({
    maxParallelNum = 1,
    taskInterval = 0,
    onError = DefaultErrorHandler,
  }: {
    maxParallelNum?: number;
    taskInterval?: number | null;
    onError?: ErrorHandler;
  } = {}) {
    this.queue = new Queue<IInnerTask<T>>();
    this.maxParallelNum = Math.max(maxParallelNum, 1);
    this.taskInterval = taskInterval;
    this.onError = onError;
  }

  push(task: (() => T) | ITask<T>) {
    let resolve!: (value: T) => void;
    let reject!: (err?: any) => void;
    const promise = new Promise<T>((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    });

    if (task instanceof Function) {
      this.queue.push({ callback: task, reject, resolve });
    } else {
      this.queue.push({ ...task, resolve, reject });
    }

    this.start();
    return promise;
  }

  start(): void {
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
