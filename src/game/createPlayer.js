import { addComponents, createEntity } from "../ecs/world.js";
import {
  Collider,
  ComponentType,
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
        shape: "rect",
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        color: "#f2c166",
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
  ]);

  return player;
}
