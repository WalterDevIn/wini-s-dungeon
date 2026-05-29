import { queryEntities } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";

export function findPlayerEntity(world) {
  const players = queryEntities(world, [ComponentType.PlayerControlled]);
  return players[0] ?? null;
}
