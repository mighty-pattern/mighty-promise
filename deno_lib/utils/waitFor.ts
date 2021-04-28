import { FRAME, MINUTE } from "../const.ts";
import { TimeoutError } from "../error/index.ts";
import { delay } from "./delay.ts";

export async function waitFor({
  condition,
  interval = FRAME,
  timeout = MINUTE,
}: {
  condition: () => boolean;
  interval?: number;
  timeout?: number;
}): Promise<void> {
  const startTime = +new Date();
  while (!condition()) {
    if (+new Date() - startTime > timeout) {
      throw new TimeoutError();
    }

    await delay(interval);
  }
}
