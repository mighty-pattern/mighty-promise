/**
 * Wait for a duration of time (in ms)
 *
 * @param ms await time in ms
 */
export function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
