export interface ITask<T> {
  callback: () => T;
}

export interface IInnerTask<T> extends ITask<T> {
  resolve: (value: T) => void;
  reject: (err?: any) => void;
}
