import { goblinSkirmisherDefinition } from "./goblinSkirmisher.js";
import { humanAdventurerDefinition } from "./humanAdventurer.js";

const creatureDefinitions = Object.freeze({
  [goblinSkirmisherDefinition.id]: goblinSkirmisherDefinition,
  [humanAdventurerDefinition.id]: humanAdventurerDefinition,
});

export function getCreatureDefinition(creatureId) {
  return creatureDefinitions[creatureId] ?? null;
}
