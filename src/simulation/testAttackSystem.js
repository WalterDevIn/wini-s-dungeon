import { getComponent, queryEntities } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";

const TEST_ATTACK_DAMAGE = 1;
const TEST_ATTACK_RANGE = 48;

export function testAttackSystem(world, testAttackIntent) {
  if (!testAttackIntent) {
    return;
  }

  const attackers = queryEntities(world, [
    ComponentType.PlayerControlled,
    ComponentType.Position,
    ComponentType.Collider,
    ComponentType.Faction,
  ]);

  if (attackers.length === 0) {
    return;
  }

  const attackerId = attackers[0];
  const attackerPosition = getComponent(world, attackerId, ComponentType.Position);
  const attackerCollider = getComponent(world, attackerId, ComponentType.Collider);
  const attackerFaction = getComponent(world, attackerId, ComponentType.Faction);

  const targets = queryEntities(world, [
    ComponentType.Health,
    ComponentType.Creature,
    ComponentType.Faction,
    ComponentType.Position,
    ComponentType.Collider,
  ]);

  for (const targetId of targets) {
    if (targetId === attackerId) {
      continue;
    }

    const targetFaction = getComponent(world, targetId, ComponentType.Faction);

    if (targetFaction.id === attackerFaction.id) {
      continue;
    }

    const targetPosition = getComponent(world, targetId, ComponentType.Position);
    const targetCollider = getComponent(world, targetId, ComponentType.Collider);

    if (
      !isWithinAttackRange(
        attackerPosition,
        attackerCollider,
        targetPosition,
        targetCollider,
      )
    ) {
      continue;
    }

    const health = getComponent(world, targetId, ComponentType.Health);
    health.current = Math.max(0, health.current - TEST_ATTACK_DAMAGE);
    return;
  }
}

function isWithinAttackRange(
  attackerPosition,
  attackerCollider,
  targetPosition,
  targetCollider,
) {
  const attackerCenter = getRectCenter(attackerPosition, attackerCollider);
  const targetCenter = getRectCenter(targetPosition, targetCollider);
  const distance = Math.hypot(
    targetCenter.x - attackerCenter.x,
    targetCenter.y - attackerCenter.y,
  );

  return distance <= TEST_ATTACK_RANGE;
}

function getRectCenter(position, collider) {
  return {
    x: position.x + collider.width / 2,
    y: position.y + collider.height / 2,
  };
}
