import { addComponents, createEntity } from "../ecs/world.js";
import {
  Collider,
  ComponentType,
  Creature,
  Faction,
  Health,
  Position,
  Renderable,
} from "../domain/components.js";

const ENEMY_SIZE = 28;

export function createEnemy(world) {
  const enemy = createEntity(world);

  addComponents(world, enemy, [
    [ComponentType.Position, Position(336, 192)],
    [
      ComponentType.Renderable,
      Renderable({
        shape: "rect",
        width: ENEMY_SIZE,
        height: ENEMY_SIZE,
        color: "#c95f5f",
      }),
    ],
    [
      ComponentType.Collider,
      Collider({
        width: ENEMY_SIZE,
        height: ENEMY_SIZE,
      }),
    ],
    [ComponentType.Health, Health({ current: 3, max: 3 })],
    [ComponentType.Creature, Creature({ kind: "enemy" })],
    [ComponentType.Faction, Faction({ id: "enemy" })],
  ]);

  return enemy;
}
