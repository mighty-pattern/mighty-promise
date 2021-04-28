import { ProgressiveOptions, ProgressiveReturn } from "./type.ts";
import { delay } from "../../utils/delay.ts";

export function progressiveGenerate<T>(
  generator: Generator<T>,
  {
    maxExecutionTime = 2,
    minInterval = 16,
    ignoreOutput = false,
  }: ProgressiveOptions & { ignoreOutput?: boolean } = {}
): ProgressiveReturn<T[]> {
  let done = false;
  const run = async () => {
    const ans: T[] = [];
    let startTime = Date.now();
    for (const value of generator) {
      !ignoreOutput && ans.push(value);
      if (Date.now() >= startTime + maxExecutionTime) {
        await delay(minInterval);
        startTime = Date.now();
      }

      if (done) {
        return ans;
      }
    }

    return ans;
  };

  return {
    promise: run(),
    abort: () => {
      generator.return(undefined);
      done = true;
    },
  };
}
