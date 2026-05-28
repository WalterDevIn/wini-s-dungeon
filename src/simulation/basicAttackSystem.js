import { getComponent, queryEntities } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";
import { applyDamage } from "../domain/rules/damageRules.js";
import { isWithinAttackRange } from "../domain/rules/attackRules.js";

const BASIC_ATTACK_DAMAGE = 1;
const BASIC_ATTACK_RANGE = 48;

export function basicAttackSystem(world, attackIntent) {
  if (!attackIntent) {
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
        BASIC_ATTACK_RANGE,
      )
    ) {
      continue;
    }

    const health = getComponent(world, targetId, ComponentType.Health);
    applyDamage(health, BASIC_ATTACK_DAMAGE);
    return;
  }
}
