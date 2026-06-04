import { generateDungeonMap } from "./mapGeneration.js";

export const tileSize = 48;

const generatedDungeon = generateDungeonMap({
  seed: 1337,
  layout: "palaceRing",
  width: 64,
  height: 40,
  tileSize,
  roomCount: {
    min: 6,
    max: 10,
  },
  centralHall: {
    width: 20,
    height: 10,
  },
});

export const tilemap = generatedDungeon.tilemap;
export const dungeonMetadata = generatedDungeon.metadata;

export function isSolidTile(tilemapData, tileX, tileY) {
  if (
    tileY < 0 ||
    tileY >= tilemapData.height ||
    tileX < 0 ||
    tileX >= tilemapData.width
  ) {
    return true;
  }

  return tilemapData.tiles[tileY][tileX] === "#";
}

export function isSolidAtPixel(tilemapData, x, y) {
  const tileX = Math.floor(x / tilemapData.tileSize);
  const tileY = Math.floor(y / tilemapData.tileSize);

  return isSolidTile(tilemapData, tileX, tileY);
}

export function collidesWithSolidTile(tilemapData, rect) {
  const left = rect.x;
  const right = rect.x + rect.width - 1;
  const top = rect.y;
  const bottom = rect.y + rect.height - 1;

  return (
    isSolidAtPixel(tilemapData, left, top) ||
    isSolidAtPixel(tilemapData, right, top) ||
    isSolidAtPixel(tilemapData, left, bottom) ||
    isSolidAtPixel(tilemapData, right, bottom)
  );
}
