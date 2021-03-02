import { TimeoutError } from "../../src/error";
import { AsyncQueue } from "../../src/mighty-promise";
import { delay } from "../../src/utils";

describe("AsyncQueue", () => {
  it("acts as normal queue if queue is not empty", async () => {
    const queue = new AsyncQueue<number>();
    queue.push(0);
    expect(await queue.pop()).toBe(0);
    queue.push(1);
    queue.push(2);
    queue.push(3);
    queue.push(4);
    expect(await queue.pop()).toBe(1);
    expect(await queue.pop()).toBe(2);
    expect(await queue.pop()).toBe(3);
    expect(await queue.pop()).toBe(4);
  });

  it("throw error if pop timeout", async () => {
    const queue = new AsyncQueue<number>();
    await expect(async () => {
      await queue.pop(10);
    }).rejects.toThrow(TimeoutError);
  });

  it("will not throw if get result in time", async () => {
    const queue = new AsyncQueue<number>();
    let done = false;
    (async () => {
      expect(await queue.pop(100)).toBe(0);
      done = true;
    })();
    await delay(10);
    expect(done).toBeFalsy();
    queue.push(0);
    await delay(10);
    expect(done).toBeTruthy();
  });

  it("can chain pop invocation in order", async () => {
    const queue = new AsyncQueue<number>();
    const promises = [
      (async () => {
        expect(await queue.pop(100)).toBe(1);
      })(),
      (async () => {
        expect(await queue.pop(100)).toBe(2);
      })(),
      (async () => {
        expect(await queue.pop(100)).toBe(3);
      })(),
    ];

    queue.push(1);
    queue.push(2);
    queue.push(3);
    await Promise.all(promises);
  });

  it("can be cleared", async () => {
    const queue = new AsyncQueue<number>();
    queue.push(2);
    expect(queue.size).toBe(1);
    queue.push(4);
    expect(queue.size).toBe(2);
    queue.clear();
    expect(queue.size).toBe(0);
  });

  it("will not execute out-dated pop after clear", async () => {
    const queue = new AsyncQueue<number>();
    let executed = false;
    queue.pop().then((x) => {
      executed = true;
    });
    queue.clear();
    queue.push(2);
    await delay(10);
    expect(executed).toBeFalsy();
  });
});
