import { getCreatureDefinition } from "../content/creatures/creatureRegistry.js";
import { createCreature } from "../domain/factories/createCreature.js";

export function createEnemy(world) {
  return createCreature(world, getCreatureDefinition("goblinSkirmisher"));
}
