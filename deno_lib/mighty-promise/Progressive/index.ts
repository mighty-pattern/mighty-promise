import { map } from "./map.ts";
import { progressiveGenerate } from "./generator.ts";
import { forEach } from "./forEach.ts";

export const progressive = {
  map,
  progressiveGenerate,
  forEach,
} as const;

export * from "./type.ts";
