import { getComponent, queryEntities } from "../../ecs/world.js";
import { ComponentType } from "../../domain/components.js";
import { isWithinAttackRange } from "../../domain/rules/attackRules.js";

export function findFirstMeleeTarget(world, attackerId, attackProfile) {
  const attackerPosition = getComponent(world, attackerId, ComponentType.Position);
  const attackerCollider = getComponent(world, attackerId, ComponentType.Collider);
  const attackerFaction = getComponent(world, attackerId, ComponentType.Faction);

  const targets = queryEntities(world, [
    ComponentType.Health,
    ComponentType.Creature,
    ComponentType.Faction,
    ComponentType.Position,
    ComponentType.Collider,
    ComponentType.DefenseProfile,
  ]);

  for (const targetId of targets) {
    if (targetId === attackerId) {
      continue;
    }

    const targetFaction = getComponent(world, targetId, ComponentType.Faction);

    if (targetFaction.id === attackerFaction.id) {
      continue;
    }

    const defenseProfile = getComponent(world, targetId, ComponentType.DefenseProfile);

    if (!defenseProfile.canBeHit) {
      continue;
    }

    const targetPosition = getComponent(world, targetId, ComponentType.Position);
    const targetCollider = getComponent(world, targetId, ComponentType.Collider);

    if (
      isWithinAttackRange(
        attackerPosition,
        attackerCollider,
        targetPosition,
        targetCollider,
        attackProfile.range,
      )
    ) {
      return targetId;
    }
  }

  return null;
}
