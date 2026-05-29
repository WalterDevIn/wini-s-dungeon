import { addComponents, createEntity } from "../ecs/world.js";
import {
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
  PlayerControlled,
  Position,
  Renderable,
  Velocity,
} from "../domain/components.js";

const PLAYER_SIZE = 28;

export function createPlayer(world) {
  const player = createEntity(world);

  addComponents(world, player, [
    [ComponentType.Position, Position(96, 96)],
    [ComponentType.Velocity, Velocity()],
    [
      ComponentType.Renderable,
      Renderable({
        shape: "glyph",
        glyph: "@",
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        color: "#f5e6b8",
        fontSize: 34,
      }),
    ],
    [
      ComponentType.Collider,
      Collider({
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
      }),
    ],
    [ComponentType.MovementStats, MovementStats({ speed: 180 })],
    [ComponentType.PlayerControlled, PlayerControlled()],
    [ComponentType.Health, Health({ current: 10, max: 10 })],
    [ComponentType.Creature, Creature({ kind: "player" })],
    [ComponentType.Faction, Faction({ id: "player" })],
    [ComponentType.ActionEconomy, ActionEconomy()],
    [
      ComponentType.AttackProfile,
      AttackProfile({ damage: 2, range: 48, cooldownSeconds: 0.45 }),
    ],
    [ComponentType.DefenseProfile, DefenseProfile()],
    [ComponentType.DamageReduction, DamageReduction({ flat: 0 })],
  ]);

  return player;
}
