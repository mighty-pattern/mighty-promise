import { LinkedPromise } from "../../src/mighty-promise/LinkedPromise";
import { delay } from "../../src/utils";
describe("LinkedPromise", () => {
  it("creates tasks that are linked", async () => {
    const linkedPromise = new LinkedPromise();
    let owners: string[] = [];
    linkedPromise.pushTask().then((release) => {
      owners.push("a");
      release();
    });
    linkedPromise.pushTask().then((release) => {
      owners.push("b");
      release();
    });
    linkedPromise.pushTask().then((release) => {
      owners.push("c");
      release();
    });
    expect(owners).toStrictEqual([]);
    await delay(0);
    expect(owners).toStrictEqual(["a", "b", "c"]);
  });

  it("pause if task is not released", async () => {
    const linkedPromise = new LinkedPromise();
    const owners: number[] = [];
    let release = () => {};

    for (let i = 0; i < 5; i++) {
      linkedPromise.pushTask().then((_release) => {
        owners.push(i);
        release = _release;
      });
    }

    expect(owners).toStrictEqual([]);
    await delay(10);
    for (let i = 0; i < 5; i++) {
      expect(owners).toStrictEqual(
        Array(i + 1)
          .fill(0)
          .map((_, i) => i)
      );
      release();
      await delay(10);
    }
  });

  it("can be paused", async () => {
    const linkedPromise = new LinkedPromise();
    const owners: number[] = [];

    for (let i = 0; i < 5; i++) {
      linkedPromise.pushTask().then(async (release) => {
        owners.push(i);
        await delay(100);
        release();
      });
    }

    expect(owners).toStrictEqual([]);
    await delay(210);
    expect(owners).toStrictEqual([0, 1, 2]);
    linkedPromise.pause();
    await delay(310);
    expect(owners).toStrictEqual([0, 1, 2]);
    linkedPromise.start();
    await delay(310);
    expect(owners).toStrictEqual([0, 1, 2, 3, 4]);
  });

  it("can insert new task to front", async () => {
    const linkedPromise = new LinkedPromise();
    const owners: number[] = [];

    for (let i = 0; i < 5; i++) {
      linkedPromise.pushTask().then(async (release) => {
        owners.push(i);
        await delay(100);
        release();
      });
    }

    await delay(210);
    expect(owners).toStrictEqual([0, 1, 2]);
    linkedPromise.pushTaskFront().then((release) => {
      owners.push(100);
      release();
    });
    linkedPromise.pushTaskFront().then((release) => {
      owners.push(101);
      release();
    });
    linkedPromise.pushTaskFront().then((release) => {
      owners.push(102);
      release();
    });

    await delay(300);
    expect(owners).toStrictEqual([0, 1, 2, 102, 101, 100, 3, 4]);
  });

  it("can be destroyed", async () => {
    const linkedPromise = new LinkedPromise();
    let owners: string[] = [];
    linkedPromise.pushTask().then((release) => {
      release();
    });
    linkedPromise.pushTask().then((release) => {
      owners.push("a");
      release();
    });
    linkedPromise.pushTask().then((release) => {
      owners.push("b");
      release();
    });
    expect(owners).toStrictEqual([]);
    linkedPromise.destroy();
    await delay(10);
    expect(owners).toStrictEqual([]);
  });
});
