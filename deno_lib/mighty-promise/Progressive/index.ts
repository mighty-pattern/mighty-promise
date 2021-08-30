import { map } from "./map.ts";
import { progressiveGenerate } from "./generator.ts";
import { forEach } from "./forEach.ts";

export const Progressive = {
  map,
  progressiveGenerate,
  forEach,
} as const;

export { map, progressiveGenerate, forEach };
export * from "./type.ts";
