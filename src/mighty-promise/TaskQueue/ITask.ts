export interface ITask {
  callback: () => void | Promise<void>;
}
