export const tileSize = 48;

const tiles = [
  "############",
  "#..........#",
  "#..##......#",
  "#..........#",
  "#......##..#",
  "#..........#",
  "#..#.......#",
  "#..........#",
  "############",
];

export const tilemap = Object.freeze({
  tileSize,
  width: tiles[0].length,
  height: tiles.length,
  tiles,
});

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
  const right = rect.x + rect.width;
  const top = rect.y;
  const bottom = rect.y + rect.height;

  return (
    isSolidAtPixel(tilemapData, left, top) ||
    isSolidAtPixel(tilemapData, right, top) ||
    isSolidAtPixel(tilemapData, left, bottom) ||
    isSolidAtPixel(tilemapData, right, bottom)
  );
}
