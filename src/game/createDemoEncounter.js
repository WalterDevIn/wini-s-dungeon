import { getCreatureDefinition } from "../content/creatures/creatureRegistry.js";
import { createCreature } from "../domain/factories/createCreature.js";

export function createDemoEncounter(world, { spawns }) {
  for (const spawn of spawns) {
    createCreature(world, getCreatureDefinition(spawn.creatureId), {
      position: spawn.position,
    });
  }
}
