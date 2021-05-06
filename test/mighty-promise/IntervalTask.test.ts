import { IntervalTask } from "../../src/mighty-promise/TaskQueue/IntervalTask";
import { delay } from "../../src/utils";

describe("IntervalTask", () => {
  it("get state", async () => {
    const interval = new IntervalTask(() => {}, 20);

    expect(interval.running).toBeFalsy();
    expect(interval.stopped).toBeTruthy();
    interval.start();
    expect(interval.running).toBeTruthy();
    expect(interval.stopped).toBeFalsy();
    interval.stop();
    expect(interval.running).toBeFalsy();
    expect(interval.stopped).toBeTruthy();
    await delay(10);
    interval.start();
    expect(interval.running).toBeTruthy();
    expect(interval.stopped).toBeFalsy();
    interval.destroy();
    expect(interval.running).toBeFalsy();
    expect(interval.stopped).toBeTruthy();
  });

  it("run task with interval", async () => {
    let count = 0;
    const interval = new IntervalTask(() => {
      count += 1;
    }, 40);

    for (let j = 0; j < 5; j++) {
      count = 0;
      interval.start();
      await delay(20);
      for (let i = 1; i < 5; i++) {
        expect(count).toBe(i);
        await delay(40);
      }

      interval.stop();
      await delay(100);
      expect(count).toBe(5);
    }
  });

  it("get latest returned value", async () => {
    let count = 0;
    const interval = new IntervalTask(() => {
      count += 1;
      return count;
    }, 20);

    interval.start();
    await delay(10);
    for (let i = 1; i < 5; i++) {
      expect(interval.latestValue).toBe(i);
      await delay(20);
    }

    interval.stop();
    await delay(50);
    expect(interval.latestValue).toBe(5);
  });
});
