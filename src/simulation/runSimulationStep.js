import { playerControlSystem } from "./playerControlSystem.js";
import { movementSystem } from "./movementSystem.js";
import { basicAttackSystem } from "./basicAttackSystem.js";
import { deathSystem } from "./deathSystem.js";

export function runSimulationStep({
  world,
  tilemap,
  deltaSeconds,
  movementIntent,
  basicAttackIntent,
}) {
  playerControlSystem(world, movementIntent);
  movementSystem(world, tilemap, deltaSeconds);
  basicAttackSystem(world, basicAttackIntent);
  deathSystem(world);
}
