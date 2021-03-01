import { throwIfTimeout } from "../utils/timeout";

type ReleaseFunction = () => void;
export class Lock {
  private lockPromise?: Promise<void>;
  acquire(timeout?: number): Promise<ReleaseFunction> {
    if (!this.lockPromise) {
      let releaseFunction: ReleaseFunction;
      this.lockPromise = new Promise((r) => {
        releaseFunction = r;
      });

      return Promise.resolve(releaseFunction!);
    }

    const acquirePromise = new Promise<ReleaseFunction>((resolve) => {
      const currentLock = this.lockPromise!;
      const nextPromise = currentLock.then(() => {
        this.lockPromise = new Promise((release) => {
          resolve(release);
        });

        return this.lockPromise;
      });
      this.lockPromise = nextPromise;
    });

    if (timeout) {
      return throwIfTimeout(acquirePromise, timeout);
    }

    return acquirePromise;
  }
}
