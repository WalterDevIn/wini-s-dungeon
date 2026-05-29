import { getComponent, queryEntities } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";

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
    const targetId = findClosestTarget(world, entityId, aiControlled);
    const velocity = getComponent(world, entityId, ComponentType.Velocity);

    velocity.x = 0;
    velocity.y = 0;

    if (targetId === null) {
      continue;
    }

    updateAiMovement(world, entityId, targetId);
  }
}

function findClosestTarget(world, aiEntityId, aiControlled) {
  const aiPosition = getComponent(world, aiEntityId, ComponentType.Position);
  const aiCollider = getComponent(world, aiEntityId, ComponentType.Collider);
  const aiCenter = getRectCenter(aiPosition, aiCollider);

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
    const targetCenter = getRectCenter(targetPosition, targetCollider);
    const distance = Math.hypot(targetCenter.x - aiCenter.x, targetCenter.y - aiCenter.y);

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

  const center = getRectCenter(position, collider);
  const targetCenter = getRectCenter(targetPosition, targetCollider);
  const deltaX = targetCenter.x - center.x;
  const deltaY = targetCenter.y - center.y;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance === 0 || distance <= attackProfile.range * 0.9) {
    return;
  }

  velocity.x = (deltaX / distance) * movementStats.speed;
  velocity.y = (deltaY / distance) * movementStats.speed;
}

function getRectCenter(position, collider) {
  return {
    x: position.x + collider.width / 2,
    y: position.y + collider.height / 2,
  };
}
