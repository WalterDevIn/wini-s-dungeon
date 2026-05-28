import { addComponent, createEntity } from "../ecs/world.js";
import {
  Collider,
  ComponentType,
  MovementStats,
  PlayerControlled,
  Position,
  Renderable,
  Velocity,
} from "../domain/components.js";

export function createPlayer(world) {
  const player = createEntity(world);

  addComponent(world, player, ComponentType.Position, Position(96, 96));
  addComponent(world, player, ComponentType.Velocity, Velocity());
  addComponent(
    world,
    player,
    ComponentType.Renderable,
    Renderable({
      shape: "rect",
      width: 28,
      height: 28,
      color: "#f2c166",
    }),
  );
  addComponent(
    world,
    player,
    ComponentType.Collider,
    Collider({
      width: 28,
      height: 28,
    }),
  );
  addComponent(
    world,
    player,
    ComponentType.MovementStats,
    MovementStats({ speed: 180 }),
  );
  addComponent(world, player, ComponentType.PlayerControlled, PlayerControlled());

  return player;
}
