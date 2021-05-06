import { IQueue } from "../../../data-structure/IQueue";
import { delay } from "../../../utils";
import { ErrorHandler } from "../ErrorHandler";
import { IInnerTask } from "../ITask";
import { BaseTaskWorker } from "./BaseTaskWorker";

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
