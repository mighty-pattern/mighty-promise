import { FRAME, MINUTE } from "../const.ts";
import { TimeoutError } from "../error/index.ts";
import { delay } from "./delay.ts";

export async function waitFor({
  condition,
  interval = FRAME,
  timeout = MINUTE,
}: {
  condition: () => boolean | Promise<boolean>;
  interval?: number;
  timeout?: number;
}): Promise<void> {
  const startTime = +new Date();
  while (!(await condition())) {
    if (+new Date() - startTime > timeout) {
      throw new TimeoutError();
    }

    await delay(interval);
  }
}
