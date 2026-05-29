import { getComponent, queryEntities } from "../../ecs/world.js";
import { ComponentType } from "../../domain/components.js";
import { getDistanceBetweenRects } from "../../domain/rules/geometryRules.js";

export function findClosestAiTarget(world, aiEntityId, aiControlled) {
  const aiPosition = getComponent(world, aiEntityId, ComponentType.Position);
  const aiCollider = getComponent(world, aiEntityId, ComponentType.Collider);

  const targets = queryEntities(world, [
    ComponentType.Health,
    ComponentType.Creature,
    ComponentType.Faction,
    ComponentType.Position,
    ComponentType.Collider,
    ComponentType.DefenseProfile,
  ]);

  let closestTargetId = null;
  let closestDistance = Infinity;

  for (const targetId of targets) {
    if (targetId === aiEntityId) {
      continue;
    }

    const targetFaction = getComponent(world, targetId, ComponentType.Faction);

    if (targetFaction.id !== aiControlled.targetFactionId) {
      continue;
    }

    const defenseProfile = getComponent(world, targetId, ComponentType.DefenseProfile);

    if (!defenseProfile.canBeHit) {
      continue;
    }

    const targetPosition = getComponent(world, targetId, ComponentType.Position);
    const targetCollider = getComponent(world, targetId, ComponentType.Collider);
    const distance = getDistanceBetweenRects(
      aiPosition,
      aiCollider,
      targetPosition,
      targetCollider,
    );

    if (distance > aiControlled.detectionRange) {
      continue;
    }

    if (distance < closestDistance) {
      closestDistance = distance;
      closestTargetId = targetId;
    }
  }

  return closestTargetId;
}
