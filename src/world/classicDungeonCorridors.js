import { createCorridorFeature, getBoundsFromTiles } from "./mapFeatures.js";

export function createCorridorBetweenRooms({ id, from, to }) {
  const fromCenter = from.center;
  const toCenter = to.center;
  const horizontalFirst = Math.abs(fromCenter.x - toCenter.x) >= Math.abs(fromCenter.y - toCenter.y);

  return horizontalFirst
    ? createBentCorridor({ id, start: fromCenter, bend: { x: toCenter.x, y: fromCenter.y }, end: toCenter })
    : createBentCorridor({ id, start: fromCenter, bend: { x: fromCenter.x, y: toCenter.y }, end: toCenter });
}

function createBentCorridor({ id, start, bend, end }) {
  const first = createAxisAlignedCorridor({ id, start, end: bend });
  const second = createAxisAlignedCorridor({ id: id + 1, start: bend, end });
  const tiles = dedupeTiles([...first.tiles, ...second.tiles]);
  const bounds = getBoundsFromTiles(tiles);

  return {
    id,
    type: "corridor",
    direction: "bent",
    bounds,
    tiles,
    center: {
      x: Math.floor((start.x + end.x) / 2),
      y: Math.floor((start.y + end.y) / 2),
    },
    exits: [
      { direction: "start", ...start },
      { direction: "end", ...end },
    ],
  };
}

function createAxisAlignedCorridor({ id, start, end }) {
  const minX = Math.min(start.x, end.x);
  const maxX = Math.max(start.x, end.x);
  const minY = Math.min(start.y, end.y);
  const maxY = Math.max(start.y, end.y);
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  return createCorridorFeature({
    id,
    x: minX,
    y: minY,
    width,
    height,
    direction: width >= height ? "horizontal" : "vertical",
  });
}

function dedupeTiles(tiles) {
  const seen = new Set();
  const deduped = [];

  for (const tile of tiles) {
    const key = `${tile.x},${tile.y}`;

    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(tile);
    }
  }

  return deduped;
}
