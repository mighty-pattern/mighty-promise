import { TaskQueue } from "../../src/mighty-promise/TaskQueue";
import { DefaultErrorHandler } from "../../src/mighty-promise/TaskQueue/ErrorHandler";
import { delay } from "../../src/utils";

describe("TaskQueue", () => {
  describe("running num", () => {
    it("equals to 0 if no task is pending", () => {
      const queue = new TaskQueue();
      expect(queue.runningNum).toBe(0);
    });

    it("inc as tasks are piling up", () => {
      const queue = new TaskQueue({ maxParallelNum: 10 });
      for (let i = 0; i < 10; i++) {
        expect(queue.runningNum).toBe(i);
        queue.push(() => {});
      }
    });

    it("dec after task done", async () => {
      const queue = new TaskQueue({ maxParallelNum: 10 });
      for (let i = 0; i < 4; i++) {
        expect(queue.runningNum).toBe(i);
        queue.push(() => delay(i * 200));
      }

      for (let i = 0; i < 4; i++) {
        await delay(100);
        expect(queue.runningNum).toBe(3 - i);
        await delay(100);
      }
    });

    it("equals to 2 if only two task are in queue", async () => {
      const queue = new TaskQueue({ maxParallelNum: 10 });
      for (let i = 0; i < 10; i++) {
        queue.push(() => {});
      }

      await delay(10);
      queue.push(() => {});
      queue.push(() => {});
      expect(queue.runningNum).toBe(2);
    });

    it("cannot exceed maxParallelNum", () => {
      const queue = new TaskQueue({ maxParallelNum: 4 });
      for (let i = 0; i < 10; i++) {
        expect(queue.runningNum).toBe(Math.min(i, 4));
        queue.push(() => {});
      }
    });
  });

  describe("task execution", () => {
    it("will not start before previous tasks are done", async () => {
      const queue = new TaskQueue({ maxParallelNum: 1 });
      let done = false;
      queue.push(() => delay(200));
      queue.push(() => delay(200));
      queue.push(() => {
        done = true;
      });
      expect(done).toBeFalsy();
      await delay(100);
      expect(done).toBeFalsy();
      await delay(200);
      expect(done).toBeFalsy();
      await delay(200);
      expect(done).toBeTruthy();
    });

    it("can be paused and resumed", async () => {
      const queue = new TaskQueue({ maxParallelNum: 1 });
      let count = 0;
      queue.push(() => delay(100));
      queue.push(() => {
        count++;
      });
      queue.push(() => delay(100));
      queue.push(() => {
        count++;
      });
      queue.push(() => delay(100));
      queue.push(() => {
        count++;
      });

      expect(count).toBe(0);
      await delay(150);
      expect(count).toBe(1);

      queue.pause();
      await delay(200);

      expect(count).toBe(1);
      queue.start();
      await delay(100);
      expect(count).toBe(2);
      await delay(100);
      expect(count).toBe(3);
    });

    it("can be destroyed", async () => {
      const queue = new TaskQueue({ maxParallelNum: 1 });
      let count = 0;
      for (let i = 0; i < 10; i++) {
        queue.push(() => {
          count++;
        });
        queue.push(() => delay(200));
      }

      await delay(100);
      expect(count).toBe(1);
      await delay(200);
      expect(count).toBe(2);
      queue.destroy();
      await delay(2000);
      expect(count).toBe(2);
    });

    it("is with interval", async () => {
      const queue = new TaskQueue({ maxParallelNum: 1, taskInterval: 20 });
      let count = 0;
      for (let i = 0; i < 10; i++) {
        queue.push(() => {
          count += 1;
        });
      }

      await delay(10);
      for (let i = 1; i <= 10; i++) {
        expect(i).toBe(count);
        await delay(20);
      }
    });

    test("return task promise after push", async () => {
      const queue = new TaskQueue({ maxParallelNum: 1, taskInterval: 10 });
      let count = 0;
      let resolved = 0;
      for (let i = 0; i < 10; i++) {
        const promise = queue.push(async () => {
          count += 1;
        });
        promise.then(() => {
          expect(count).toBe(1 + i);
          resolved++;
        });
      }

      await delay(110);
      expect(resolved).toBe(10);
    });

    it("will execute task synchronously when interval is null", async () => {
      const queue = new TaskQueue({ maxParallelNum: 1, taskInterval: null });
      let count = 0;
      for (let i = 0; i < 10; i++) {
        queue.push(() => {
          count += 1;
        });
      }

      await delay(0);
      expect(count).toBe(10);
    });

    it("will not throw if task failed and onError is configured", async () => {
      let caught = false;
      const queue = new TaskQueue({
        maxParallelNum: 1,
        taskInterval: 20,
        onError: (e) => {
          caught = true;
        },
      });
      let executed = false;
      let caughtInPromise = false;
      queue
        .push(() => {
          throw new Error();
        })
        .catch((e) => {
          caughtInPromise = true;
        });

      queue.push(() => {
        executed = true;
      });

      await delay(100);
      expect(executed).toBeTruthy();
      expect(caught).toBeTruthy();
      expect(caughtInPromise).toBeTruthy();
    });

    it("can use idleWorker", async () => {
      const queue = new TaskQueue({
        maxParallelNum: 1,
        useIdleWorker: true,
      });

      let v = 0;
      for (let i = 0; i < 20; i++) {
        queue.push({
          callback: () => {
            v++;
          },
        });
      }

      await delay(1);
      expect(v).toBe(20);
    });

    it("can use idleWorker for async task", async () => {
      const queue = new TaskQueue({
        maxParallelNum: 1,
        useIdleWorker: true,
      });

      let v = 0;
      for (let i = 0; i < 5; i++) {
        queue.push({
          callback: async () => {
            v++;
            await delay(10);
          },
        });
      }

      await delay(1);
      expect(v).toBe(1);
      await delay(80);
      expect(v).toBe(5);
    });

    it.skip("will throw if task failed and onError is not configured", async () => {
      const queue = new TaskQueue({
        maxParallelNum: 1,
        taskInterval: 20,
      });
      queue.push(() => {
        throw new Error();
      });
      await delay(10);
    });
  });

  describe("DefaultErrorHandler", () => {
    it("wiil throw", () => {
      const error = new Error();
      expect(() => {
        DefaultErrorHandler(error);
      }).toThrow(error);
    });
  });
});
