import { TimeoutError } from "../error";
import { delay } from "./delay";

export function timeout(promise: Promise<void>, ms: number): Promise<void> {
  return Promise.race([promise, delay(ms)]);
}

export function throwIfTimeout<T>(
  promise: Promise<T>,
  ms: number,
  msg?: string
): Promise<T> {
  let done = false;
  return Promise.race([
    promise.then(() => {
      done = true;
    }),
    delay(ms).then(() => {
      if (!done) {
        throw new TimeoutError(msg);
      }
    }) as any,
  ]);
}
