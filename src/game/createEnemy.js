import { getCreatureDefinition } from "../content/creatures/creatureRegistry.js";
import { createCreature } from "../domain/factories/createCreature.js";

export function createEnemy(world) {
  const creatureDefinition = getCreatureDefinition("goblinSkirmisher");

  return createCreature(world, creatureDefinition, {
    position: {
      x: 240,
      y: 192,
    },
  });
}
