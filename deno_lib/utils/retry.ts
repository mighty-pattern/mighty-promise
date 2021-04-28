import { delay } from "./delay.ts";

export async function retry(
  callback: () => Promise<unknown> | unknown,
  {
    sleepTimeout = 100,
    times = 3,
  }: {
    sleepTimeout?: number;
    times?: number;
  } = {}
) {
  while (times) {
    try {
      await callback();
      break;
    } catch (e) {
      times--;
      await delay(sleepTimeout);
      if (times === 0) {
        throw e;
      }
    }
  }
}
