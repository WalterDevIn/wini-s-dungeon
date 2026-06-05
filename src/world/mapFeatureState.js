export function addRoom({ room, grid, rooms, features, paintTiles, floorTile }) {
  paintTiles(grid, room.tiles, floorTile);
  rooms.push(room);
  features.push(room);
}

export function addCorridor({ corridor, grid, corridors, features, paintTiles, floorTile }) {
  paintTiles(grid, corridor.tiles, floorTile);
  corridors.push(corridor);
  features.push(corridor);
}

export function freezeFeature(feature) {
  return Object.freeze({
    ...feature,
    bounds: Object.freeze({ ...feature.bounds }),
    center: Object.freeze({ ...feature.center }),
    tiles: Object.freeze(feature.tiles.map((tile) => Object.freeze({ ...tile }))),
    exits: Object.freeze(feature.exits.map((exit) => Object.freeze({ ...exit }))),
  });
}

export function createFeatureId(features) {
  return features.length + 1;
}
