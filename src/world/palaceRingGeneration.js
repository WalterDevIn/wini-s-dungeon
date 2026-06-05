import { createRoomFeature, createTileFeature, getBoundsFromTiles } from "./mapFeatures.js";
import { createDungeonMetadata } from "./mapMetadata.js";

const WALL_TILE = "#";
const FLOOR_TILE = ".";
const CORRIDOR_WIDTH = 2;
const CORRIDOR_GAP = 1;
const ANTECHAMBER_SIZE = 3;
const ANTECHAMBER_GAP = 1;

export function generatePalaceRingMap(config) {
  const resolvedConfig = resolveConfig(config);
  const grid = createGrid(resolvedConfig.width, resolvedConfig.height, WALL_TILE);
  const features = [];
  const rooms = [];
  const corridors = [];

  const centralHall = createCentralHall({
    id: createFeatureId(features),
    config: resolvedConfig,
  });
  addRoom({ room: centralHall, grid, rooms, features });

  const antechambers = createAntechambers({
    nextId: createFeatureId(features),
    centralHall,
    mapWidth: resolvedConfig.width,
    mapHeight: resolvedConfig.height,
  });

  for (const antechamber of antechambers) {
    addRoom({ room: antechamber, grid, rooms, features });
  }

  const occupiedTiles = [
    ...centralHall.tiles,
    ...antechambers.flatMap((antechamber) => antechamber.tiles),
  ];
  const mainCorridor = createMainCorridor({
    id: createFeatureId(features),
    occupiedTiles,
  });
  addCorridor({ corridor: mainCorridor, grid, corridors, features });

  const externalRooms = createExternalRooms({
    nextId: createFeatureId(features),
    mainCorridor,
    mapWidth: resolvedConfig.width,
    mapHeight: resolvedConfig.height,
  });

  for (const externalRoom of externalRooms) {
    addRoom({ room: externalRoom, grid, rooms, features });
  }

  const corridorTileSet = createTileSet(mainCorridor.tiles);

  paintTiles(
    grid,
    createAntechamberConnectorTiles({ centralHall, antechambers, corridorTileSet }),
    FLOOR_TILE,
  );
  paintTiles(
    grid,
    createExternalRoomConnectorTiles({ externalRooms, corridorTileSet }),
    FLOOR_TILE,
  );

  const tiles = grid.map((row) => row.join(""));

  return {
    tilemap: Object.freeze({
      tileSize: resolvedConfig.tileSize,
      width: resolvedConfig.width,
      height: resolvedConfig.height,
      tiles,
    }),
    metadata: Object.freeze(
      createDungeonMetadata({
        tileSize: resolvedConfig.tileSize,
        rooms: rooms.map(freezeFeature),
        corridors: corridors.map(freezeFeature),
        features: features.map(freezeFeature),
      }),
    ),
  };
}

function resolveConfig(config) {
  return {
    width: config.width ?? 64,
    height: config.height ?? 40,
    tileSize: config.tileSize ?? 48,
    centralHall: {
      width: config.centralHall?.width ?? 20,
      height: config.centralHall?.height ?? 10,
    },
  };
}

function createCentralHall({ id, config }) {
  return createRoomFeature({
    id,
    type: "central_hall",
    x: Math.floor(config.width / 2) - Math.floor(config.centralHall.width / 2),
    y: Math.floor(config.height / 2) - Math.floor(config.centralHall.height / 2),
    width: config.centralHall.width,
    height: config.centralHall.height,
  });
}

