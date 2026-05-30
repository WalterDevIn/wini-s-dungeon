import { batDefinition } from "./bat.js";
import { goblinSkirmisherDefinition } from "./goblinSkirmisher.js";
import { humanAdventurerDefinition } from "./humanAdventurer.js";
import { ratDefinition } from "./rat.js";
import { stoneCrawlerDefinition } from "./stoneCrawler.js";

const creatureDefinitions = Object.freeze({
  [batDefinition.id]: batDefinition,
  [goblinSkirmisherDefinition.id]: goblinSkirmisherDefinition,
  [humanAdventurerDefinition.id]: humanAdventurerDefinition,
  [ratDefinition.id]: ratDefinition,
  [stoneCrawlerDefinition.id]: stoneCrawlerDefinition,
});

export function getCreatureDefinition(creatureId) {
  return creatureDefinitions[creatureId] ?? null;
}
