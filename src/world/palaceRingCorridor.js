import { createTileFeature, getBoundsFromTiles } from "./mapFeatures.js";
import { CORRIDOR_GAP, CORRIDOR_WIDTH } from "./palaceRingConfig.js";
import {
  createTileKey,
  createTileSet,
  expandBounds,
  getChebyshevDistanceToTiles,
} from "./mapGeometry.js";

export function createMainCorridor({ id, occupiedTiles }) {
  const occupiedTileSet = createTileSet(occupiedTiles);
  const occupiedBounds = getBoundsFromTiles(occupiedTiles);
  const searchBounds = expandBounds(occupiedBounds, CORRIDOR_GAP + CORRIDOR_WIDTH);
  const tiles = [];

  for (let y = searchBounds.y; y < searchBounds.y + searchBounds.height; y += 1) {
    for (let x = searchBounds.x; x < searchBounds.x + searchBounds.width; x += 1) {
      if (occupiedTileSet.has(createTileKey({ x, y }))) {
        continue;
      }

      const distance = getChebyshevDistanceToTiles({ x, y }, occupiedTiles);

      if (distance > CORRIDOR_GAP && distance <= CORRIDOR_GAP + CORRIDOR_WIDTH) {
        tiles.push({ x, y });
      }
    }
  }

  return createTileFeature({
    id,
    type: "main_corridor",
    tiles,
    bounds: getBoundsFromTiles(tiles),
    width: CORRIDOR_WIDTH,
    gap: CORRIDOR_GAP,
    ringAround: "central_hall_and_antechambers",
  });
}
