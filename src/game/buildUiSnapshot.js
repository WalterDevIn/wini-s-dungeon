import { getComponent } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";
import { findPlayerEntity } from "./playerQueries.js";

export function buildUiSnapshot({ world, mouseSnapshot, lastCommand }) {
  const playerId = findPlayerEntity(world);
  const playerActionState = getPlayerActionState(world, playerId);

  return {
    input: {
      leftButtonPressed: mouseSnapshot.leftButtonPressed,
    },
    lastCommand: lastCommand?.type ?? "none",
    playerActionState,
  };
}

function getPlayerActionState(world, playerId) {
  if (playerId === null) {
    return {
      status: "missing",
      currentAction: null,
      phase: null,
      timeRemaining: 0,
    };
  }

  const actionEconomy = getComponent(world, playerId, ComponentType.ActionEconomy);

  if (!actionEconomy || !actionEconomy.currentAction) {
    return {
      status: "ready",
      currentAction: null,
      phase: null,
      timeRemaining: 0,
    };
  }

  return {
    status: actionEconomy.phase ?? "active",
    currentAction: actionEconomy.currentAction,
    phase: actionEconomy.phase,
    timeRemaining: actionEconomy.timeRemaining,
  };
}
