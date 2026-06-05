export function boundsOverlap(a, b) {
  return !(
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  );
}

export function expandBounds(bounds, amount) {
  return {
    x: bounds.x - amount,
    y: bounds.y - amount,
    width: bounds.width + amount * 2,
    height: bounds.height + amount * 2,
  };
}

export function createTileSet(tiles) {
  return new Set(tiles.map(createTileKey));
}

export function createTileKey(tile) {
  return `${tile.x},${tile.y}`;
}

export function getChebyshevDistanceToTiles(point, tiles) {
  return Math.min(...tiles.map((tile) => Math.max(Math.abs(point.x - tile.x), Math.abs(point.y - tile.y))));
}

export function isRoomInsideMap(room, width, height) {
  return room.x > 0 && room.y > 0 && room.x + room.width < width - 1 && room.y + room.height < height - 1;
}
