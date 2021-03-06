import { Queue } from "../src/data-structure/Queue";

const realSetTimeout = setTimeout;
const realDate = Date;
let currentTime = 0;
const queue = new Queue<() => any>();

(() => {
  try {
    (window as any).setTimeout = fakeSetTimeout;
    (window as any).Date.now = () => currentTime;
    (window as any).performance.now = () => currentTime;
  } finally {
  }
  try {
    (global as any).setTimeout = fakeSetTimeout;
    (global as any).Date.now = () => currentTime;
  } finally {
  }
})();

function fakeSetTimeout(
  callback: (...args: any[]) => void,
  ms: number = 0,
  ...args: any[]
): NodeJS.Timeout {
  const targetRunTime = currentTime + ms;
  const task = () => callback(...args);
  const res = realSetTimeout(() => callback(...args));
  return res;
}
