export function createRoomFeature({ id, type, x, y, width, height }) {
  const bounds = { x, y, width, height };
  const tiles = createRectTiles(bounds);
  const center = getBoundsCenter(bounds);

  return {
    id,
    type,
    bounds,
    tiles,
    center,
    exits: createCardinalExits(bounds),
  };
}

export function createCorridorFeature({ id, x, y, width, height, direction }) {
  const bounds = { x, y, width, height };
  const tiles = createRectTiles(bounds);
  const center = getBoundsCenter(bounds);

  return {
    id,
    type: "corridor",
    direction,
    bounds,
    tiles,
    center,
    exits: createCardinalExits(bounds),
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
