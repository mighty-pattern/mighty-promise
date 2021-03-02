import { throwIfTimeout } from "../../src/utils/timeout";

describe("throwIfTimeout", () => {
  it("return promise immediately if ms == null", () => {
    const promise = new Promise<void>((r) => r());
    const out = throwIfTimeout(promise);
    expect(out).toBe(promise);
  });
});
