import { createRoomFeature } from "./mapFeatures.js";

export function createCentralHall({ id, config }) {
  return createRoomFeature({
    id,
    type: "central_hall",
    x: Math.floor(config.width / 2) - Math.floor(config.centralHall.width / 2),
    y: Math.floor(config.height / 2) - Math.floor(config.centralHall.height / 2),
    width: config.centralHall.width,
    height: config.centralHall.height,
  });
}
