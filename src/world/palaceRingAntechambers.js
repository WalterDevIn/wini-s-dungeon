import { createRoomFeature } from "./mapFeatures.js";
import { ANTECHAMBER_GAP, ANTECHAMBER_SIZE } from "./palaceRingConfig.js";
import { boundsOverlap, isRoomInsideMap } from "./mapGeometry.js";

export function createAntechambers({ nextId, centralHall, mapWidth, mapHeight }) {
  const candidates = createAntechamberCandidates(centralHall.bounds);
  const accepted = [];

  for (const candidate of candidates) {
    const antechamber = createAntechamber({
      id: nextId + accepted.length,
      ...candidate,
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

function createAntechamberCandidates(hall) {
  const offset = ANTECHAMBER_SIZE + ANTECHAMBER_GAP;

  return [
    { side: "north", x: hall.x + 3, y: hall.y - offset },
    { side: "north", x: hall.x + hall.width - 6, y: hall.y - offset },
    { side: "south", x: hall.x + 8, y: hall.y + hall.height + ANTECHAMBER_GAP },
    { side: "west", x: hall.x - offset, y: hall.y + 1 },
    { side: "west", x: hall.x - offset, y: hall.y + hall.height - 4 },
    { side: "east", x: hall.x + hall.width + ANTECHAMBER_GAP, y: hall.y + 5 },
  ];
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
