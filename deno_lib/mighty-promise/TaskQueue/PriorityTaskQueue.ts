import { PriorityQueue } from "../../data-structure/PriorityQueue.ts";
import { ErrorHandler } from "./ErrorHandler.ts";
import { IInnerTask, ITask } from "./ITask.ts";
import { TaskQueue } from "./TaskQueue.ts";

export class PriorityTaskQueue<
  Task extends ITask<TaskReturn>,
  TaskReturn = void
> extends TaskQueue<TaskReturn> {
  constructor({
    compare,
    maxParallelNum,
    taskInterval,
    onError,
  }: {
    compare: (a: Task, b: Task) => number;
    maxParallelNum?: number;
    taskInterval?: number | null;
    onError?: ErrorHandler;
  }) {
    super({ onError, taskInterval, maxParallelNum });
    this.queue = new PriorityQueue<
      Task & Pick<IInnerTask<TaskReturn>, "reject" | "resolve">
    >(compare);
  }

  push(task: Task) {
    return super.push(task);
  }
}
