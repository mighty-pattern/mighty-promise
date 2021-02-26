import { TaskQueue } from "../../src/mighty-promise/TaskQueue";
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
        queue.push(() => delay(i * 100));
      }

      for (let i = 0; i < 4; i++) {
        await delay(50);
        expect(queue.runningNum).toBe(3 - i);
        await delay(50);
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
      queue.push(() => delay(20));
      queue.push(() => delay(20));
      queue.push(() => {
        done = true;
      });
      expect(done).toBeFalsy();
      await delay(10);
      expect(done).toBeFalsy();
      await delay(20);
      expect(done).toBeFalsy();
      await delay(20);
      expect(done).toBeTruthy();
    });

    it("can be paused and resumed", async () => {
      const queue = new TaskQueue({ maxParallelNum: 1 });
      let count = 0;
      queue.push(() => delay(20));
      queue.push(() => {
        count++;
      });
      queue.push(() => delay(20));
      queue.push(() => {
        count++;
      });
      queue.push(() => delay(20));
      queue.push(() => {
        count++;
      });

      expect(count).toBe(0);
      await delay(30);
      expect(count).toBe(1);

      queue.pause();
      await delay(50);

      expect(count).toBe(1);
      queue.start();
      await delay(20);
      expect(count).toBe(2);
      await delay(20);
      expect(count).toBe(3);
    });

    it("can be destroyed", async () => {
      const queue = new TaskQueue({ maxParallelNum: 1 });
      let count = 0;
      for (let i = 0; i < 10; i++) {
        queue.push(() => {
          count++;
        });
        queue.push(() => delay(20));
      }

      await delay(10);
      expect(count).toBe(1);
      await delay(20);
      expect(count).toBe(2);
      queue.destroy();
      await delay(200);
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
  });
});
