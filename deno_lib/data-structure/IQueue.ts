export interface IQueue<T> {
  push(v: T): void;
  pop(): T | undefined;
  readonly size: number;
  clear(): void;
}