function createAntechambers({ nextId, centralHall, mapWidth, mapHeight }) {
  const hall = centralHall.bounds;
  const offset = ANTECHAMBER_SIZE + ANTECHAMBER_GAP;
  const candidates = [
    {
      side: "north",
      x: hall.x + 3,
      y: hall.y - offset,
    },
    {
      side: "north",
      x: hall.x + hall.width - 6,
      y: hall.y - offset,
    },
    {
      side: "south",
      x: hall.x + 8,
      y: hall.y + hall.height + ANTECHAMBER_GAP,
    },
    {
      side: "west",
      x: hall.x - offset,
      y: hall.y + 1,
    },
    {
      side: "west",
      x: hall.x - offset,
      y: hall.y + hall.height - 4,
    },
    {
      side: "east",
      x: hall.x + hall.width + ANTECHAMBER_GAP,
      y: hall.y + 5,
    },
  ];

  const accepted = [];

  for (const candidate of candidates) {
    const antechamber = createAntechamber({
      id: nextId + accepted.length,
      x: candidate.x,
      y: candidate.y,
      side: candidate.side,
      attachedTo: centralHall.id,
    });

    if (!isRoomInsideMap(antechamber.bounds, mapWidth, mapHeight)) {
      continue;
    }

    if (accepted.some((existing) => boundsOverlap(antechamber.bounds, existing.bounds))) {
      continue;
    }

    accepted.push(antechamber);
  }

  return accepted;
}

function createAntechamber({ id, x, y, side, attachedTo }) {
  return createRoomFeature({
    id,
    type: "antechamber",
    x,
    y,
    width: ANTECHAMBER_SIZE,
    height: ANTECHAMBER_SIZE,
    side,
    attachedTo,
  });
}

