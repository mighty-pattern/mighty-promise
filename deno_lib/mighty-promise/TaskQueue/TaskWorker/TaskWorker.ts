import { IQueue } from "../../../data-structure/IQueue.ts";
import { delay } from "../../../utils/index.ts";
import { ErrorHandler } from "../ErrorHandler.ts";
import { IInnerTask } from "../ITask.ts";
import { BaseTaskWorker } from "./BaseTaskWorker.ts";

export class TaskWorker extends BaseTaskWorker {
  private interval: number | null = null;
  constructor(
    queue: IQueue<IInnerTask<any>>,
    onError: ErrorHandler,
    interval: number | null
  ) {
    super(queue, onError);
    this.interval = interval;
  }

  protected postExecute() {
    if (this.interval == null) {
      return undefined;
    }

    return delay(this.interval);
  }
}
