import { getComponent, queryEntities } from "../../ecs/world.js";
import { CommandType } from "../../domain/commands.js";
import { ComponentType } from "../../domain/components.js";
import { findFirstMeleeTarget } from "./meleeHitDetection.js";

export function createPlayerMeleeAttackRequests(commands) {
  return commands
    .filter((command) => command.type === CommandType.Attack)
    .map((command) => command.actorId);
}

export function createAiMeleeAttackRequests(world) {
  const aiAttackers = queryEntities(world, [
    ComponentType.AIControlled,
    ComponentType.ActionEconomy,
    ComponentType.AttackProfile,
    ComponentType.Position,
    ComponentType.Collider,
    ComponentType.Faction,
  ]);

  return aiAttackers.filter((attackerId) => {
    const actionEconomy = getComponent(world, attackerId, ComponentType.ActionEconomy);

    if (actionEconomy.currentAction) {
      return false;
    }

    const attackProfile = getComponent(world, attackerId, ComponentType.AttackProfile);
    return findFirstMeleeTarget(world, attackerId, attackProfile) !== null;
  });
}
