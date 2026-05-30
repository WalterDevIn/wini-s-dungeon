import { playerControlSystem } from "./playerControlSystem.js";
import { aiSystem } from "./aiSystem.js";
import { movementSystem } from "./movementSystem.js";
import { spellCastSystem } from "./spellCastSystem.js";
import { projectileMovementSystem } from "./projectileMovementSystem.js";
import { projectileImpactSystem } from "./projectileImpactSystem.js";
import { actionEconomySystem } from "./actionEconomySystem.js";
import { meleeCombatSystem } from "./meleeCombatSystem.js";
import {
  createAiMeleeAttackRequests,
  createPlayerMeleeAttackRequests,
} from "./helpers/meleeAttackRequests.js";
import { lifetimeSystem } from "./lifetimeSystem.js";
import { deathSystem } from "./deathSystem.js";

export function runSimulationStep({
  world,
  tilemap,
  deltaSeconds,
  movementIntent,
  commands = [],
  aimIntent = null,
}) {
  playerControlSystem(world, movementIntent);
  aiSystem(world);
  movementSystem(world, tilemap, deltaSeconds);
  spellCastSystem(world, commands, aimIntent);
  projectileMovementSystem(world, tilemap, deltaSeconds);
  projectileImpactSystem(world);
  actionEconomySystem(world, deltaSeconds);
  meleeCombatSystem(world, [
    ...createPlayerMeleeAttackRequests(commands),
    ...createAiMeleeAttackRequests(world),
  ]);
  lifetimeSystem(world, deltaSeconds);
  deathSystem(world);
}
