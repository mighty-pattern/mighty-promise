import { FRAME } from "../const.ts";

type Callback = (param: {
  didTimeout: boolean;
  timeRemaining: () => number;
}) => void;
type RequestIdleCallback = (cb: Callback) => number;

export let requestHostIdleCallback: RequestIdleCallback;
export let cancelHostIdleCallback: (id: number) => void;

try {
  requestHostIdleCallback = (window as any).requestIdleCallback;
  cancelHostIdleCallback = (window as any).cancelIdleCallback;
} catch (e) {}
if (!requestHostIdleCallback!) {
  requestHostIdleCallback = function (cb) {
    let start = Date.now();
    return (setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, FRAME - (Date.now() - start));
        },
      });
    }, 1) as unknown) as number;
  };

  cancelHostIdleCallback = clearTimeout;
}

export function awaitIdle() {
  return new Promise<{ timeRemaining: () => number }>((r) =>
    requestHostIdleCallback(r)
  );
}
