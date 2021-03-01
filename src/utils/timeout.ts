import { delay } from "./delay";

export function timeout(promise: Promise<void>, ms: number): Promise<void> {
  return Promise.race([promise, delay(ms)]);
}
