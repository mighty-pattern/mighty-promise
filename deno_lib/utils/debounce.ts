export function debounce<TArgs extends unknown[], TReturn>(
  callback: (...args: TArgs) => TReturn,
  timeout: number = 0
): (...args: TArgs) => Promise<TReturn> {
  let timer: number;
  let resolve: (...args: TArgs) => void;
  let promise = createPromise();

  function createPromise() {
    return new Promise<TReturn>((_resolve, _reject) => {
      resolve = (...args: TArgs) => {
        promise = createPromise();
        let value: TReturn;

        try {
          value = callback(...args);
        } catch (e) {
          _reject(e);
          return;
        }

        _resolve(value);
      };
    });
  }

  return (...args: TArgs): Promise<TReturn> => {
    clearTimeout(timer);
    timer = (setTimeout(() => resolve(...args), timeout) as unknown) as number;
    return promise;
  };
}
