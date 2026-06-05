export function createAntechamberConnectorTiles({ centralHall, antechambers, corridorTileSet }) {
  return antechambers.flatMap((antechamber) => [
    ...createCentralHallConnectorTiles({ centralHall, antechamber }),
    ...createCorridorConnectorTiles({ room: antechamber, corridorTileSet, direction: "outward" }),
  ]);
}

export function createExternalRoomConnectorTiles({ externalRooms, corridorTileSet }) {
  return externalRooms.flatMap((externalRoom) => createCorridorConnectorTiles({
    room: externalRoom,
    corridorTileSet,
    direction: "inward",
  }));
}

function createCentralHallConnectorTiles({ centralHall, antechamber }) {
  if (antechamber.side === "north") {
    return createVerticalConnector({
      x: antechamber.center.x,
      fromY: antechamber.bounds.y + antechamber.bounds.height - 1,
      toY: centralHall.bounds.y,
    });
  }

  if (antechamber.side === "south") {
    return createVerticalConnector({
      x: antechamber.center.x,
      fromY: centralHall.bounds.y + centralHall.bounds.height - 1,
      toY: antechamber.bounds.y,
    });
  }

  if (antechamber.side === "west") {
    return createHorizontalConnector({
      y: antechamber.center.y,
      fromX: antechamber.bounds.x + antechamber.bounds.width - 1,
      toX: centralHall.bounds.x,
    });
  }

  return createHorizontalConnector({
    y: antechamber.center.y,
    fromX: centralHall.bounds.x + centralHall.bounds.width - 1,
    toX: antechamber.bounds.x,
  });
}

function createCorridorConnectorTiles({ room, corridorTileSet, direction }) {
  const ray = direction === "inward" ? getInwardRay(room) : getOutwardRay(room);
  const corridorTile = findFirstTileInSet({ start: ray.start, step: ray.step, tileSet: corridorTileSet });

  if (!corridorTile) {
    return [];
  }

  if (ray.step.x !== 0) {
    return createHorizontalConnector({ y: ray.start.y, fromX: ray.start.x, toX: corridorTile.x });
  }

  return createVerticalConnector({ x: ray.start.x, fromY: ray.start.y, toY: corridorTile.y });
}

function getOutwardRay(room) {
  const rays = {
    north: { start: { x: room.center.x, y: room.bounds.y }, step: { x: 0, y: -1 } },
    south: { start: { x: room.center.x, y: room.bounds.y + room.bounds.height - 1 }, step: { x: 0, y: 1 } },
    west: { start: { x: room.bounds.x, y: room.center.y }, step: { x: -1, y: 0 } },
    east: { start: { x: room.bounds.x + room.bounds.width - 1, y: room.center.y }, step: { x: 1, y: 0 } },
  };

  return rays[room.side];
}

function getInwardRay(room) {
  const rays = {
    north: { start: { x: room.center.x, y: room.bounds.y + room.bounds.height - 1 }, step: { x: 0, y: 1 } },
    south: { start: { x: room.center.x, y: room.bounds.y }, step: { x: 0, y: -1 } },
    west: { start: { x: room.bounds.x + room.bounds.width - 1, y: room.center.y }, step: { x: 1, y: 0 } },
    east: { start: { x: room.bounds.x, y: room.center.y }, step: { x: -1, y: 0 } },
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
  const tiles = [];

  for (let y = Math.min(fromY, toY); y <= Math.max(fromY, toY); y += 1) {
    tiles.push({ x, y });
  }

  return tiles;
}

function createHorizontalConnector({ y, fromX, toX }) {
  const tiles = [];

  for (let x = Math.min(fromX, toX); x <= Math.max(fromX, toX); x += 1) {
    tiles.push({ x, y });
  }

  return tiles;
}
