import { LinkedList } from "../../src/data-structure/LinkedList";

describe("LinkedList", () => {
  it("basic push & pushFont", () => {
    const list = new LinkedList<number>();
    expect(list.head).toBeUndefined();
    expect(list.tail).toBeUndefined();
    list.push(2);
    expect(list.size).toBe(1);
    expect(list.toArray()).toStrictEqual([2]);
    expect(list.head).toBe(2);
    expect(list.tail).toBe(2);
    list.push(3);
    list.push(4);
    list.pushFront(1);
    expect(list.toArray()).toStrictEqual([1, 2, 3, 4]);
  });

  it("basic pop & popFront", () => {
    const list = new LinkedList<number>();
    list.push(1);
    list.push(2);
    list.push(3);
    list.push(4);
    expect(list.toArray()).toStrictEqual([1, 2, 3, 4]);
    // [1, 2, 3, 4]
    expect(list.popFront()).toBe(1);
    expect(list.popFront()).toBe(2);

    // [3, 4]
    expect(list.tail).toBe(4);
    expect(list.head).toBe(3);
    expect(list.pop()).toBe(4);
    expect(list.tail).toBe(3);
    expect(list.pop()).toBe(3);
    expect(list.pop()).toBeUndefined();
    expect(list.popFront()).toBeUndefined();
  });

  it("pop empty", () => {
    const list = new LinkedList<number>();
    expect(list.pop()).toBeUndefined();
    expect(list.popFront()).toBeUndefined();
    expect(list.size).toBe(0);
  });

  it("clear", () => {
    const list = new LinkedList([1, 2, 3, 4, 5]);
    expect(list.toArray()).toStrictEqual([1, 2, 3, 4, 5]);
    list.clear();
    expect(list.toArray()).toStrictEqual([]);
    expect(list.size).toBe(0);
    expect(list.head).toBeUndefined();
    expect(list.tail).toBeUndefined();
  });

  it("combo", () => {
    const list = new LinkedList(["a", "b", "c", "d"]);
    expect(list.pop()).toBe("d");
    expect(list.popFront()).toBe("a");
    expect(list.toArray()).toStrictEqual(["b", "c"]);
    expect(list.push("d"));
    expect(list.size).toBe(3);
    expect(list.toArray()).toStrictEqual(["b", "c", "d"]);
    expect(list.popFront()).toBe("b");
    expect(list.popFront()).toBe("c");
    expect(list.size).toBe(1);
    expect(list.popFront()).toBe("d");
    expect(list.popFront()).toBeUndefined();
    expect(list.size).toBe(0);
    expect(list.pop()).toBeUndefined();

    list.push("1");
    expect(list.popFront()).toBe("1");
    list.push("2");
    expect(list.pop()).toBe("2");
    expect(list.size).toBe(0);
    expect(list.popFront()).toBeUndefined();
    expect(list.pop()).toBeUndefined();
  });
});
