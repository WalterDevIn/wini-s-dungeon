import { addComponents, createEntity } from "../ecs/world.js";
import {
  Collider,
  ComponentType,
  Creature,
  DamageReduction,
  DefenseProfile,
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
        shape: "glyph",
        glyph: "e",
        width: ENEMY_SIZE,
        height: ENEMY_SIZE,
        color: "#ff6b6b",
        fontSize: 32,
      }),
    ],
    [
      ComponentType.Collider,
      Collider({
        width: ENEMY_SIZE,
        height: ENEMY_SIZE,
      }),
    ],
    [ComponentType.Health, Health({ current: 6, max: 6 })],
    [ComponentType.Creature, Creature({ kind: "enemy" })],
    [ComponentType.Faction, Faction({ id: "enemy" })],
    [ComponentType.DefenseProfile, DefenseProfile()],
    [ComponentType.DamageReduction, DamageReduction({ flat: 1 })],
  ]);

  return enemy;
}
