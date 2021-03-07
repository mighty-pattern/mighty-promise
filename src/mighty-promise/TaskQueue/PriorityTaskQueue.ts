import { PriorityQueue } from "../../data-structure/PriorityQueue";
import { ErrorHandler } from "./ErrorHandler";
import { ITask } from "./ITask";
import { TaskQueue } from "./TaskQueue";

export class PriorityTaskQueue<T extends ITask> extends TaskQueue<T> {
  constructor({
    compare,
    maxParallelNum,
    taskInterval,
    onError,
  }: {
    compare: (a: T, b: T) => number;
    maxParallelNum?: number;
    taskInterval?: number | null;
    onError?: ErrorHandler;
  }) {
    super({ onError, taskInterval, maxParallelNum });
    this.queue = new PriorityQueue<T>(compare);
  }

  push(task: T) {
    super.push(task);
  }
}
