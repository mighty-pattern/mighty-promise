import { Heap } from "../../src/data-structure/Heap";
import { Chance } from "chance";

describe("Heap", () => {
  it("push", () => {
    const heap = new Heap<number>({ key: (x) => x });
    expect(heap.empty).toBeTruthy();
    expect(heap.size).toBe(0);
    heap.push(1);
    expect(heap.empty).toBeFalsy();
    expect(heap.size).toBe(1);
    heap.push(2);
    expect(heap.empty).toBeFalsy();
    expect(heap.size).toBe(2);
    heap.push(3);
    expect(heap.empty).toBeFalsy();
    expect(heap.size).toBe(3);
  });

  it("pop", () => {
    const heap = new Heap<number>({ key: (x) => x });
    heap.push(1, 2, 3, 4);
    expect(heap.pop()).toBe(1);
    expect(heap.pop()).toBe(2);
    expect(heap.pop()).toBe(3);
    expect(heap.pop()).toBe(4);
  });

  it("sort by key", () => {
    const heap = new Heap<number>({ key: (x) => x });
    heap.push(4, 1, 2, 5, 3);
    expect(Array.from(heap)).toStrictEqual([1, 2, 3, 4, 5]);
  });

  it("sort by compare", () => {
    const heap = new Heap<number>({
      compare: (a, b) => Math.abs(a) - Math.abs(b),
    });
    heap.push(-2, 1, -3, 5, 4);
    expect(Array.from(heap)).toStrictEqual([1, -2, -3, 4, 5]);
  });

  it("clear", () => {
    const heap = new Heap<number>({
      compare: (a, b) => Math.abs(a) - Math.abs(b),
    });
    heap.push(-2, 1, -3, 5, 4);
    heap.clear();
    expect(Array.from(heap)).toStrictEqual([]);
    expect(heap.size).toBe(0);
    expect(heap.empty).toBeTruthy();
  });

  it("sorts", () => {
    const heap = new Heap<number>({ key: (x) => x });
    for (let i = 2; i <= 64; i += 1) {
      test(i);
    }

    test(10000);
    function test(length: number) {
      const chance = new Chance(0);
      const input = Array(length)
        .fill(0)
        .map((_, i) => i);
      const shuffled = chance.shuffle(input);
      heap.push(...shuffled);
      expect(Array.from(heap)).toStrictEqual(input);
      heap.clear();
    }
  });

  it("can remove item", () => {
    const heap = new Heap<number>({ key: (x) => x });
    for (let i = 2; i <= 64; i += 1) {
      test(i);
    }

    function test(length: number) {
      const chance = new Chance(0);
      const input = Array(length)
        .fill(0)
        .map((_, i) => i);
      const removed = chance.integer({ min: 0, max: length - 1 });
      const shuffled = chance.shuffle(input);
      input.splice(removed, 1);
      heap.push(...shuffled);
      heap.remove(removed);
      expect(Array.from(heap)).toStrictEqual(input);
      heap.clear();
    }
  });
});
