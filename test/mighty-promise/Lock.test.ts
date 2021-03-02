import { TimeoutError } from "../../src/error";
import { Lock } from "../../src/mighty-promise/Lock";
import { delay } from "../../src/utils/delay";
describe("Lock", () => {
  it("acquired promise will not resolve until lock is released", async () => {
    const lock = new Lock();
    const release = await lock.acquire();
    let resolved = false;
    lock.acquire().then(() => {
      resolved = true;
    });

    expect(resolved).toBeFalsy();
    await delay(10);
    expect(resolved).toBeFalsy();
    release();
    await delay(0);
    expect(resolved).toBeTruthy();
  });

  it("throw if timeout", async () => {
    const lock = new Lock();
    await lock.acquire();
    await expect(async () => {
      await lock.acquire(20);
    }).rejects.toThrow(TimeoutError);
  });

  it("will not throw if acquired in time", async (done) => {
    const lock = new Lock();
    const release = await lock.acquire();
    lock.acquire(100).then(() => done());
    await delay(10);
    release();
  });

  it("can chain multiple lock acquisitions", async () => {
    const lock = new Lock();
    const release = await lock.acquire();
    let lastValue = -1;
    for (let i = 0; i < 10; i++) {
      lock.acquire().then((release) => {
        expect(lastValue).toBe(i - 1);
        lastValue = i;
        release();
      });
    }
    expect(lastValue).toBe(-1);
    await delay(10);
    expect(lastValue).toBe(-1);
    release();
    await delay(10);
    expect(lastValue).toBe(9);
  });

  it("can be acquired and released", async () => {
    const lock = new Lock();
    let owner = "A";
    let release = await lock.acquire();
    lock.acquire().then((r) => {
      release = r;
      owner = "B";
    });
    lock.acquire().then((r) => {
      release = r;
      owner = "C";
    });
    expect(owner).toBe("A");
    await delay(0);
    expect(owner).toBe("A");
    release();
    await delay(0);
    expect(owner).toBe("B");
    await delay(10);
    expect(owner).toBe("B");
    release();
    await delay(0);
    expect(owner).toBe("C");
  });

  it("cannot be released twice", async () => {
    const lock = new Lock();
    let owner = "A";
    const release = await lock.acquire();
    lock.acquire().then((r) => {
      owner = "B";
    });
    lock.acquire().then((r) => {
      owner = "C";
    });
    release();
    release();
    release();
    await delay(0);
    release();
    await delay(0);
    expect(owner).toBe("B");
  });

  it("acquireImmediately", async () => {
    const lock = new Lock();
    const nums: number[] = [];
    for (let i = 0; i < 5; i++) {
      lock.acquire().then(async (release) => {
        nums.push(i);
        await delay(100);
        release();
      });
    }

    lock.acquireImmediately().then(async (release) => {
      nums.push(100);
      await delay(10);
      release();
    });

    await delay(0);
    expect(nums).toStrictEqual([0]);
    await delay(120);
    expect(nums).toStrictEqual([0, 100, 1]);
    lock.acquireImmediately().then(async (release) => {
      nums.push(101);
      await delay(100);
      release();
    });
    await delay(100);
    expect(nums).toStrictEqual([0, 100, 1, 101]);
    await delay(400);
    expect(nums).toStrictEqual([0, 100, 1, 101, 2, 3, 4]);
  });

  it("acquireImmediately timeout", async () => {
    const lock = new Lock();
    lock.acquire();
    await delay(0);
    await expect(() => lock.acquireImmediately(10)).rejects.toThrow(
      TimeoutError
    );
  });
});
