import { ProgressiveOptions, ProgressiveReturn } from "./type.ts";
import { delay } from "../../utils/delay.ts";
import { awaitIdle } from "../../utils/requestIdleCallback.ts";

export function progressiveGenerate<T>(
  generator: Generator<T>,
  {
    maxExecutionDuration = 2,
    minInterval = 0,
    ignoreOutput = false,
    useIdleCallback = false,
  }: ProgressiveOptions & { ignoreOutput?: boolean } = {}
): ProgressiveReturn<T[]> {
  let done = false;
  const run = async () => {
    const ans: T[] = [];
    let startTime = Date.now();
    for (const value of generator) {
      !ignoreOutput && ans.push(await value);
      if (Date.now() >= startTime + maxExecutionDuration) {
        await delay(minInterval);
        if (useIdleCallback) {
          await awaitIdle();
        }
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
