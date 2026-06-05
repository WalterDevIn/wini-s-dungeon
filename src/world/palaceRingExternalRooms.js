import { createRoomFeature } from "./mapFeatures.js";
import { boundsOverlap, isRoomInsideMap } from "./mapGeometry.js";

export function createExternalRooms({ nextId, mainCorridor, mapWidth, mapHeight }) {
  const candidates = createExternalRoomCandidates(mainCorridor.bounds);
  const accepted = [];

  for (const candidate of candidates) {
    if (!isRoomInsideMap(candidate, mapWidth, mapHeight)) {
      continue;
    }

    if (accepted.some((existing) => boundsOverlap(candidate, existing.bounds))) {
      continue;
    }

    accepted.push(createExternalRoom({
      id: nextId + accepted.length,
      candidate,
      connectedTo: mainCorridor.id,
    }));
  }

  return accepted;
}

function createExternalRoomCandidates(ring) {
  return [
    { side: "north", width: 5, height: 4, x: ring.x + 3, y: ring.y - 4 },
    { side: "north", width: 8, height: 4, x: ring.x + 18, y: ring.y - 4 },
    { side: "east", width: 5, height: 6, x: ring.x + ring.width, y: ring.y + 4 },
    { side: "south", width: 9, height: 4, x: ring.x + 8, y: ring.y + ring.height },
    { side: "south", width: 6, height: 4, x: ring.x + ring.width - 9, y: ring.y + ring.height },
    { side: "west", width: 5, height: 7, x: ring.x - 5, y: ring.y + 10 },
  ];
}

function createExternalRoom({ id, candidate, connectedTo }) {
  return createRoomFeature({
    id,
    type: "external_room",
    x: candidate.x,
    y: candidate.y,
    width: candidate.width,
    height: candidate.height,
    side: candidate.side,
    connectedTo,
  });
}
