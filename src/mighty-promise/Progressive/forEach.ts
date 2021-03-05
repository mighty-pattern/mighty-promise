import { progressiveGenerate } from "./generator";
import { ProgressiveOptions } from "./type";

export function forEach<TInput = unknown, TResponse = unknown>(
  arr: TInput[],
  callback: (value: TInput, index: number, arr: TInput[]) => TResponse,
  options: ProgressiveOptions = {}
) {
  arr = [...arr];

  function* iter() {
    for (let i = 0; i < arr.length; i++) {
      yield callback(arr[i], i, arr);
    }
  }

  return progressiveGenerate(iter(), { ...options, ignoreOutput: true });
}
