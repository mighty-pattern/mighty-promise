import { forEach } from "../../../src/mighty-promise/Progressive/forEach";

describe("Progressive", () => {
  describe("forEach", () => {
    it("has not return arr", async () => {
      const input = [1, 2, 3];
      const ans: number[] = [];
      const res = await forEach(input, (v) => {
        ans.push(v);
        return v;
      }).promise;
      expect(res).not.toStrictEqual(input);
      expect(ans).toStrictEqual(input);
    });
  });
});
