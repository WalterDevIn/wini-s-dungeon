import { getComponent, queryEntities } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";
import { getDistanceBetweenRects } from "../domain/rules/geometryRules.js";
import { findClosestAiTarget } from "./helpers/aiTargeting.js";

export function aiSystem(world) {
  const aiEntities = queryEntities(world, [
    ComponentType.AIControlled,
    ComponentType.Position,
    ComponentType.Velocity,
    ComponentType.MovementStats,
    ComponentType.Faction,
    ComponentType.ActionEconomy,
    ComponentType.AttackProfile,
    ComponentType.Collider,
  ]);

  for (const entityId of aiEntities) {
    const aiControlled = getComponent(world, entityId, ComponentType.AIControlled);
    const targetId = findClosestAiTarget(world, entityId, aiControlled);
    const velocity = getComponent(world, entityId, ComponentType.Velocity);

    velocity.x = 0;
    velocity.y = 0;

    if (targetId === null) {
      continue;
    }

    updateAiMovement(world, entityId, targetId);
  }
}

function updateAiMovement(world, entityId, targetId) {
  const position = getComponent(world, entityId, ComponentType.Position);
  const collider = getComponent(world, entityId, ComponentType.Collider);
  const velocity = getComponent(world, entityId, ComponentType.Velocity);
  const movementStats = getComponent(world, entityId, ComponentType.MovementStats);
  const attackProfile = getComponent(world, entityId, ComponentType.AttackProfile);
  const actionEconomy = getComponent(world, entityId, ComponentType.ActionEconomy);
  const targetPosition = getComponent(world, targetId, ComponentType.Position);
  const targetCollider = getComponent(world, targetId, ComponentType.Collider);

  if (actionEconomy.currentAction) {
    return;
  }

  const distance = getDistanceBetweenRects(position, collider, targetPosition, targetCollider);

  if (distance === 0 || distance <= attackProfile.range * 0.9) {
    return;
  }

  velocity.x = ((targetPosition.x - position.x) / distance) * movementStats.speed;
  velocity.y = ((targetPosition.y - position.y) / distance) * movementStats.speed;
}
