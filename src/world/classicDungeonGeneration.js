import { createRoomFeature } from "./mapFeatures.js";
import { createDungeonMetadata } from "./mapMetadata.js";
import { createGrid, paintTiles, toTileRows } from "./mapGrid.js";
import { addCorridor, addRoom, createFeatureId, freezeFeature } from "./mapFeatureState.js";
import { createSeededRandom, randomInt } from "./mapRandom.js";
import { FLOOR_TILE, ROOM_ATTEMPT_LIMIT, WALL_TILE } from "./classicDungeonConfig.js";
import {
  canPlaceRoom,
  createCandidateRoom,
  createFallbackLargeRoom,
  shouldCreateLargeRoom,
} from "./classicDungeonRooms.js";
import { createCorridorBetweenRooms } from "./classicDungeonCorridors.js";

export function generateClassicDungeonMap(resolvedConfig) {
  const random = createSeededRandom(resolvedConfig.seed);
  const grid = createGrid(resolvedConfig.width, resolvedConfig.height, WALL_TILE);
  const features = [];
  const rooms = [];
  const corridors = [];

  addClassicRoom({ room: createStartRoom({ id: createFeatureId(features), resolvedConfig }), grid, rooms, features });
  addGeneratedRooms({ resolvedConfig, random, grid, rooms, corridors, features });
  ensureLargeRoom({ resolvedConfig, random, grid, rooms, corridors, features });

  return createGeneratedDungeon({ resolvedConfig, grid, rooms, corridors, features });
}

function createStartRoom({ id, resolvedConfig }) {
  return createRoomFeature({
    id,
    type: "smallRoom",
    x: Math.floor(resolvedConfig.width / 2) - 2,
    y: Math.floor(resolvedConfig.height / 2) - 2,
    width: 5,
    height: 5,
  });
}

function addGeneratedRooms({ resolvedConfig, random, grid, rooms, corridors, features }) {
  const targetRoomCount = randomInt(random, resolvedConfig.roomCount.min, resolvedConfig.roomCount.max);

  for (let attempts = 0; rooms.length < targetRoomCount && attempts < ROOM_ATTEMPT_LIMIT; attempts += 1) {
    addCandidateRoom({ resolvedConfig, random, grid, rooms, corridors, features });
  }
}

function addCandidateRoom({ resolvedConfig, random, grid, rooms, corridors, features }) {
  const anchorRoom = rooms[randomInt(random, 0, rooms.length - 1)];
  const type = shouldCreateLargeRoom({ rooms, random }) ? "largeRoom" : "smallRoom";
  const room = createCandidateRoom({
    id: createFeatureId(features),
    type,
    anchorRoom,
    random,
    mapWidth: resolvedConfig.width,
    mapHeight: resolvedConfig.height,
  });

  if (canPlaceRoom(room, rooms, resolvedConfig)) {
    connectAndAddRoom({ room, from: anchorRoom, grid, rooms, corridors, features });
  }
}

function ensureLargeRoom({ resolvedConfig, random, grid, rooms, corridors, features }) {
  if (rooms.some((room) => room.type === "largeRoom")) {
    return;
  }

  const room = createFallbackLargeRoom({
    id: createFeatureId(features),
    rooms,
    random,
    mapWidth: resolvedConfig.width,
    mapHeight: resolvedConfig.height,
  });

  if (room) {
    connectAndAddRoom({ room, from: rooms[0], grid, rooms, corridors, features });
  }
}

function connectAndAddRoom({ room, from, grid, rooms, corridors, features }) {
  const corridor = createCorridorBetweenRooms({ id: createFeatureId(features) + 1, from, to: room });

  addCorridor({ corridor, grid, corridors, features, paintTiles, floorTile: FLOOR_TILE });
  addRoom({ room, grid, rooms, features, paintTiles, floorTile: FLOOR_TILE });
}

function createGeneratedDungeon({ resolvedConfig, grid, rooms, corridors, features }) {
  return {
    tilemap: Object.freeze({
      tileSize: resolvedConfig.tileSize,
      width: resolvedConfig.width,
      height: resolvedConfig.height,
      tiles: toTileRows(grid),
    }),
    metadata: Object.freeze(createDungeonMetadata({
      tileSize: resolvedConfig.tileSize,
      rooms: rooms.map(freezeFeature),
      corridors: corridors.map(freezeFeature),
      features: features.map(freezeFeature),
    })),
  };
}
