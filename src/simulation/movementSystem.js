import { getComponent, queryEntities } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";
import { collidesWithSolidTile } from "../world/tilemap.js";

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

    moveAxis(tilemap, position, collider, velocity.x * deltaSeconds, 0);
    moveAxis(tilemap, position, collider, 0, velocity.y * deltaSeconds);
  }
}

function moveAxis(tilemap, position, collider, deltaX, deltaY) {
  if (deltaX === 0 && deltaY === 0) {
    return;
  }

  const nextPosition = {
    x: position.x + deltaX,
    y: position.y + deltaY,
  };

  const nextRect = {
    x: nextPosition.x,
    y: nextPosition.y,
    width: collider.width,
    height: collider.height,
  };

  if (collidesWithSolidTile(tilemap, nextRect)) {
    return;
  }

  position.x = nextPosition.x;
  position.y = nextPosition.y;
}
