import { getComponent, queryEntities } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";

export function findPlayerEntity(world) {
  const players = queryEntities(world, [ComponentType.PlayerControlled]);
  return players[0] ?? null;
}

export function getPlayerCenterPoint(world) {
  const playerId = findPlayerEntity(world);

  if (playerId === null) {
    return { x: 0, y: 0 };
  }

  const position = getComponent(world, playerId, ComponentType.Position);
  const renderable = getComponent(world, playerId, ComponentType.Renderable);

  if (!position || !renderable) {
    return { x: 0, y: 0 };
  }

  return {
    x: position.x + renderable.width / 2,
    y: position.y + renderable.height / 2,
  };
}
