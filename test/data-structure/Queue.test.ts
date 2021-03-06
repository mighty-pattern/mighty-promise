import { Queue } from "../../src/data-structure/Queue";

describe("Queue", () => {
  it("push & pop", () => {
    const queue = new Queue<number>();
    for (let i = 0; i < 10; i++) {
      queue.push(i);
    }

    for (let i = 0; i < 10; i++) {
      expect(queue.size).toBe(10 - i);
      expect(queue.front).toBe(i);
      expect(queue.pop()).toBe(i);
    }

    expect(queue.pop()).toBeUndefined();
    expect(queue.size).toBe(0);
  });

  it("push pop push", () => {
    const queue = new Queue<number>();
    expect(queue.front).toBeUndefined();
    // [1]
    queue.push(1);
    expect(queue.front).toBe(1);
    // []
    expect(queue.pop()).toBe(1);
    expect(queue.pop()).toBeUndefined();
    // [1]
    queue.push(1);
    // []
    expect(queue.pop()).toBe(1);
    expect(queue.pop()).toBeUndefined();
    // [2]
    queue.push(2);
    expect(queue.front).toBe(2);
    // [2, 3]
    queue.push(3);
    // [3]
    expect(queue.pop()).toBe(2);
    // [3, 4]
    queue.push(4);
    expect(queue.front).toBe(3);
    expect(queue.size).toBe(2);
    // [4]
    expect(queue.pop()).toBe(3);
    expect(queue.front).toBe(4);
    expect(queue.size).toBe(1);
    // []
    expect(queue.pop()).toBe(4);
    expect(queue.size).toBe(0);
    expect(queue.pop()).toBeUndefined();
  });
});
