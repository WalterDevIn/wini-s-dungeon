import { createRoomFeature } from "./mapFeatures.js";
import { boundsOverlap, expandBounds } from "./mapGeometry.js";
import { pickDirection, randomInt } from "./mapRandom.js";

export function createCandidateRoom({ id, type, anchorRoom, random, mapWidth, mapHeight }) {
  const size = createRoomSize(type, random);
  const direction = pickDirection(random);
  const gap = randomInt(random, 3, 8);
  const candidate = getRoomOriginFromAnchor({ anchor: anchorRoom.center, size, direction, gap });

  return createRoomFeature({
    id,
    type,
    x: clamp(candidate.x, 2, mapWidth - size.width - 3),
    y: clamp(candidate.y, 2, mapHeight - size.height - 3),
    width: size.width,
    height: size.height,
  });
}

export function createFallbackLargeRoom({ id, rooms, random, mapWidth, mapHeight }) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const anchorRoom = rooms[randomInt(random, 0, rooms.length - 1)];
    const room = createCandidateRoom({ id, type: "largeRoom", anchorRoom, random, mapWidth, mapHeight });

    if (canPlaceRoom(room, rooms, { width: mapWidth, height: mapHeight })) {
      return room;
    }
  }

  return null;
}

export function canPlaceRoom(room, rooms, config) {
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

export function shouldCreateLargeRoom({ rooms, random }) {
  return !rooms.some((room) => room.type === "largeRoom") && rooms.length >= 2 ? true : random() < 0.25;
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

    if (width * height >= minArea && width * height <= maxArea) {
      return { width, height };
    }
  }

  return { width: minSide, height: Math.ceil(minArea / minSide) };
}

function getRoomOriginFromAnchor({ anchor, size, direction, gap }) {
  const origins = {
    north: { x: anchor.x - Math.floor(size.width / 2), y: anchor.y - gap - size.height },
    south: { x: anchor.x - Math.floor(size.width / 2), y: anchor.y + gap },
    west: { x: anchor.x - gap - size.width, y: anchor.y - Math.floor(size.height / 2) },
    east: { x: anchor.x + gap, y: anchor.y - Math.floor(size.height / 2) },
  };

  return origins[direction];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
