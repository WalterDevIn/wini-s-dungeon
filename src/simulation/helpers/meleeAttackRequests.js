import { getComponent, queryEntities } from "../../ecs/world.js";
import { ComponentType } from "../../domain/components.js";
import { findFirstMeleeTarget } from "./meleeHitDetection.js";

export function createPlayerMeleeAttackRequests(world, attackIntent) {
  if (!attackIntent) {
    return [];
  }

  return queryEntities(world, [
    ComponentType.PlayerControlled,
    ComponentType.ActionEconomy,
    ComponentType.AttackProfile,
    ComponentType.Position,
    ComponentType.Collider,
    ComponentType.Faction,
  ]);
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
