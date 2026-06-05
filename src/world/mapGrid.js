export function createGrid(width, height, fill) {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => fill));
}

export function paintTiles(grid, tiles, tile) {
  for (const point of tiles) {
    if (point.y >= 0 && point.y < grid.length && point.x >= 0 && point.x < grid[0].length) {
      grid[point.y][point.x] = tile;
    }
  }
}

export function toTileRows(grid) {
  return grid.map((row) => row.join(""));
}
