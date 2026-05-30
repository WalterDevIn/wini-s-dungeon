import { getComponent, queryEntities, removeEntity } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";
import { collidesWithSolidTile } from "../world/tilemap.js";

export function projectileMovementSystem(world, tilemap, deltaSeconds) {
  const projectiles = queryEntities(world, [
    ComponentType.Projectile,
    ComponentType.Position,
    ComponentType.Velocity,
    ComponentType.Collider,
  ]);

  for (const projectileId of projectiles) {
    const projectile = getComponent(world, projectileId, ComponentType.Projectile);
    const position = getComponent(world, projectileId, ComponentType.Position);
    const velocity = getComponent(world, projectileId, ComponentType.Velocity);
    const collider = getComponent(world, projectileId, ComponentType.Collider);

    const nextPosition = {
      x: position.x + velocity.x * deltaSeconds,
      y: position.y + velocity.y * deltaSeconds,
    };

    const nextRect = {
      x: nextPosition.x,
      y: nextPosition.y,
      width: collider.width,
      height: collider.height,
    };

    if (projectile.destroyOnWall && collidesWithSolidTile(tilemap, nextRect)) {
      removeEntity(world, projectileId);
      continue;
    }

    position.x = nextPosition.x;
    position.y = nextPosition.y;
  }
}
