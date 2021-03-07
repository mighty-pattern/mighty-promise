import { PriorityTaskQueue } from "../../src/mighty-promise/TaskQueue";
import { delay } from "../../src/utils";

interface Task {
  callback: () => void;
  priority: number;
}

describe("PriorityTaskQueue", () => {
  it("push & pop", async () => {
    const queue = new PriorityTaskQueue<Task>({
      compare: (a, b) => a.priority - b.priority,
    });
    let run = "";
    queue.push({
      callback: async () => {
        run = "1";
        await delay(200);
      },
      priority: 1,
    });
    queue.push({
      callback: async () => {
        run = "2";
        await delay(200);
      },
      priority: 2,
    });
    queue.push({
      callback: async () => {
        run = "0";
        await delay(200);
      },
      priority: 0,
    });

    expect(run).toBe("1");
    await delay(300);
    expect(run).toBe("0");
    await delay(200);
    expect(run).toBe("2");
  });

  it("sorts task based on priority", async () => {
    const queue = new PriorityTaskQueue<Task>({
      compare: (a, b) => a.priority - b.priority,
      maxParallelNum: 1,
      taskInterval: null,
    });
    const ans: number[] = [];
    queue.push({
      callback: async () => {
        await delay(1);
      },
      priority: -1,
    });
    for (let i = 100; i >= 0; i--) {
      queue.push({
        callback: () => {
          ans.push(i);
        },
        priority: i,
      });
    }

    await delay(100);
    expect(ans).toStrictEqual(
      Array(101)
        .fill(0)
        .map((_, i) => i)
    );
  });
});
