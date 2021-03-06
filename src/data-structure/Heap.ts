export class Heap<T> {
  private array: T[] = [];
  private compare: (a: T, b: T) => number;
  constructor({
    compare,
    key,
  }:
    | { compare: (a: T, b: T) => number; key?: undefined }
    | { key: (a: T) => string | number; compare?: undefined }) {
    if (key) {
      compare = (a, b) => (key(a) < key(b) ? -1 : 1);
    }

    this.compare = compare!;
  }

  public push(...arr: T[]) {
    for (const v of arr) {
      this._push(v);
    }
  }

  private _push(v: T) {
    this.array.push(v);
    this._siftUp(this.size - 1);
  }

  private _siftUp(index: number): number {
    if (index === 0 || index >= this.array.length) {
      return index;
    }

    const arr = this.array;
    const compare = this.compare;
    const parent = getParent(index);
    if (compare(arr[parent], arr[index]) > 0) {
      [arr[parent], arr[index]] = [arr[index], arr[parent]];
      return this._siftUp(parent);
    }

    return index;
  }

  public pop(): T | undefined {
    const ans = this.array[0];
    this.array[0] = this.array[this.array.length - 1];
    this.array.pop();
    this._siftDown(0);
    return ans;
  }

  private _siftDown(index: number): void {
    if (index >= this.array.length) {
      return;
    }

    const arr = this.array;
    const left = getLeft(index);
    const right = getRight(index);
    if (left >= this.array.length) {
      return;
    }

    let next: number;
    if (right >= this.array.length || this.compare(arr[left], arr[right]) < 0) {
      next = left;
    } else {
      next = right;
    }

    if (this.compare(arr[index], arr[next]) <= 0) {
      return;
    }

    [arr[index], arr[next]] = [arr[next], arr[index]];
    this._siftDown(next);
  }

  /**
   * It takes O(n) time
   * @param v
   */
  public remove(v: T) {
    const index = this.array.indexOf(v);
    if (index === -1) {
      return;
    }

    const arr = this.array;
    const last = arr.length - 1;
    const cmp = this.compare(arr[last], arr[index]);
    [arr[index], arr[last]] = [arr[last], arr[index]];
    arr.pop();
    if (last === index) {
      return;
    }

    if (cmp < 0) {
      this._siftUp(index);
    } else {
      this._siftDown(index);
    }
  }

  *[Symbol.iterator]() {
    while (!this.empty) {
      yield this.pop();
    }
  }

  get size() {
    return this.array.length;
  }

  get empty() {
    return this.size === 0;
  }

  clear() {
    this.array.length = 0;
  }
}

function getParent(index: number) {
  return ((index + 1) >> 1) - 1;
}

function getLeft(index: number) {
  return (index + 1) * 2 - 1;
}

function getRight(index: number) {
  return (index + 1) * 2;
}
