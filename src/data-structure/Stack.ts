import { LinkedList } from "./LinkedList";

export class Stack<T> {
  private stack: LinkedList<T> = new LinkedList();
  push(v: T) {
    this.stack.push(v);
  }

  pop(): T | undefined {
    return this.stack.pop();
  }

  top(): T | undefined {
    return this.stack.tail;
  }

  get size() {
    return this.stack.size;
  }
}
