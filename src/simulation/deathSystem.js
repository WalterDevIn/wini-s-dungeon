import { getComponent, queryEntities, removeEntity } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";

export function deathSystem(world) {
  const entitiesWithHealth = queryEntities(world, [ComponentType.Health]);

  for (const entityId of entitiesWithHealth) {
    const health = getComponent(world, entityId, ComponentType.Health);

    if (health.current <= 0) {
      removeEntity(world, entityId);
    }
  }
}
