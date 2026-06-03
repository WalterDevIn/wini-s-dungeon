import { getCreatureDefinition } from "../content/creatures/creatureRegistry.js";
import { createCreature } from "../domain/factories/createCreature.js";

export function createPlayer(world, { position }) {
  return createCreature(world, getCreatureDefinition("humanAdventurer"), {
    position,
  });
}
