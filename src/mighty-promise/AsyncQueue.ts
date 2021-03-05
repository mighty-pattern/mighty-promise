import { Queue } from "../data-structure/Queue";
import { delay } from "../utils";
import { Lock } from "./Lock";

export class AsyncQueue<T> {
  private queue: Queue<T> = new Queue();
  private lock: Lock = new Lock();
  private pushRelease?: () => void;
  constructor() {
    this.setPushRelease();
  }

  private setPushRelease() {
    this.lock.acquireImmediately().then((r) => {
      this.pushRelease = r;
    });
  }

  async pop(timeout?: number): Promise<T> {
    if (this.queue.size) {
      return this.queue.pop()!;
    }

    const popRelease = await this.lock.acquire(timeout);
    try {
      return this.queue.pop()!;
    } finally {
      if (this.queue.size === 0) {
        this.pushRelease = popRelease;
      } else {
        popRelease();
      }
    }
  }

  push(v: T) {
    this._push(v);
  }

  private async _push(v: T) {
    this.queue.push(v);
    if (!this.pushRelease) {
      await delay(0);
    }

    this.pushRelease?.call(this);
  }

  get size() {
    return this.queue.size;
  }

  clear() {
    this.queue.clear();
    this.lock = new Lock();
    this.pushRelease = undefined;
    this.setPushRelease();
  }
}
