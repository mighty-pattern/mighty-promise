import { FRAME, MINUTE } from "../const";
import { TimeoutError } from "../error";
import { delay } from "./delay";

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
