import { getComponent } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";
import { findPlayerEntity } from "./playerQueries.js";

export function buildUiSnapshot({
  world,
  keyboardSnapshot,
  mouseSnapshot,
  tacticalModeSnapshot,
  lastCommand,
}) {
  const playerId = findPlayerEntity(world);
  const playerActionState = getPlayerActionState(world, playerId);

  return {
    input: {
      keyboard: keyboardSnapshot,
      mouse: mouseSnapshot,
    },
    tacticalMode: tacticalModeSnapshot,
    lastCommand: lastCommand?.type ?? "none",
    playerActionState,
  };
}

function getPlayerActionState(world, playerId) {
  if (playerId === null) {
    return createIdleActionState("missing");
  }

  const actionEconomy = getComponent(world, playerId, ComponentType.ActionEconomy);

  if (!actionEconomy || !actionEconomy.currentAction) {
    return createIdleActionState("ready");
  }

  const attackProfile = getComponent(world, playerId, ComponentType.AttackProfile);
  const phaseDuration = getActionPhaseDuration(actionEconomy, attackProfile);
  const phaseProgress = getActionPhaseProgress(actionEconomy.timeRemaining, phaseDuration);

  return {
    status: actionEconomy.phase ?? "active",
    currentAction: actionEconomy.currentAction,
    phase: actionEconomy.phase,
    timeRemaining: actionEconomy.timeRemaining,
    phaseDuration,
    phaseProgress,
  };
}

function createIdleActionState(status) {
  return {
    status,
    currentAction: null,
    phase: null,
    timeRemaining: 0,
    phaseDuration: 0,
    phaseProgress: 0,
  };
}

function getActionPhaseDuration(actionEconomy, attackProfile) {
  if (actionEconomy.phase === "windup") {
    return attackProfile?.windupSeconds ?? 0;
  }

  if (actionEconomy.phase === "recovery") {
    return actionEconomy.pendingAttack?.recoverySeconds ?? attackProfile?.recoverySeconds ?? 0;
  }

  return 0;
}

function getActionPhaseProgress(timeRemaining, phaseDuration) {
  if (phaseDuration <= 0) {
    return 0;
  }

  return clamp(1 - timeRemaining / phaseDuration, 0, 1);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
