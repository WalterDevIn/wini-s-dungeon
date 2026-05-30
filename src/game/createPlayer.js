import { getCreatureDefinition } from "../content/creatures/creatureRegistry.js";
import { createCreature } from "../domain/factories/createCreature.js";

export function createPlayer(world) {
  return createCreature(world, getCreatureDefinition("humanAdventurer"), {
    position: {
      x: 1056,
      y: 1152,
    },
  });
}
