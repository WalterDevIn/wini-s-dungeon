import { getComponent, queryEntities, removeEntity } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";

export function lifetimeSystem(world, deltaSeconds) {
  const entitiesWithLifetime = queryEntities(world, [ComponentType.Lifetime]);

  for (const entityId of entitiesWithLifetime) {
    const lifetime = getComponent(world, entityId, ComponentType.Lifetime);
    lifetime.timeRemaining -= deltaSeconds;

    if (lifetime.timeRemaining <= 0) {
      removeEntity(world, entityId);
    }
  }
}
