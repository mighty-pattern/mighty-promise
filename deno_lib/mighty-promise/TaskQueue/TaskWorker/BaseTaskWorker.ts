import { IQueue } from "../../../data-structure/index.ts";
import { ErrorHandler } from "../ErrorHandler.ts";
import { IInnerTask } from "../ITask.ts";

export abstract class BaseTaskWorker {
  private _busy: boolean = false;
  private _destroyed: boolean = false;

  constructor(
    protected queue: IQueue<IInnerTask<any>>,
    protected onError: ErrorHandler
  ) {}

  protected preExecute(): undefined | Promise<void> {
    return;
  }

  protected postExecute(): undefined | Promise<void> {
    return;
  }

  async run() {
    if (this._busy) {
      return;
    }

    this._busy = true;
    try {
      while (this.queue.size && !this._destroyed) {
        const task = this.queue.pop();
        /* istanbul ignore if */
        if (!task) {
          continue;
        }

        const promise = this.preExecute();
        promise && (await promise);
        await this.runTask(task);
        const promise_ = this.postExecute();
        promise_ && (await promise_);
      }
    } finally {
      this._busy = false;
    }
  }

  protected async runTask(task: IInnerTask<unknown>) {
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

  destroy() {
    this._destroyed = true;
  }
}
