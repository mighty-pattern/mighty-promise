interface Node<T> {
  next?: Node<T>;
  prev?: Node<T>;
  value: T;
}

export class LinkedList<T> {
  size: number = 0;
  private _head?: Node<T>;
  private _tail?: Node<T>;

  constructor(arr?: Iterable<T>) {
    if (arr && arr[Symbol.iterator]) {
      for (const item of arr) {
        this._push(item);
      }
    }
  }

  push(...items: T[]) {
    for (const item of items) {
      this._push(item);
    }
  }

  get head() {
    return this._head?.value;
  }

  get tail() {
    return this._tail?.value;
  }

  private _push(item: T) {
    this.size += 1;
    if (!this._tail) {
      this._head = this._tail = {
        value: item,
      };
      return;
    }

    const newItem = {
      value: item,
      prev: this._tail,
    };
    this._tail.next = newItem;
    this._tail = newItem;
  }

  pushFront(...items: T[]) {
    for (const item of items) {
      this._pushFront(item);
    }
  }

  private _pushFront(item: T) {
    this.size += 1;
    if (!this._head) {
      this._head = this._tail = {
        value: item,
      };
      return;
    }

    const newItem = {
      value: item,
      next: this._head,
    };
    this._head.prev = newItem;
    this._head = newItem;
  }

  pop(): T | undefined {
    if (!this._tail) {
      return;
    }

    this.size -= 1;
    const last = this._tail;
    this._tail = last.prev;
    this._updateHeadAndTail();
    return last.value;
  }

  popFront(): T | undefined {
    if (!this._head) {
      return;
    }

    this.size -= 1;
    const first = this._head;
    this._head = first.next;
    this._updateHeadAndTail();
    return first.value;
  }

  private _updateHeadAndTail() {
    if (!this._head || !this._tail || this.size === 0) {
      this._head = this._tail = undefined;
      this.size = 0;
      return;
    }

    this._head.prev = undefined;
    this._tail.next = undefined;
  }

  get empty() {
    return this.size === 0;
  }

  clear() {
    this._head = undefined;
    this._tail = undefined;
    this.size = 0;
  }

  *[Symbol.iterator]() {
    if (!this._head) {
      return;
    }

    let node: Node<T> | undefined = this._head;
    while (node) {
      yield node.value;
      node = node.next;
    }
  }

  toArray(): T[] {
    return Array.from(this);
  }
}
