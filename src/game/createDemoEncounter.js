import { getCreatureDefinition } from "../content/creatures/creatureRegistry.js";
import { createCreature } from "../domain/factories/createCreature.js";

const demoEncounterSpawns = Object.freeze([
  {
    creatureId: "rat",
    position: {
      x: 480,
      y: 96,
    },
  },
  {
    creatureId: "bat",
    position: {
      x: 576,
      y: 144,
    },
  },
  {
    creatureId: "goblinSkirmisher",
    position: {
      x: 528,
      y: 240,
    },
  },
  {
    creatureId: "stoneCrawler",
    position: {
      x: 672,
      y: 240,
    },
  },
]);

export function createDemoEncounter(world) {
  for (const spawn of demoEncounterSpawns) {
    createCreature(world, getCreatureDefinition(spawn.creatureId), {
      position: spawn.position,
    });
  }
}
