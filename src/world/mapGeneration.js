import { createCorridorFeature, createRoomFeature, getBoundsFromTiles } from "./mapFeatures.js";
import { createDungeonMetadata } from "./mapMetadata.js";
import { generatePalaceRingMap } from "./palaceRingGeneration.js";
import { createGrid, paintTiles, toTileRows } from "./mapGrid.js";
import { boundsOverlap, expandBounds } from "./mapGeometry.js";
import { addCorridor, addRoom, createFeatureId, freezeFeature } from "./mapFeatureState.js";

const WALL_TILE = "#";
const FLOOR_TILE = ".";
const ROOM_ATTEMPT_LIMIT = 240;

export function generateDungeonMap(config) {
  const resolvedConfig = resolveConfig(config);

  if (resolvedConfig.layout === "palaceRing") {
    return generatePalaceRingMap(resolvedConfig);
  }

  return generateClassicDungeonMap(resolvedConfig);
}

function generateClassicDungeonMap(resolvedConfig) {
  const random = createSeededRandom(resolvedConfig.seed);
  const grid = createGrid(resolvedConfig.width, resolvedConfig.height, WALL_TILE);
  const features = [];
  const rooms = [];
  const corridors = [];

  const startRoom = createRoomFeature({
    id: createFeatureId(features),
    type: "smallRoom",
    x: Math.floor(resolvedConfig.width / 2) - 2,
    y: Math.floor(resolvedConfig.height / 2) - 2,
    width: 5,
    height: 5,
  });

  addClassicRoom({ room: startRoom, grid, rooms, features });

  const targetRoomCount = randomInt(
    random,
    resolvedConfig.roomCount.min,
    resolvedConfig.roomCount.max,
  );

  let attempts = 0;

  while (rooms.length < targetRoomCount && attempts < ROOM_ATTEMPT_LIMIT) {
    attempts += 1;

    const anchorRoom = rooms[randomInt(random, 0, rooms.length - 1)];
    const roomType = shouldCreateLargeRoom({ rooms, random }) ? "largeRoom" : "smallRoom";
    const nextRoom = createCandidateRoom({
      id: createFeatureId(features),
      type: roomType,
      anchorRoom,
      random,
      mapWidth: resolvedConfig.width,
      mapHeight: resolvedConfig.height,
    });

    if (!canPlaceRoom(nextRoom, rooms, resolvedConfig)) {
      continue;
    }

    const corridor = createCorridorBetweenRooms({
      id: createFeatureId(features) + 1,
      from: anchorRoom,
      to: nextRoom,
    });

    addClassicCorridor({ corridor, grid, corridors, features });
    addClassicRoom({ room: nextRoom, grid, rooms, features });
  }

  if (!rooms.some((room) => room.type === "largeRoom")) {
    const largeRoom = createFallbackLargeRoom({
      id: createFeatureId(features),
      rooms,
      random,
      mapWidth: resolvedConfig.width,
      mapHeight: resolvedConfig.height,
    });

    if (largeRoom) {
      const corridor = createCorridorBetweenRooms({
        id: createFeatureId(features) + 1,
        from: rooms[0],
        to: largeRoom,
      });

      addClassicCorridor({ corridor, grid, corridors, features });
      addClassicRoom({ room: largeRoom, grid, rooms, features });
    }
  }

  return {
    tilemap: Object.freeze({
      tileSize: resolvedConfig.tileSize,
      width: resolvedConfig.width,
      height: resolvedConfig.height,
      tiles: toTileRows(grid),
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
    seed: config.seed ?? 1337,
    layout: config.layout ?? "classic",
    width: config.width ?? 64,
    height: config.height ?? 40,
    tileSize: config.tileSize ?? 48,
    roomCount: {
      min: config.roomCount?.min ?? 6,
      max: config.roomCount?.max ?? 10,
    },
    centralHall: config.centralHall,
  };
}

function createCandidateRoom({ id, type, anchorRoom, random, mapWidth, mapHeight }) {
  const size = createRoomSize(type, random);
  const direction = pickDirection(random);
  const gap = randomInt(random, 3, 8);
  const anchor = anchorRoom.center;
  const candidate = getRoomOriginFromAnchor({ anchor, size, direction, gap });

  return createRoomFeature({
    id,
    type,
    x: clamp(candidate.x, 2, mapWidth - size.width - 3),
    y: clamp(candidate.y, 2, mapHeight - size.height - 3),
    width: size.width,
    height: size.height,
  });
}

function createRoomSize(type, random) {
  if (type === "largeRoom") {
    return pickRoomSizeByArea({ random, minArea: 13, maxArea: 32, minSide: 4, maxSide: 8 });
  }

  return pickRoomSizeByArea({ random, minArea: 4, maxArea: 12, minSide: 2, maxSide: 5 });
}

function pickRoomSizeByArea({ random, minArea, maxArea, minSide, maxSide }) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const width = randomInt(random, minSide, maxSide);
    const height = randomInt(random, minSide, maxSide);
    const area = width * height;

    if (area >= minArea && area <= maxArea) {
      return { width, height };
    }
  }

  return {
    width: minSide,
    height: Math.ceil(minArea / minSide),
  };
}

