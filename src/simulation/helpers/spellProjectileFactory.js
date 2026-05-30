import { addComponents, createEntity, getComponent } from "../../ecs/world.js";
import {
  Collider,
  ComponentType,
  DamageOnHit,
  Faction,
  Lifetime,
  Position,
  Projectile,
  Renderable,
  Velocity,
} from "../../domain/components.js";
import { getRectCenter } from "../../domain/rules/geometryRules.js";

export function createSpellProjectile({ world, actorId, targetPoint, spellDefinition }) {
  const actorPosition = getComponent(world, actorId, ComponentType.Position);
  const actorCollider = getComponent(world, actorId, ComponentType.Collider);
  const actorFaction = getComponent(world, actorId, ComponentType.Faction);

  if (!actorPosition || !actorCollider || !actorFaction) {
    return null;
  }

  const projectileDefinition = spellDefinition.effect.projectile;
  const origin = getRectCenter(actorPosition, actorCollider);
  const deltaX = targetPoint.x - origin.x;
  const deltaY = targetPoint.y - origin.y;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance === 0) {
    return null;
  }

  const directionX = deltaX / distance;
  const directionY = deltaY / distance;
  const projectileSize = projectileDefinition.size;
  const projectile = createEntity(world);

  addComponents(world, projectile, [
    [
      ComponentType.Position,
      Position(
        origin.x - projectileSize / 2,
        origin.y - projectileSize / 2,
      ),
    ],
    [
      ComponentType.Velocity,
      Velocity(
        directionX * projectileDefinition.speed,
        directionY * projectileDefinition.speed,
      ),
    ],
    [
      ComponentType.Renderable,
      Renderable({
        shape: projectileDefinition.glyph ? "glyph" : "rect",
        width: projectileSize,
        height: projectileSize,
        color: projectileDefinition.color,
        glyph: projectileDefinition.glyph ?? null,
        fontSize: projectileDefinition.fontSize ?? projectileSize,
      }),
    ],
    [
      ComponentType.Collider,
      Collider({
        width: projectileSize,
        height: projectileSize,
      }),
    ],
    [ComponentType.Faction, Faction({ id: actorFaction.id })],
    [
      ComponentType.Projectile,
      Projectile({
        ownerId: actorId,
        destroyOnWall: projectileDefinition.destroyOnWall,
        destroyOnHit: projectileDefinition.destroyOnHit,
      }),
    ],
    [
      ComponentType.Lifetime,
      Lifetime({ timeRemaining: projectileDefinition.lifetimeSeconds }),
    ],
    [ComponentType.DamageOnHit, DamageOnHit({ damage: projectileDefinition.damage })],
  ]);

  return projectile;
}
