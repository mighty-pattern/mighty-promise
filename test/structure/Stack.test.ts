import { Stack } from "../../src/data-structure/Stack";

describe("Stack", () => {
  it("push & pop", () => {
    const stack = new Stack<number>();
    expect(stack.size).toBe(0);
    expect(stack.top()).toBeUndefined();
    expect(stack.pop()).toBeUndefined();
    stack.push(123);
    expect(stack.top()).toBe(123);
    expect(stack.size).toBe(1);
    stack.push(23);
    expect(stack.size).toBe(2);
    expect(stack.top()).toBe(23);
    expect(stack.pop()).toBe(23);
    stack.push(2);
    expect(stack.size).toBe(2);
    expect(stack.top()).toBe(2);
    expect(stack.pop()).toBe(2);
    expect(stack.top()).toBe(123);
    expect(stack.pop()).toBe(123);
    expect(stack.pop()).toBeUndefined();
  });
});