function getRoomOriginFromAnchor({ anchor, size, direction, gap }) {
  if (direction === "north") {
    return {
      x: anchor.x - Math.floor(size.width / 2),
      y: anchor.y - gap - size.height,
    };
  }

  if (direction === "south") {
    return {
      x: anchor.x - Math.floor(size.width / 2),
      y: anchor.y + gap,
    };
  }

  if (direction === "west") {
    return {
      x: anchor.x - gap - size.width,
      y: anchor.y - Math.floor(size.height / 2),
    };
  }

  return {
    x: anchor.x + gap,
    y: anchor.y - Math.floor(size.height / 2),
  };
}

function createCorridorBetweenRooms({ id, from, to }) {
  const fromCenter = from.center;
  const toCenter = to.center;
  const horizontalFirst = Math.abs(fromCenter.x - toCenter.x) >= Math.abs(fromCenter.y - toCenter.y);

  if (horizontalFirst) {
    return createBentCorridor({
      id,
      start: fromCenter,
      bend: { x: toCenter.x, y: fromCenter.y },
      end: toCenter,
    });
  }

  return createBentCorridor({
    id,
    start: fromCenter,
    bend: { x: fromCenter.x, y: toCenter.y },
    end: toCenter,
  });
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

function createFallbackLargeRoom({ id, rooms, random, mapWidth, mapHeight }) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const anchorRoom = rooms[randomInt(random, 0, rooms.length - 1)];
    const room = createCandidateRoom({
      id,
      type: "largeRoom",
      anchorRoom,
      random,
      mapWidth,
      mapHeight,
    });

    if (canPlaceRoom(room, rooms, { width: mapWidth, height: mapHeight })) {
      return room;
    }
  }

  return null;
}

function addClassicRoom({ room, grid, rooms, features }) {
  addRoom({ room, grid, rooms, features, paintTiles, floorTile: FLOOR_TILE });
}

function addClassicCorridor({ corridor, grid, corridors, features }) {
  addCorridor({ corridor, grid, corridors, features, paintTiles, floorTile: FLOOR_TILE });
}

function canPlaceRoom(room, rooms, config) {
  if (
    room.bounds.x < 1 ||
    room.bounds.y < 1 ||
    room.bounds.x + room.bounds.width >= config.width - 1 ||
    room.bounds.y + room.bounds.height >= config.height - 1
  ) {
    return false;
  }

  return rooms.every((existingRoom) => !boundsOverlap(expandBounds(room.bounds, 1), existingRoom.bounds));
}

function shouldCreateLargeRoom({ rooms, random }) {
  if (!rooms.some((room) => room.type === "largeRoom") && rooms.length >= 2) {
    return true;
  }

  return random() < 0.25;
}

function pickDirection(random) {
  const directions = ["north", "south", "west", "east"];
  return directions[randomInt(random, 0, directions.length - 1)];
}

function randomInt(random, min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function createSeededRandom(seed) {
  let state = seed >>> 0;

  return function random() {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
