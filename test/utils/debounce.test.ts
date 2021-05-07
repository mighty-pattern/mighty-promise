import { delay, debounce } from "../../src/utils";

describe("debounce", () => {
  it("return the same promise within timeout", () => {
    const callback = debounce(() => 10);
    const a = callback();
    const b = callback();
    const c = callback();
    expect(a).toBe(b);
    expect(b).toBe(c);
  });

  it("default timeout = 0", async () => {
    let done = false;
    const callback = debounce(() => {
      done = true;
    });
    callback();
    await undefined;
    expect(done).toBeFalsy();
    await delay(0);
    expect(done).toBeTruthy();
  });

  it("resolve promise after timeout", async () => {
    let done = false;
    const callback = debounce(() => {
      done = true;
    }, 20);
    let callbackDone = false;
    callback().then(() => {
      callbackDone = true;
    });
    expect(done).toBeFalsy();
    expect(callbackDone).toBeFalsy();
    await delay(30);
    expect(done).toBeTruthy();
    expect(callbackDone).toBeTruthy();
  });

  it("will throw if inner callback throw", async (done) => {
    const callback = debounce(() => {
      throw 123;
    }, 20);

    callback().catch((e) => {
      expect(e).toBe(123);
      done();
    });
  });

  it("create new promise after timeout", async () => {
    const callback = debounce(() => 10, 10);
    const a = callback();
    const b = callback();
    expect(a).toBe(b);
    await delay(20);
    const c = callback();
    expect(c).not.toBe(a);
  });

  it("should debounce", async () => {
    let done = false;
    const callback = debounce((x: string) => {
      done = true;
      return x;
    }, 100);
    const a = callback("a");
    const b = callback("b");
    await delay(70);
    expect(done).toBeFalsy();
    const c = callback("c");
    await delay(70);
    expect(done).toBeFalsy();
    const d = callback("d");
    await delay(70);
    expect(done).toBeFalsy();
    await delay(40);
    expect(done).toBeTruthy();
    expect(await Promise.all([a, b, c, d])).toStrictEqual(["d", "d", "d", "d"]);
    expect(await callback("final")).toBe("final");
  });
});
