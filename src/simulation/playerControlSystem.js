import { getComponent, queryEntities } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";

export function playerControlSystem(world, movementIntent) {
  const playerEntities = queryEntities(world, [
    ComponentType.PlayerControlled,
    ComponentType.MovementStats,
    ComponentType.Velocity,
  ]);

  for (const entityId of playerEntities) {
    const movementStats = getComponent(world, entityId, ComponentType.MovementStats);
    const velocity = getComponent(world, entityId, ComponentType.Velocity);

    velocity.x = movementIntent.x * movementStats.speed;
    velocity.y = movementIntent.y * movementStats.speed;
  }
}
