import { ProgressiveOptions, ProgressiveReturn } from "./type.ts";
import { progressiveGenerate } from "./generator.ts";

export function map<TInput = unknown, TResponse = unknown>(
  arr: TInput[],
  callback: (value: TInput, index: number, arr: TInput[]) => TResponse,
  options: ProgressiveOptions = {}
): ProgressiveReturn<TResponse[]> {
  arr = [...arr];

  function* iter() {
    for (let i = 0; i < arr.length; i++) {
      yield callback(arr[i], i, arr);
    }
  }

  return progressiveGenerate(iter(), options);
}
