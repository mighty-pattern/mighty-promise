import { IQueue } from "../../data-structure";
import { delay } from "../../utils";
import { ITask } from "./ITask";
import { ErrorHandler } from "./ErrorHandler";

export class TaskWorker {
  private _busy: boolean = false;
  private _destroyed: boolean = false;
  constructor(
    private queue: IQueue<ITask>,
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

  private async runTask(task: ITask) {
    try {
      await task.callback();
    } catch (e) {
      this.onError(e);
    }
  }

  get busy() {
    return this._busy;
  }
}
