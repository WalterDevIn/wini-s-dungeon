import { playerControlSystem } from "./playerControlSystem.js";
import { aiSystem } from "./aiSystem.js";
import { movementSystem } from "./movementSystem.js";
import { actionEconomySystem } from "./actionEconomySystem.js";
import { meleeCombatSystem } from "./meleeCombatSystem.js";
import {
  createAiMeleeAttackRequests,
  createPlayerMeleeAttackRequests,
} from "./helpers/meleeAttackRequests.js";
import { deathSystem } from "./deathSystem.js";

export function runSimulationStep({
  world,
  tilemap,
  deltaSeconds,
  movementIntent,
  attackIntent,
}) {
  playerControlSystem(world, movementIntent);
  aiSystem(world);
  movementSystem(world, tilemap, deltaSeconds);
  actionEconomySystem(world, deltaSeconds);
  meleeCombatSystem(world, [
    ...createPlayerMeleeAttackRequests(world, attackIntent),
    ...createAiMeleeAttackRequests(world),
  ]);
  deathSystem(world);
}