function createMainCorridor({ id, occupiedTiles }) {
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

function createExternalRooms({ nextId, mainCorridor, mapWidth, mapHeight }) {
  const ring = mainCorridor.bounds;
  const candidates = [
    {
      side: "north",
      width: 5,
      height: 4,
      x: ring.x + 3,
      y: ring.y - 4,
    },
    {
      side: "north",
      width: 8,
      height: 4,
      x: ring.x + 18,
      y: ring.y - 4,
    },
    {
      side: "east",
      width: 5,
      height: 6,
      x: ring.x + ring.width,
      y: ring.y + 4,
    },
    {
      side: "south",
      width: 9,
      height: 4,
      x: ring.x + 8,
      y: ring.y + ring.height,
    },
    {
      side: "south",
      width: 6,
      height: 4,
      x: ring.x + ring.width - 9,
      y: ring.y + ring.height,
    },
    {
      side: "west",
      width: 5,
      height: 7,
      x: ring.x - 5,
      y: ring.y + 10,
    },
  ];
  const accepted = [];

  for (const candidate of candidates) {
    if (!isRoomInsideMap(candidate, mapWidth, mapHeight)) {
      continue;
    }

    if (accepted.some((existing) => boundsOverlap(candidate, existing.bounds))) {
      continue;
    }

    accepted.push(
      createRoomFeature({
        id: nextId + accepted.length,
        type: "external_room",
        x: candidate.x,
        y: candidate.y,
        width: candidate.width,
        height: candidate.height,
        side: candidate.side,
        connectedTo: mainCorridor.id,
      }),
    );
  }

  return accepted;
}

function createAntechamberConnectorTiles({ centralHall, antechambers, corridorTileSet }) {
  return antechambers.flatMap((antechamber) => [
    ...createCentralHallConnectorTiles({ centralHall, antechamber }),
    ...createCorridorConnectorTiles({ room: antechamber, corridorTileSet, direction: "outward" }),
  ]);
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
  const corridorTile = findFirstTileInSet({
    start: ray.start,
    step: ray.step,
    tileSet: corridorTileSet,
    limit: 12,
  });

  if (!corridorTile) {
    return [];
  }

  if (ray.step.x !== 0) {
    return createHorizontalConnector({
      y: ray.start.y,
      fromX: ray.start.x,
      toX: corridorTile.x,
    });
  }

  return createVerticalConnector({
    x: ray.start.x,
    fromY: ray.start.y,
    toY: corridorTile.y,
  });
}

function createExternalRoomConnectorTiles({ externalRooms, corridorTileSet }) {
  return externalRooms.flatMap((externalRoom) => createCorridorConnectorTiles({
    room: externalRoom,
    corridorTileSet,
    direction: "inward",
  }));
}

function getOutwardRay(room) {
  if (room.side === "north") {
    return {
      start: { x: room.center.x, y: room.bounds.y },
      step: { x: 0, y: -1 },
    };
  }

  if (room.side === "south") {
    return {
      start: { x: room.center.x, y: room.bounds.y + room.bounds.height - 1 },
      step: { x: 0, y: 1 },
    };
  }

  if (room.side === "west") {
    return {
      start: { x: room.bounds.x, y: room.center.y },
      step: { x: -1, y: 0 },
    };
  }

  return {
    start: { x: room.bounds.x + room.bounds.width - 1, y: room.center.y },
    step: { x: 1, y: 0 },
  };
}

function getInwardRay(room) {
  if (room.side === "north") {
    return {
      start: { x: room.center.x, y: room.bounds.y + room.bounds.height - 1 },
      step: { x: 0, y: 1 },
    };
  }

  if (room.side === "south") {
    return {
      start: { x: room.center.x, y: room.bounds.y },
      step: { x: 0, y: -1 },
    };
  }

  if (room.side === "west") {
    return {
      start: { x: room.bounds.x + room.bounds.width - 1, y: room.center.y },
      step: { x: 1, y: 0 },
    };
  }

  return {
    start: { x: room.bounds.x, y: room.center.y },
    step: { x: -1, y: 0 },
  };
}

function findFirstTileInSet({ start, step, tileSet, limit }) {
  let current = { ...start };

  for (let index = 0; index <= limit; index += 1) {
    if (tileSet.has(createTileKey(current))) {
      return current;
    }

    current = {
      x: current.x + step.x,
      y: current.y + step.y,
    };
  }

  return null;
}

function createVerticalConnector({ x, fromY, toY }) {
  const minY = Math.min(fromY, toY);
  const maxY = Math.max(fromY, toY);
  const tiles = [];

  for (let y = minY; y <= maxY; y += 1) {
    tiles.push({ x, y });
  }

  return tiles;
}

function createHorizontalConnector({ y, fromX, toX }) {
  const minX = Math.min(fromX, toX);
  const maxX = Math.max(fromX, toX);
  const tiles = [];

  for (let x = minX; x <= maxX; x += 1) {
    tiles.push({ x, y });
  }

  return tiles;
}

function addRoom({ room, grid, rooms, features }) {
  paintTiles(grid, room.tiles, FLOOR_TILE);
  rooms.push(room);
  features.push(room);
}

function addCorridor({ corridor, grid, corridors, features }) {
  paintTiles(grid, corridor.tiles, FLOOR_TILE);
  corridors.push(corridor);
  features.push(corridor);
}

function paintTiles(grid, tiles, tile) {
  for (const point of tiles) {
    if (point.y >= 0 && point.y < grid.length && point.x >= 0 && point.x < grid[0].length) {
      grid[point.y][point.x] = tile;
    }
  }
}

function createGrid(width, height, fill) {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => fill));
}

function getChebyshevDistanceToTiles(point, tiles) {
  return Math.min(...tiles.map((tile) => Math.max(Math.abs(point.x - tile.x), Math.abs(point.y - tile.y))));
}

function createTileSet(tiles) {
  return new Set(tiles.map(createTileKey));
}

function createTileKey(tile) {
  return `${tile.x},${tile.y}`;
}

function isRoomInsideMap(room, width, height) {
  return room.x > 0 && room.y > 0 && room.x + room.width < width - 1 && room.y + room.height < height - 1;
}

function boundsOverlap(a, b) {
  return !(
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  );
}

function expandBounds(bounds, amount) {
  return {
    x: bounds.x - amount,
    y: bounds.y - amount,
    width: bounds.width + amount * 2,
    height: bounds.height + amount * 2,
  };
}

function freezeFeature(feature) {
  return Object.freeze({
    ...feature,
    bounds: Object.freeze({ ...feature.bounds }),
    center: Object.freeze({ ...feature.center }),
    tiles: Object.freeze(feature.tiles.map((tile) => Object.freeze({ ...tile }))),
    exits: Object.freeze(feature.exits.map((exit) => Object.freeze({ ...exit }))),
  });
}

function createFeatureId(features) {
  return features.length + 1;
}
