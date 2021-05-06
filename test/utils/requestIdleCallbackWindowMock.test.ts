export const _ = "Export something to make this file a module";
describe("requestIdleCallback", () => {
  it("use window.requestIdleCallback if exists", async () => {
    let done = false;
    global.window = {
      requestIdleCallback: () => {
        done = true;
      },
    } as any;
    const { requestHostIdleCallback } = await import(
      "../../src/utils/requestIdleCallback"
    );
    requestHostIdleCallback(() => {});
    expect(done).toBeTruthy();
  });
});
