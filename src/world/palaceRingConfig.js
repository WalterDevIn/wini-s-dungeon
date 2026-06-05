export const WALL_TILE = "#";
export const FLOOR_TILE = ".";
export const CORRIDOR_WIDTH = 2;
export const CORRIDOR_GAP = 1;
export const ANTECHAMBER_SIZE = 3;
export const ANTECHAMBER_GAP = 1;

export function resolvePalaceRingConfig(config) {
  return {
    width: config.width ?? 64,
    height: config.height ?? 40,
    tileSize: config.tileSize ?? 48,
    centralHall: {
      width: config.centralHall?.width ?? 20,
      height: config.centralHall?.height ?? 10,
    },
  };
}
