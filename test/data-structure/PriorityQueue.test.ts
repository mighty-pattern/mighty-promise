import { PriorityQueue } from "../../src/data-structure/PriorityQueue";
describe("PriorityQueue", () => {
  it("push & pop", () => {
    const queue = new PriorityQueue<{ v: number }>((a, b) => a.v - b.v);
    expect(queue.size).toBe(0);
    expect(queue.empty).toBeTruthy();
    queue.push({ v: 2 });
    expect(queue.size).toBe(1);
    expect(queue.empty).toBeFalsy();
    queue.push({ v: 0 });
    queue.push({ v: 1 });
    expect(queue.pop()).toStrictEqual({ v: 0 });
    expect(queue.pop()).toStrictEqual({ v: 1 });
    expect(queue.pop()).toStrictEqual({ v: 2 });
    expect(queue.size).toBe(0);
    expect(queue.empty).toBeTruthy();
  });

  it("has & remove", () => {
    const queue = new PriorityQueue<{ v: number }>((a, b) => a.v - b.v);
    const a = { v: 2 };
    queue.push(a);
    queue.push({ v: 0 });
    queue.push({ v: 1 });
    expect(queue.has(a)).toBeTruthy();
    expect(queue.has({ v: 2 })).toBeFalsy();
    queue.remove(a);
    expect(queue.has(a)).toBeFalsy();
    expect(queue.size).toBe(2);
  });

  it("clears", () => {
    const queue = new PriorityQueue<{ v: number }>((a, b) => a.v - b.v);
    const a = { v: 2 };
    queue.push(a);
    queue.push({ v: 0 });
    queue.push({ v: 1 });
    queue.clear();
    expect(queue.has(a)).toBeFalsy();
    expect(queue.size).toBe(0);
    expect(queue.empty).toBeTruthy();
  });
});
