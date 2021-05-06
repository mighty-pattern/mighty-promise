import { awaitIdle } from "../../../utils/requestIdleCallback.ts";
import { IInnerTask } from "../ITask.ts";
import { BaseTaskWorker } from "./BaseTaskWorker.ts";

export class IdleWorker extends BaseTaskWorker {
  private remaining = () => 0;
  private estimatedExecutionTime = 1;

  protected preExecute(): Promise<void> | undefined {
    if (this.remaining() >= this.estimatedExecutionTime) {
      return;
    }

    return awaitIdle().then(({ timeRemaining }) => {
      this.remaining = timeRemaining;
    });
  }

  protected async runTask(task: IInnerTask<unknown>) {
    const startTime = Date.now();
    await super.runTask(task);
    const duration = Date.now() - startTime;
    if (duration > this.estimatedExecutionTime) {
      this.estimatedExecutionTime = duration;
    }
  }
}
