import { delay } from "../../src/utils";
import {
  awaitIdle,
  requestHostIdleCallback,
  cancelHostIdleCallback,
} from "../../src/utils/requestIdleCallback";

describe("requestIdleCallback", () => {
  it("can be await", async () => {
    const start = Date.now();
    await awaitIdle();
    expect(Date.now() - start).toBeLessThan(20);
  });

  it("can be canceled", async () => {
    let done = false;
    const id = requestHostIdleCallback(() => {
      done = true;
    });
    cancelHostIdleCallback(id);
    expect(done).toBeFalsy();
  });

  it("can be executed", async () => {
    let done = false;
    requestHostIdleCallback(() => {
      done = true;
    });
    await delay(20);
    expect(done).toBeTruthy();
  });

  it("can get remaining time", (done) => {
    requestHostIdleCallback(async ({ timeRemaining }) => {
      const start = Date.now();
      const startRemaining = timeRemaining();
      await delay(2);
      const end = Date.now();
      const endRemaining = timeRemaining();
      expect(end - start).toBe(startRemaining - endRemaining);
      done();
    });
  });
});
