export interface ProgressiveOptions {
  minInterval?: number;
  maxExecutionDuration?: number;
  useIdleCallback?: boolean;
}

export interface ProgressiveReturn<T> {
  promise: Promise<T>;
  abort: () => void;
}
