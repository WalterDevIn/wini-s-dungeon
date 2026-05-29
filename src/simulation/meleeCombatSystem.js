import { getComponent, queryEntities } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";
import { applyDamage } from "../domain/rules/damageRules.js";
import { findFirstMeleeTarget } from "./helpers/meleeHitDetection.js";

export function meleeCombatSystem(world, attackIntent) {
  if (!attackIntent) {
    return;
  }

  const attackers = queryEntities(world, [
    ComponentType.PlayerControlled,
    ComponentType.ActionEconomy,
    ComponentType.AttackProfile,
    ComponentType.Position,
    ComponentType.Collider,
    ComponentType.Faction,
  ]);

  if (attackers.length === 0) {
    return;
  }

  const attackerId = attackers[0];
  const actionEconomy = getComponent(world, attackerId, ComponentType.ActionEconomy);

  if (actionEconomy.attackCooldownRemaining > 0) {
    return;
  }

  const attackProfile = getComponent(world, attackerId, ComponentType.AttackProfile);
  const targetId = findFirstMeleeTarget(world, attackerId, attackProfile);

  actionEconomy.attackCooldownRemaining = attackProfile.cooldownSeconds;

  if (targetId === null) {
    return;
  }

  const targetHealth = getComponent(world, targetId, ComponentType.Health);
  const targetDamageReduction = getComponent(
    world,
    targetId,
    ComponentType.DamageReduction,
  );

  applyDamage(targetHealth, attackProfile.damage, targetDamageReduction);
}
