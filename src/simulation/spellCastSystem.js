import { getComponent, queryEntities } from "../ecs/world.js";
import { CommandType } from "../domain/commands.js";
import { ComponentType } from "../domain/components.js";
import { getSpellDefinition } from "../content/spells/spellRegistry.js";
import { createSpellProjectile } from "./helpers/spellProjectileFactory.js";

const SPELL_CAST_ACTION = "spellCast";
const WINDUP_PHASE = "windup";
const RECOVERY_PHASE = "recovery";
const SUPPORTED_EFFECTS = Object.freeze({
  SpawnProjectile: "spawnProjectile",
});

export function spellCastSystem(world, commands, aimIntent = null) {
  updatePendingSpellTargets(world, aimIntent);
  resolveSpellActions(world);
  startRequestedSpellCasts(world, commands);
}

function updatePendingSpellTargets(world, aimIntent) {
  if (!aimIntent?.targetPoint?.hasPosition) {
    return;
  }

  const casters = queryEntities(world, [ComponentType.ActionEconomy]);

  for (const casterId of casters) {
    const actionEconomy = getComponent(world, casterId, ComponentType.ActionEconomy);

    if (
      actionEconomy.currentAction !== SPELL_CAST_ACTION ||
      actionEconomy.phase !== WINDUP_PHASE ||
      !actionEconomy.pendingSpell
    ) {
      continue;
    }

    actionEconomy.pendingSpell.targetPoint = {
      x: aimIntent.targetPoint.x,
      y: aimIntent.targetPoint.y,
      hasPosition: true,
    };
  }
}

function resolveSpellActions(world) {
  const casters = queryEntities(world, [ComponentType.ActionEconomy]);

  for (const casterId of casters) {
    const actionEconomy = getComponent(world, casterId, ComponentType.ActionEconomy);

    if (actionEconomy.currentAction !== SPELL_CAST_ACTION) {
      continue;
    }

    if (actionEconomy.timeRemaining > 0) {
      continue;
    }

    if (actionEconomy.phase === WINDUP_PHASE) {
      resolveSpellEffect(world, casterId, actionEconomy);
      actionEconomy.phase = RECOVERY_PHASE;
      actionEconomy.timeRemaining = actionEconomy.pendingSpell.recoverySeconds;
      actionEconomy.phaseDuration = actionEconomy.pendingSpell.recoverySeconds;
      return;
    }

    if (actionEconomy.phase === RECOVERY_PHASE) {
      clearCurrentSpellAction(actionEconomy);
    }
  }
}

function startRequestedSpellCasts(world, commands) {
  for (const command of commands) {
    if (command.type !== CommandType.Cast) {
      continue;
    }

    if (!command.initialTargetPoint?.hasPosition) {
      continue;
    }

    const actionEconomy = getComponent(world, command.actorId, ComponentType.ActionEconomy);

    if (!actionEconomy || actionEconomy.currentAction) {
      continue;
    }

    const spellDefinition = getSpellDefinition(command.spellId);

    if (!isSupportedSpell(spellDefinition)) {
      continue;
    }

    actionEconomy.currentAction = SPELL_CAST_ACTION;
    actionEconomy.phase = WINDUP_PHASE;
    actionEconomy.timeRemaining = spellDefinition.cast.windupSeconds;
    actionEconomy.phaseDuration = spellDefinition.cast.windupSeconds;
    actionEconomy.pendingSpell = {
      spellDefinition,
      targetPoint: {
        x: command.initialTargetPoint.x,
        y: command.initialTargetPoint.y,
        hasPosition: true,
      },
      recoverySeconds: spellDefinition.cast.recoverySeconds,
    };
  }
}

function resolveSpellEffect(world, casterId, actionEconomy) {
  const pendingSpell = actionEconomy.pendingSpell;
  const spellDefinition = pendingSpell.spellDefinition;

  if (spellDefinition.effect.type === SUPPORTED_EFFECTS.SpawnProjectile) {
    createSpellProjectile({
      world,
      actorId: casterId,
      targetPoint: pendingSpell.targetPoint,
      spellDefinition,
    });
  }
}

function isSupportedSpell(spellDefinition) {
  return (
    Boolean(spellDefinition) &&
    spellDefinition.effect?.type === SUPPORTED_EFFECTS.SpawnProjectile &&
    Number.isFinite(spellDefinition.cast?.windupSeconds) &&
    Number.isFinite(spellDefinition.cast?.recoverySeconds)
  );
}

function clearCurrentSpellAction(actionEconomy) {
  actionEconomy.currentAction = null;
  actionEconomy.phase = null;
  actionEconomy.timeRemaining = 0;
  actionEconomy.phaseDuration = 0;
  actionEconomy.pendingSpell = null;
}
