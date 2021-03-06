import { Heap } from "./Heap";

export class PriorityQueue<T extends {}> {
  private heap: Heap<T>;
  private set: Set<T> = new Set();
  constructor(compare: (a: T, b: T) => number) {
    this.heap = new Heap({ compare });
  }

  push(item: T) {
    this.set.add(item);
    this.heap.push(item);
  }

  pop(): T | undefined {
    const ans = this.heap.pop();
    ans && this.set.delete(ans);
    return ans;
  }

  get size() {
    return this.heap.size;
  }

  get empty() {
    return this.heap.empty;
  }

  remove(item: T) {
    this.heap.remove(item);
    this.set.delete(item);
  }

  has(item: T) {
    return this.set.has(item);
  }

  clear() {
    this.set.clear();
    this.heap.clear();
  }
}
