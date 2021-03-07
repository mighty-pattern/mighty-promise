import { IQueue } from "../../data-structure";
import { Queue } from "../../data-structure/Queue";
import { ErrorHandler, DefaultErrorHandler } from "./ErrorHandler";
import { ITask } from "./ITask";
import { TaskWorker } from "./TaskWorker";

export class TaskQueue<T extends ITask> {
  protected queue: IQueue<ITask>;
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
    this.queue = new Queue<ITask>();
    this.maxParallelNum = Math.max(maxParallelNum, 1);
    this.taskInterval = taskInterval;
    this.onError = onError;
  }

  push(task: (() => void) | T) {
    if (task instanceof Function) {
      this.queue.push({ callback: task });
    } else {
      this.queue.push(task);
    }

    this.start();
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
