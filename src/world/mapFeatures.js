export function createRoomFeature({ id, type, x, y, width, height }) {
  const bounds = { x, y, width, height };
  const tiles = createRectTiles(bounds);

  return createTileFeature({
    id,
    type,
    bounds,
    tiles,
  });
}

export function createCorridorFeature({ id, x, y, width, height, direction }) {
  const bounds = { x, y, width, height };
  const tiles = createRectTiles(bounds);

  return createTileFeature({
    id,
    type: "corridor",
    bounds,
    tiles,
    direction,
  });
}

export function createTileFeature({ id, type, tiles, bounds = getBoundsFromTiles(tiles), exits, ...extra }) {
  const dedupedTiles = dedupeTiles(tiles);
  const resolvedBounds = bounds ?? getBoundsFromTiles(dedupedTiles);

  return {
    id,
    type,
    ...extra,
    bounds: resolvedBounds,
    tiles: dedupedTiles,
    center: getBoundsCenter(resolvedBounds),
    exits: exits ?? createCardinalExits(resolvedBounds),
  };
}

export function getBoundsCenter(bounds) {
  return {
    x: bounds.x + Math.floor(bounds.width / 2),
    y: bounds.y + Math.floor(bounds.height / 2),
  };
}

export function createRectTiles(bounds) {
  const tiles = [];

  for (let y = bounds.y; y < bounds.y + bounds.height; y += 1) {
    for (let x = bounds.x; x < bounds.x + bounds.width; x += 1) {
      tiles.push({ x, y });
    }
  }

  return tiles;
}

export function getBoundsFromTiles(tiles) {
  const xs = tiles.map((tile) => tile.x);
  const ys = tiles.map((tile) => tile.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

function createCardinalExits(bounds) {
  const center = getBoundsCenter(bounds);

  return [
    {
      direction: "north",
      x: center.x,
      y: bounds.y,
    },
    {
      direction: "south",
      x: center.x,
      y: bounds.y + bounds.height - 1,
    },
    {
      direction: "west",
      x: bounds.x,
      y: center.y,
    },
    {
      direction: "east",
      x: bounds.x + bounds.width - 1,
      y: center.y,
    },
  ];
}

function dedupeTiles(tiles) {
  const seen = new Set();
  const deduped = [];

  for (const tile of tiles) {
    const key = `${tile.x},${tile.y}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push(tile);
  }

  return deduped;
}
