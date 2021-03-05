import { map } from "./map";
import { progressiveGenerate } from "./generator";
import { forEach } from "./forEach";

export const progressive = {
  map,
  progressiveGenerate,
  forEach,
} as const;

export * from "./type";
