import { getComponent, queryEntities } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";

export function actionEconomySystem(world, deltaSeconds) {
  const entities = queryEntities(world, [ComponentType.ActionEconomy]);

  for (const entityId of entities) {
    const actionEconomy = getComponent(world, entityId, ComponentType.ActionEconomy);

    if (!actionEconomy.currentAction) {
      continue;
    }

    actionEconomy.timeRemaining = Math.max(
      0,
      actionEconomy.timeRemaining - deltaSeconds,
    );
  }
}
