import { progressiveGenerate } from "../../../src/mighty-promise/Progressive/generator";
import { delay } from "../../../src/utils/delay";

describe("Progressive", () => {
  describe("generator", () => {
    it("generates arr", async () => {
      function* iter() {
        yield 1;
        yield 2;
        yield 3;
      }

      const out = await progressiveGenerate(iter()).promise;
      expect(out).toStrictEqual([1, 2, 3]);
    });

    it("can pause between task", async () => {
      let i = 0;
      function* iter() {
        for (; ; i++) {
          yield i;
        }
      }

      const { abort } = progressiveGenerate(iter(), {
        maxExecutionDuration: 1,
        minInterval: 200,
      });
      await delay(10);
      const value = i;
      expect(i).not.toEqual(0);
      await delay(100);
      expect(i).toBe(value);
      await delay(200);
      expect(i).not.toBe(value);
      abort();
    });

    it("can ignore output", async () => {
      function* iter() {
        yield 1;
      }

      {
        const out = await progressiveGenerate(iter(), { ignoreOutput: true })
          .promise;
        expect(out).toStrictEqual([]);
      }
      {
        const out = await progressiveGenerate(iter(), { ignoreOutput: false })
          .promise;
        expect(out).toStrictEqual([1]);
      }
    });

    it("can be aborted", async () => {
      let i = 0;
      function* iter() {
        for (; ; i++) {
          yield i;
        }
      }

      const { promise, abort } = progressiveGenerate(iter());
      await delay(10);
      const value = i;
      abort();
      await delay(500);
      expect(i).toBe(value);
      await promise;
    });

    it("can use idle callback", async () => {
      let i = 0;
      function* iter() {
        for (; ; i++) {
          yield i;
        }
      }

      const { promise, abort } = progressiveGenerate(iter(), {
        useIdleCallback: true,
      });
      await delay(10);
      const value = i;
      abort();
      await delay(500);
      expect(i).toBe(value);
      await promise;
    });
  });
});
