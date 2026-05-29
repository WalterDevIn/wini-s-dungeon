import { getComponent, queryEntities } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";
import { moveWithTileCollision } from "./helpers/movementCollision.js";

export function movementSystem(world, tilemap, deltaSeconds) {
  const movingEntities = queryEntities(world, [
    ComponentType.Position,
    ComponentType.Velocity,
    ComponentType.Collider,
  ]);

  for (const entityId of movingEntities) {
    const position = getComponent(world, entityId, ComponentType.Position);
    const velocity = getComponent(world, entityId, ComponentType.Velocity);
    const collider = getComponent(world, entityId, ComponentType.Collider);

    moveWithTileCollision(
      tilemap,
      position,
      collider,
      velocity.x * deltaSeconds,
      velocity.y * deltaSeconds,
    );
  }
}
