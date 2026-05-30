import { getComponent, queryEntities } from "../../ecs/world.js";
import { ComponentType } from "../../domain/components.js";
import { rectsOverlap } from "../../domain/rules/geometryRules.js";

export function findFirstProjectileTarget(world, projectileId) {
  const projectilePosition = getComponent(world, projectileId, ComponentType.Position);
  const projectileCollider = getComponent(world, projectileId, ComponentType.Collider);
  const projectileFaction = getComponent(world, projectileId, ComponentType.Faction);

  const targets = queryEntities(world, [
    ComponentType.Health,
    ComponentType.Creature,
    ComponentType.Faction,
    ComponentType.Position,
    ComponentType.Collider,
    ComponentType.DefenseProfile,
  ]);

  for (const targetId of targets) {
    if (targetId === projectileId) {
      continue;
    }

    const targetFaction = getComponent(world, targetId, ComponentType.Faction);

    if (targetFaction.id === projectileFaction.id) {
      continue;
    }

    const defenseProfile = getComponent(world, targetId, ComponentType.DefenseProfile);

    if (!defenseProfile.canBeHit) {
      continue;
    }

    const targetPosition = getComponent(world, targetId, ComponentType.Position);
    const targetCollider = getComponent(world, targetId, ComponentType.Collider);

    if (
      rectsOverlap(
        projectilePosition,
        projectileCollider,
        targetPosition,
        targetCollider,
      )
    ) {
      return targetId;
    }
  }

  return null;
}
