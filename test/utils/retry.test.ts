import { retry, delay } from "../../src/utils";

describe("retry", () => {
  it("retry with timeout", async () => {
    let times = 0;
    retry(
      () => {
        times += 1;
        throw new Error();
      },
      { times: 10, sleepTimeout: 10 }
    ).catch(() => {});
    expect(times).toEqual(1);
    await delay(5);
    expect(times).toEqual(1);
    await delay(5);
    expect(times).toEqual(2);
    await delay(10);
    expect(times).toEqual(3);
    await delay(10);
    expect(times).toEqual(4);
  });

  it("throw error after max retries", async () => {
    let thrown = false;
    const error = "lla";
    let times = 0;
    await retry(
      () => {
        times += 1;
        throw error;
      },
      { times: 10, sleepTimeout: 0 }
    ).catch((e) => {
      thrown = e;
    });
    expect(thrown).toBe(error);
    expect(times).toEqual(10);
  });
});
