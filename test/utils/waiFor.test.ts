import { TimeoutError } from "../../src/error";
import { delay, waitFor } from "../../src/utils";

describe("waitFor", () => {
  it("wait until condition is truthy", async () => {
    let condition = false;
    let done = false;
    const promise = waitFor({ condition: () => condition, interval: 0 });
    promise.then(() => {
      done = true;
    });

    expect(done).toBeFalsy();
    await delay(20);
    expect(done).toBeFalsy();
    done = true;
    await delay(10);
    expect(done).toBeTruthy();
  });

  it("throw timeout error after timeout", async () => {
    try {
      await waitFor({
        condition: () => false,
        timeout: 100,
      });
      throw new Error();
    } catch (e) {
      expect(e).toBeInstanceOf(TimeoutError);
    }
  });
});
