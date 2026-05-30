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
  const playerHealth = getPlayerHealth(world, playerId);

  return {
    input: {
      keyboard: keyboardSnapshot,
      mouse: mouseSnapshot,
    },
    tacticalMode: tacticalModeSnapshot,
    lastCommand: lastCommand?.type ?? "none",
    playerActionState,
    playerHealth,
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

  const phaseDuration = actionEconomy.phaseDuration;
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

function getPlayerHealth(world, playerId) {
  if (playerId === null) {
    return createEmptyHealthState();
  }

  const health = getComponent(world, playerId, ComponentType.Health);

  if (!health) {
    return createEmptyHealthState();
  }

  return {
    current: health.current,
    max: health.max,
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

function createEmptyHealthState() {
  return {
    current: 0,
    max: 0,
  };
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
