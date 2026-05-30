import { getComponent, queryEntities, removeEntity } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";
import { applyDamage } from "../domain/rules/damageRules.js";
import { findFirstProjectileTarget } from "./helpers/projectileHitDetection.js";

export function projectileImpactSystem(world) {
  const projectiles = queryEntities(world, [
    ComponentType.Projectile,
    ComponentType.DamageOnHit,
    ComponentType.Position,
    ComponentType.Collider,
    ComponentType.Faction,
  ]);

  for (const projectileId of projectiles) {
    const targetId = findFirstProjectileTarget(world, projectileId);

    if (targetId === null) {
      continue;
    }

    const projectile = getComponent(world, projectileId, ComponentType.Projectile);
    const damageOnHit = getComponent(world, projectileId, ComponentType.DamageOnHit);
    const targetHealth = getComponent(world, targetId, ComponentType.Health);
    const targetDamageReduction = getComponent(
      world,
      targetId,
      ComponentType.DamageReduction,
    );

    applyDamage(targetHealth, damageOnHit.damage, targetDamageReduction);

    if (projectile.destroyOnHit) {
      removeEntity(world, projectileId);
    }
  }
}
