import { delay } from "../../src/utils/delay";

describe("delay", () => {
  it("sleeps target time", async () => {
    let done = false;
    delay(0).then(() => {
      done = true;
    });
    await Promise.resolve();
    expect(done).toBeFalsy();
    await new Promise<void>((r) =>
      setTimeout(() => {
        expect(done).toBeTruthy();
        r();
      })
    );
  });
});
