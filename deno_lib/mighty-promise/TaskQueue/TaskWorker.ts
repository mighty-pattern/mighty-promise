import { IQueue } from "../../data-structure/index.ts";
import { delay } from "../../utils/index.ts";
import { ErrorHandler } from "./ErrorHandler.ts";
import { IInnerTask } from "./ITask.ts";

export class TaskWorker {
  private _busy: boolean = false;
  private _destroyed: boolean = false;
  constructor(
    private queue: IQueue<IInnerTask<any>>,
    private interval: number | null,
    private onError: ErrorHandler
  ) {}

  async run() {
    if (this._busy) {
      return;
    }

    this._busy = true;
    try {
      while (this.queue.size && !this._destroyed) {
        await this.runTask(this.queue.pop()!);
        if (this.interval != null) {
          await delay(this.interval);
        }
      }
    } finally {
      this._busy = false;
    }
  }

  destroy() {
    this._destroyed = true;
  }

  private async runTask(task: IInnerTask<unknown>) {
    try {
      const res = await task.callback();
      task.resolve(res);
    } catch (e) {
      this.onError(e);
      task.reject(e);
    }
  }

  get busy() {
    return this._busy;
  }
}
