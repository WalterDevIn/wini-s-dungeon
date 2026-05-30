import { addComponents, createEntity } from "../../ecs/world.js";
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
  PlayerControlled,
  Position,
  Renderable,
  Velocity,
} from "../components.js";

export function createCreature(world, definition, spawnData) {
  const creature = createEntity(world);
  const components = [
    [ComponentType.Position, Position(spawnData.position.x, spawnData.position.y)],
    [ComponentType.Velocity, Velocity()],
    [ComponentType.Renderable, Renderable(definition.renderable)],
    [ComponentType.Collider, Collider(definition.collider)],
    [ComponentType.MovementStats, MovementStats(definition.movementStats)],
    [ComponentType.Health, Health(definition.health)],
    [ComponentType.Creature, Creature(definition.creature)],
    [ComponentType.Faction, Faction(definition.faction)],
    [ComponentType.ActionEconomy, ActionEconomy()],
    [ComponentType.AttackProfile, AttackProfile(definition.attackProfile)],
    [ComponentType.DefenseProfile, DefenseProfile(definition.defenseProfile)],
    [ComponentType.DamageReduction, DamageReduction(definition.damageReduction)],
  ];

  if (definition.controls?.playerControlled) {
    components.push([ComponentType.PlayerControlled, PlayerControlled()]);
  }

  if (definition.controls?.aiControlled) {
    components.push([
      ComponentType.AIControlled,
      AIControlled(definition.controls.aiControlled),
    ]);
  }

  addComponents(world, creature, components);

  return creature;
}
