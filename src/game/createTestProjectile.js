import { addComponents, createEntity } from "../ecs/world.js";
import {
  Collider,
  ComponentType,
  DamageOnHit,
  Faction,
  Lifetime,
  Position,
  Projectile,
  Renderable,
  Velocity,
} from "../domain/components.js";

const TEST_PROJECTILE_SIZE = 12;

export function createTestProjectile(world) {
  const projectile = createEntity(world);

  addComponents(world, projectile, [
    [ComponentType.Position, Position(152, 200)],
    [ComponentType.Velocity, Velocity(150, 0)],
    [
      ComponentType.Renderable,
      Renderable({
        shape: "rect",
        width: TEST_PROJECTILE_SIZE,
        height: TEST_PROJECTILE_SIZE,
        color: "#66ccff",
      }),
    ],
    [
      ComponentType.Collider,
      Collider({
        width: TEST_PROJECTILE_SIZE,
        height: TEST_PROJECTILE_SIZE,
      }),
    ],
    [ComponentType.Faction, Faction({ id: "player" })],
    [ComponentType.Projectile, Projectile({ destroyOnWall: true, destroyOnHit: true })],
    [ComponentType.Lifetime, Lifetime({ timeRemaining: 3 })],
    [ComponentType.DamageOnHit, DamageOnHit({ damage: 3 })],
  ]);

  return projectile;
}
