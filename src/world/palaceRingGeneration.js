import { createDungeonMetadata } from "./mapMetadata.js";
import { createCentralHall } from "./palaceRingCentralHall.js";
import { createAntechambers } from "./palaceRingAntechambers.js";
import { createMainCorridor } from "./palaceRingCorridor.js";
import { createExternalRooms } from "./palaceRingExternalRooms.js";
import {
  createAntechamberConnectorTiles,
  createExternalRoomConnectorTiles,
} from "./palaceRingConnectors.js";
import { createGrid, paintTiles, toTileRows } from "./mapGrid.js";
import { createTileSet } from "./mapGeometry.js";
import { addCorridor, addRoom, createFeatureId, freezeFeature } from "./mapFeatureState.js";
import { FLOOR_TILE, WALL_TILE, resolvePalaceRingConfig } from "./palaceRingConfig.js";

export function generatePalaceRingMap(config) {
  const resolvedConfig = resolvePalaceRingConfig(config);
  const grid = createGrid(resolvedConfig.width, resolvedConfig.height, WALL_TILE);
  const features = [];
  const rooms = [];
  const corridors = [];

  const centralHall = createCentralHall({ id: createFeatureId(features), config: resolvedConfig });
  addRoom({ room: centralHall, grid, rooms, features, paintTiles, floorTile: FLOOR_TILE });

  const antechambers = createAntechambers({
    nextId: createFeatureId(features),
    centralHall,
    mapWidth: resolvedConfig.width,
    mapHeight: resolvedConfig.height,
  });
  addRooms({ roomList: antechambers, grid, rooms, features });

  const occupiedTiles = [
    ...centralHall.tiles,
    ...antechambers.flatMap((antechamber) => antechamber.tiles),
  ];
  const mainCorridor = createMainCorridor({ id: createFeatureId(features), occupiedTiles });
  addCorridor({ corridor: mainCorridor, grid, corridors, features, paintTiles, floorTile: FLOOR_TILE });

  const externalRooms = createExternalRooms({
    nextId: createFeatureId(features),
    mainCorridor,
    mapWidth: resolvedConfig.width,
    mapHeight: resolvedConfig.height,
  });
  addRooms({ roomList: externalRooms, grid, rooms, features });

  const corridorTileSet = createTileSet(mainCorridor.tiles);
  paintTiles(grid, createAntechamberConnectorTiles({ centralHall, antechambers, corridorTileSet }), FLOOR_TILE);
  paintTiles(grid, createExternalRoomConnectorTiles({ externalRooms, corridorTileSet }), FLOOR_TILE);

  return createGeneratedDungeon({ resolvedConfig, grid, rooms, corridors, features });
}

function addRooms({ roomList, grid, rooms, features }) {
  for (const room of roomList) {
    addRoom({ room, grid, rooms, features, paintTiles, floorTile: FLOOR_TILE });
  }
}

function createGeneratedDungeon({ resolvedConfig, grid, rooms, corridors, features }) {
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
