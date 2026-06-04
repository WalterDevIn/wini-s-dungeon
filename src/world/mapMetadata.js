export function tileToPixelCenter(tile, tileSize) {
  return {
    x: tile.x * tileSize + tileSize / 2,
    y: tile.y * tileSize + tileSize / 2,
  };
}

export function tileToEntityPosition(tile, tileSize) {
  return {
    x: tile.x * tileSize,
    y: tile.y * tileSize,
  };
}

export function createDungeonMetadata({ tileSize, rooms, corridors, features }) {
  const startRoom = findRoomByType(rooms, "central_hall") ?? rooms[0];
  const farRooms = rooms.slice(1).sort((a, b) => {
    return getSquaredDistance(b.center, startRoom.center) - getSquaredDistance(a.center, startRoom.center);
  });
  const endRoom = findRoomByType(rooms, "external_room") ?? farRooms[0] ?? startRoom;
  const encounterRooms = getEncounterRooms(rooms, startRoom);

  return {
    rooms,
    corridors,
    features,
    playerSpawn: tileToEntityPosition(startRoom.center, tileSize),
    encounterSpawns: createEncounterSpawns(encounterRooms, tileSize),
    stairsUp: {
      tile: { ...startRoom.center },
      position: tileToPixelCenter(startRoom.center, tileSize),
    },
    stairsDown: {
      tile: { ...endRoom.center },
      position: tileToPixelCenter(endRoom.center, tileSize),
    },
  };
}

function getEncounterRooms(rooms, startRoom) {
  const externalRooms = rooms.filter((room) => room.type === "external_room");

  if (externalRooms.length > 0) {
    return externalRooms;
  }

  const antechambers = rooms.filter((room) => room.type === "antechamber");

  if (antechambers.length > 0) {
    return antechambers;
  }

  return rooms.filter((room) => room.id !== startRoom.id);
}

function createEncounterSpawns(rooms, tileSize) {
  const creatureIds = ["rat", "bat", "goblinSkirmisher", "stoneCrawler"];
  const spawnRooms = rooms.length > 0 ? rooms : [{ center: { x: 1, y: 1 }, bounds: { x: 1, y: 1, width: 1, height: 1 } }];

  return creatureIds.map((creatureId, index) => {
    const room = spawnRooms[index % spawnRooms.length];
    const tile = pickSpawnTileInRoom(room, index);

    return {
      creatureId,
      position: tileToEntityPosition(tile, tileSize),
    };
  });
}

function pickSpawnTileInRoom(room, index) {
  const interiorMinX = room.bounds.x + 1;
  const interiorMaxX = room.bounds.x + room.bounds.width - 2;
  const interiorMinY = room.bounds.y + 1;
  const interiorMaxY = room.bounds.y + room.bounds.height - 2;

  if (interiorMinX > interiorMaxX || interiorMinY > interiorMaxY) {
    return { ...room.center };
  }

  const width = interiorMaxX - interiorMinX + 1;
  const height = interiorMaxY - interiorMinY + 1;

  return {
    x: interiorMinX + (index % width),
    y: interiorMinY + (Math.floor(index / width) % height),
  };
}

function findRoomByType(rooms, type) {
  return rooms.find((room) => room.type === type) ?? null;
}

function getSquaredDistance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return dx * dx + dy * dy;
}
