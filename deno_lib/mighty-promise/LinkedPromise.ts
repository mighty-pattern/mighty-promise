import { LinkedList } from "../data-structure/index.ts";
import { delay } from "../utils/index.ts";

type DoneFunction = () => void;
interface PromiseItem {
  promise: Promise<DoneFunction>;
  resolve: (done: DoneFunction) => void;
  reject: () => void;
}

export class LinkedPromise {
  private list: LinkedList<PromiseItem> = new LinkedList();
  private running = false;
  private paused = false;
  pushTask(): Promise<DoneFunction> {
    const promiseItem = createPromiseItem();
    this.list.push(promiseItem);
    this.start();
    return promiseItem.promise;
  }

  pushTaskFront(): Promise<DoneFunction> {
    const promiseItem = createPromiseItem();
    this.list.pushFront(promiseItem);
    this.start();
    return promiseItem.promise;
  }

  pause() {
    this.paused = true;
  }

  start() {
    this._run();
  }

  private async _run() {
    this.paused = false;
    if (this.running) {
      return;
    }

    this.running = true;
    while (this.list.size) {
      if (this.paused) {
        this.running = false;
        return;
      }

      const front = this.list.popFront()!;
      await new Promise((r) => front.resolve(r as DoneFunction));
    }
  }

  destroy() {
    this.list.clear();
    this.paused = true;
  }
}

function createPromiseItem(): PromiseItem {
  let resolve: (done: DoneFunction) => void;
  let reject: () => void;
  return {
    promise: new Promise((_resolve, _reject) => {
      reject = _reject;
      resolve = _resolve;
    }),
    resolve: resolve!,
    reject: reject!,
  };
}
