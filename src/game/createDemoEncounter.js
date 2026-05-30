import { getCreatureDefinition } from "../content/creatures/creatureRegistry.js";
import { createCreature } from "../domain/factories/createCreature.js";

const demoEncounterSpawns = Object.freeze([
  {
    creatureId: "rat",
    position: {
      x: 96,
      y: 96,
    },
  },
  {
    creatureId: "bat",
    position: {
      x: 576,
      y: 480,
    },
  },
  {
    creatureId: "goblinSkirmisher",
    position: {
      x: 1632,
      y: 480,
    },
  },
  {
    creatureId: "stoneCrawler",
    position: {
      x: 384,
      y: 1104,
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
