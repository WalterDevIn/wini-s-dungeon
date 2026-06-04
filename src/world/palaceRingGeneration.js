import {
  createRectTiles,
  createRoomFeature,
  createTileFeature,
  getBoundsFromTiles,
} from "./mapFeatures.js";
import { createDungeonMetadata } from "./mapMetadata.js";

const WALL_TILE = "#";
const FLOOR_TILE = ".";
const CORRIDOR_WIDTH = 2;
const CORRIDOR_PADDING = 1;

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
  });

  for (const antechamber of antechambers) {
    addRoom({ room: antechamber, grid, rooms, features });
  }

  const centralBlockBounds = getBoundsFromTiles([
    ...centralHall.tiles,
    ...antechambers.flatMap((antechamber) => antechamber.tiles),
  ]);
  const mainCorridor = createMainCorridor({
    id: createFeatureId(features),
    centralBlockBounds,
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

  paintTiles(grid, createConnectorTiles({ centralHall, antechambers, mainCorridor }), FLOOR_TILE);
  paintTiles(grid, createExternalRoomConnectorTiles({ externalRooms, mainCorridor }), FLOOR_TILE);

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
      width: config.centralHall?.width ?? 12,
      height: config.centralHall?.height ?? 8,
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

function createAntechambers({ nextId, centralHall }) {
  const hall = centralHall.bounds;
  const middleX = centralHall.center.x;
  const middleY = centralHall.center.y;

  return [
    createAntechamber({
      id: nextId,
      x: middleX - 1,
      y: hall.y - 3,
      side: "north",
      attachedTo: centralHall.id,
    }),
    createAntechamber({
      id: nextId + 1,
      x: middleX - 1,
      y: hall.y + hall.height,
      side: "south",
      attachedTo: centralHall.id,
    }),
    createAntechamber({
      id: nextId + 2,
      x: hall.x - 3,
      y: middleY - 1,
      side: "west",
      attachedTo: centralHall.id,
    }),
    createAntechamber({
      id: nextId + 3,
      x: hall.x + hall.width,
      y: middleY - 1,
      side: "east",
      attachedTo: centralHall.id,
    }),
  ];
}

function createAntechamber({ id, x, y, side, attachedTo }) {
  return createRoomFeature({
    id,
    type: "antechamber",
    x,
    y,
    width: 3,
    height: 3,
    side,
    attachedTo,
  });
}

function createMainCorridor({ id, centralBlockBounds }) {
  const outerBounds = expandBounds(centralBlockBounds, CORRIDOR_PADDING + CORRIDOR_WIDTH);
  const innerBounds = expandBounds(centralBlockBounds, CORRIDOR_PADDING);
  const tiles = [];

  for (let y = outerBounds.y; y < outerBounds.y + outerBounds.height; y += 1) {
    for (let x = outerBounds.x; x < outerBounds.x + outerBounds.width; x += 1) {
      if (isInsideBounds({ x, y }, innerBounds)) {
        continue;
      }

      tiles.push({ x, y });
    }
  }

  return createTileFeature({
    id,
    type: "main_corridor",
    tiles,
    bounds: outerBounds,
    width: CORRIDOR_WIDTH,
    ringAround: "central_block",
  });
}

function createExternalRooms({ nextId, mainCorridor, mapWidth, mapHeight }) {
  const ring = mainCorridor.bounds;
  const candidates = [
    {
      side: "north",
      width: 6,
      height: 4,
      x: mainCorridor.center.x - 3,
      y: ring.y - 5,
    },
    {
      side: "east",
      width: 5,
      height: 5,
      x: ring.x + ring.width + 1,
      y: mainCorridor.center.y - 2,
    },
    {
      side: "south",
      width: 7,
      height: 4,
      x: mainCorridor.center.x - 3,
      y: ring.y + ring.height + 1,
    },
  ];

  return candidates
    .filter((candidate) => isRoomInsideMap(candidate, mapWidth, mapHeight))
    .map((candidate, index) =>
      createRoomFeature({
        id: nextId + index,
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

function createConnectorTiles({ centralHall, antechambers, mainCorridor }) {
  return antechambers.flatMap((antechamber) => {
    if (antechamber.side === "north") {
      return createVerticalConnector({
        x: antechamber.center.x,
        fromY: mainCorridor.bounds.y + mainCorridor.width - 1,
        toY: centralHall.bounds.y,
      });
    }

    if (antechamber.side === "south") {
      return createVerticalConnector({
        x: antechamber.center.x,
        fromY: centralHall.bounds.y + centralHall.bounds.height - 1,
        toY: mainCorridor.bounds.y + mainCorridor.bounds.height - mainCorridor.width,
      });
    }

    if (antechamber.side === "west") {
      return createHorizontalConnector({
        y: antechamber.center.y,
        fromX: mainCorridor.bounds.x + mainCorridor.width - 1,
        toX: centralHall.bounds.x,
      });
    }

    return createHorizontalConnector({
      y: antechamber.center.y,
      fromX: centralHall.bounds.x + centralHall.bounds.width - 1,
      toX: mainCorridor.bounds.x + mainCorridor.bounds.width - mainCorridor.width,
    });
  });
}

function createExternalRoomConnectorTiles({ externalRooms, mainCorridor }) {
  return externalRooms.flatMap((externalRoom) => {
    if (externalRoom.side === "north") {
      return createVerticalConnector({
        x: externalRoom.center.x,
        fromY: externalRoom.bounds.y + externalRoom.bounds.height - 1,
        toY: mainCorridor.bounds.y,
      });
    }

    if (externalRoom.side === "south") {
      return createVerticalConnector({
        x: externalRoom.center.x,
        fromY: mainCorridor.bounds.y + mainCorridor.bounds.height - 1,
        toY: externalRoom.bounds.y,
      });
    }

    return createHorizontalConnector({
      y: externalRoom.center.y,
      fromX: mainCorridor.bounds.x + mainCorridor.bounds.width - 1,
      toX: externalRoom.bounds.x,
    });
  });
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

function isInsideBounds(point, bounds) {
  return (
    point.x >= bounds.x &&
    point.x < bounds.x + bounds.width &&
    point.y >= bounds.y &&
    point.y < bounds.y + bounds.height
  );
}

function isRoomInsideMap(room, width, height) {
  return room.x > 0 && room.y > 0 && room.x + room.width < width - 1 && room.y + room.height < height - 1;
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
