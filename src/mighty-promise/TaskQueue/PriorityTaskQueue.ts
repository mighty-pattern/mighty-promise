import { PriorityQueue } from "../../data-structure/PriorityQueue";
import { ErrorHandler } from "./ErrorHandler";
import { IInnerTask, ITask } from "./ITask";
import { TaskQueue } from "./TaskQueue";

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
