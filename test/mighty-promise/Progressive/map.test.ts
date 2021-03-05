import { map } from "../../../src/mighty-promise/Progressive/map";
import { delay } from "../../../src/utils/delay";

describe("Progressive", () => {
  describe("map", () => {
    it("maps value", async () => {
      const ans = await map([1, 2, 3], (v) => v + 1).promise;
      expect(ans).toStrictEqual([2, 3, 4]);
    });

    it("has interval", async () => {
      let cur: undefined | number;
      const { promise } = map(
        [1, 2, 3],
        (v) => {
          cur = v;
          return v;
        },
        { maxExecutionTime: 0, minInterval: 100 }
      );
      await delay(50);
      expect(cur).toBe(1);
      await delay(100);
      expect(cur).toBe(2);
      await delay(100);
      expect(cur).toBe(3);
      expect(await promise).toStrictEqual([1, 2, 3]);
    });

    it("can be abort", async () => {
      let cur: undefined | number;
      const { promise, abort } = map(
        [1, 2, 3],
        (v) => {
          cur = v;
          return v;
        },
        { maxExecutionTime: 0, minInterval: 100 }
      );
      await delay(50);
      expect(cur).toBe(1);
      await delay(100);
      expect(cur).toBe(2);
      abort();
      await delay(100);
      expect(cur).toBe(2);
      expect(await promise).toStrictEqual([1, 2]);
    });
  });
});
