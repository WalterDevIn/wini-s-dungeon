import { addComponents, createEntity } from "../ecs/world.js";
import {
  AIControlled,
  ActionEconomy,
  AttackProfile,
  Collider,
  ComponentType,
  Creature,
  DamageReduction,
  DefenseProfile,
  Faction,
  Health,
  MovementStats,
  Position,
  Renderable,
  Velocity,
} from "../domain/components.js";

const ENEMY_SIZE = 28;

export function createEnemy(world) {
  const enemy = createEntity(world);

  addComponents(world, enemy, [
    [ComponentType.Position, Position(240, 192)],
    [ComponentType.Velocity, Velocity()],
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
    [ComponentType.MovementStats, MovementStats({ speed: 120 })],
    [ComponentType.AIControlled, AIControlled({ detectionRange: 240, targetFactionId: "player" })],
    [ComponentType.Health, Health({ current: 6, max: 6 })],
    [ComponentType.Creature, Creature({ kind: "enemy" })],
    [ComponentType.Faction, Faction({ id: "enemy" })],
    [ComponentType.ActionEconomy, ActionEconomy()],
    [
      ComponentType.AttackProfile,
      AttackProfile({
        damage: 1,
        range: 42,
        windupSeconds: 0.2,
        recoverySeconds: 0.6,
      }),
    ],
    [ComponentType.DefenseProfile, DefenseProfile()],
    [ComponentType.DamageReduction, DamageReduction({ flat: 1 })],
  ]);

  return enemy;
}
