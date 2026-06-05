import { generateClassicDungeonMap } from "./classicDungeonGeneration.js";
import { generatePalaceRingMap } from "./palaceRingGeneration.js";

export function generateDungeonMap(config) {
  const resolvedConfig = resolveConfig(config);

  if (resolvedConfig.layout === "palaceRing") {
    return generatePalaceRingMap(resolvedConfig);
  }

  return generateClassicDungeonMap(resolvedConfig);
}

function resolveConfig(config) {
  return {
    seed: config.seed ?? 1337,
    layout: config.layout ?? "classic",
    width: config.width ?? 64,
    height: config.height ?? 40,
    tileSize: config.tileSize ?? 48,
    roomCount: {
      min: config.roomCount?.min ?? 6,
      max: config.roomCount?.max ?? 10,
    },
    centralHall: config.centralHall,
  };
}
