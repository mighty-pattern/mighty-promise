export interface ProgressiveOptions {
  minInterval?: number;
  maxExecutionTime?: number;
}

export interface ProgressiveReturn<T> {
  promise: Promise<T>;
  abort: () => void;
}
