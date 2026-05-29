import { playerControlSystem } from "./playerControlSystem.js";
import { movementSystem } from "./movementSystem.js";
import { actionEconomySystem } from "./actionEconomySystem.js";
import { meleeCombatSystem } from "./meleeCombatSystem.js";
import { deathSystem } from "./deathSystem.js";

export function runSimulationStep({
  world,
  tilemap,
  deltaSeconds,
  movementIntent,
  attackIntent,
}) {
  playerControlSystem(world, movementIntent);
  movementSystem(world, tilemap, deltaSeconds);
  actionEconomySystem(world, deltaSeconds);
  meleeCombatSystem(world, attackIntent);
  deathSystem(world);
}
