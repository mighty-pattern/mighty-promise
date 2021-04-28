import { TimeoutError } from "../error/index.ts";
import { delay } from "./delay.ts";

export function throwIfTimeout<T>(
  promise: Promise<T>,
  ms?: number,
  msg?: string
): Promise<T> {
  if (ms == null) {
    return promise;
  }

  let done = false;
  promise.then(() => {
    done = true;
  });
  return Promise.race([
    promise,
    delay(ms).then(() => {
      if (!done) {
        throw new TimeoutError(msg);
      }
    }) as any,
  ]);
}
