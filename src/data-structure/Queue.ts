import { IQueue } from "./IQueue";
import { LinkedList } from "./LinkedList";

export class Queue<T> implements IQueue<T> {
  private list: LinkedList<T> = new LinkedList();

  push(item: T) {
    this.list.push(item);
  }

  pop(): T | undefined {
    return this.list.popFront();
  }

  get size() {
    return this.list.size;
  }

  clear() {
    this.list.clear();
  }

  get front() {
    return this.list.head;
  }
}
