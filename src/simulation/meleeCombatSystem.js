import { getComponent, queryEntities } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";
import { applyDamage } from "../domain/rules/damageRules.js";
import { findFirstMeleeTarget } from "./helpers/meleeHitDetection.js";

const MELEE_ATTACK_ACTION = "meleeAttack";
const WINDUP_PHASE = "windup";
const RECOVERY_PHASE = "recovery";

export function meleeCombatSystem(world, attackRequests = []) {
  const attackers = queryEntities(world, [
    ComponentType.ActionEconomy,
    ComponentType.AttackProfile,
    ComponentType.Position,
    ComponentType.Collider,
    ComponentType.Faction,
  ]);

  const requestedAttackers = new Set(attackRequests);

  for (const attackerId of attackers) {
    const actionEconomy = getComponent(world, attackerId, ComponentType.ActionEconomy);

    resolveMeleeAction(world, attackerId, actionEconomy);

    if (requestedAttackers.has(attackerId)) {
      startMeleeAttack(world, attackerId, actionEconomy);
    }
  }
}

function startMeleeAttack(world, attackerId, actionEconomy) {
  if (actionEconomy.currentAction) {
    return;
  }

  const attackProfile = getComponent(world, attackerId, ComponentType.AttackProfile);

  actionEconomy.currentAction = MELEE_ATTACK_ACTION;
  actionEconomy.phase = WINDUP_PHASE;
  actionEconomy.timeRemaining = attackProfile.windupSeconds;
  actionEconomy.phaseDuration = attackProfile.windupSeconds;
  actionEconomy.pendingAttack = {
    damage: attackProfile.damage,
    range: attackProfile.range,
    recoverySeconds: attackProfile.recoverySeconds,
  };
}

function resolveMeleeAction(world, attackerId, actionEconomy) {
  if (actionEconomy.currentAction !== MELEE_ATTACK_ACTION) {
    return;
  }

  if (actionEconomy.timeRemaining > 0) {
    return;
  }

  if (actionEconomy.phase === WINDUP_PHASE) {
    resolveMeleeImpact(world, attackerId, actionEconomy);
    actionEconomy.phase = RECOVERY_PHASE;
    actionEconomy.timeRemaining = actionEconomy.pendingAttack.recoverySeconds;
    actionEconomy.phaseDuration = actionEconomy.pendingAttack.recoverySeconds;
    return;
  }

  if (actionEconomy.phase === RECOVERY_PHASE) {
    clearCurrentAction(actionEconomy);
  }
}

function resolveMeleeImpact(world, attackerId, actionEconomy) {
  const targetId = findFirstMeleeTarget(world, attackerId, actionEconomy.pendingAttack);

  if (targetId === null) {
    return;
  }

  const targetHealth = getComponent(world, targetId, ComponentType.Health);
  const targetDamageReduction = getComponent(
    world,
    targetId,
    ComponentType.DamageReduction,
  );

  applyDamage(targetHealth, actionEconomy.pendingAttack.damage, targetDamageReduction);
}

function clearCurrentAction(actionEconomy) {
  actionEconomy.currentAction = null;
  actionEconomy.phase = null;
  actionEconomy.timeRemaining = 0;
  actionEconomy.phaseDuration = 0;
  actionEconomy.pendingAttack = null;
}
