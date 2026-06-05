export function createAntechamberConnectorTiles({ centralHall, antechambers, corridorTileSet }) {
  return antechambers.flatMap((antechamber) => [
    ...createCentralHallConnectorTiles({ centralHall, antechamber }),
    ...createCorridorConnectorTiles({ room: antechamber, corridorTileSet, direction: "outward" }),
  ]);
}

export function createExternalRoomConnectorTiles({ externalRooms, corridorTileSet }) {
  return externalRooms.flatMap((room) => createCorridorConnectorTiles({
    room,
    corridorTileSet,
    direction: "inward",
  }));
}

function createCentralHallConnectorTiles({ centralHall, antechamber }) {
  const side = antechamber.side;

  if (side === "north" || side === "south") {
    return createVerticalConnector({
      x: antechamber.center.x,
      fromY: side === "north" ? antechamber.bounds.y + antechamber.bounds.height - 1 : centralHall.bounds.y + centralHall.bounds.height - 1,
      toY: side === "north" ? centralHall.bounds.y : antechamber.bounds.y,
    });
  }

  return createHorizontalConnector({
    y: antechamber.center.y,
    fromX: side === "west" ? antechamber.bounds.x + antechamber.bounds.width - 1 : centralHall.bounds.x + centralHall.bounds.width - 1,
    toX: side === "west" ? centralHall.bounds.x : antechamber.bounds.x,
  });
}

function createCorridorConnectorTiles({ room, corridorTileSet, direction }) {
  const ray = createRay(room, direction);
  const corridorTile = findFirstTileInSet({ start: ray.start, step: ray.step, tileSet: corridorTileSet });

  if (!corridorTile) {
    return [];
  }

  return ray.step.x !== 0
    ? createHorizontalConnector({ y: ray.start.y, fromX: ray.start.x, toX: corridorTile.x })
    : createVerticalConnector({ x: ray.start.x, fromY: ray.start.y, toY: corridorTile.y });
}

function createRay(room, direction) {
  const outward = direction === "outward";
  const b = room.bounds;
  const c = room.center;
  const rays = {
    north: outward
      ? { start: { x: c.x, y: b.y }, step: { x: 0, y: -1 } }
      : { start: { x: c.x, y: b.y + b.height - 1 }, step: { x: 0, y: 1 } },
    south: outward
      ? { start: { x: c.x, y: b.y + b.height - 1 }, step: { x: 0, y: 1 } }
      : { start: { x: c.x, y: b.y }, step: { x: 0, y: -1 } },
    west: outward
      ? { start: { x: b.x, y: c.y }, step: { x: -1, y: 0 } }
      : { start: { x: b.x + b.width - 1, y: c.y }, step: { x: 1, y: 0 } },
    east: outward
      ? { start: { x: b.x + b.width - 1, y: c.y }, step: { x: 1, y: 0 } }
      : { start: { x: b.x, y: c.y }, step: { x: -1, y: 0 } },
  };

  return rays[room.side];
}

function findFirstTileInSet({ start, step, tileSet, limit = 12 }) {
  let current = { ...start };

  for (let index = 0; index <= limit; index += 1) {
    if (tileSet.has(`${current.x},${current.y}`)) {
      return current;
    }

    current = { x: current.x + step.x, y: current.y + step.y };
  }

  return null;
}

function createVerticalConnector({ x, fromY, toY }) {
  return Array.from({ length: Math.abs(toY - fromY) + 1 }, (_, index) => ({
    x,
    y: Math.min(fromY, toY) + index,
  }));
}

function createHorizontalConnector({ y, fromX, toX }) {
  return Array.from({ length: Math.abs(toX - fromX) + 1 }, (_, index) => ({
    x: Math.min(fromX, toX) + index,
    y,
  }));
}
