import { map } from "./map";
import { progressiveGenerate } from "./generator";
import { forEach } from "./forEach";

export const Progressive = {
  map,
  progressiveGenerate,
  forEach,
} as const;

export { map, progressiveGenerate, forEach };
export * from "./type";
