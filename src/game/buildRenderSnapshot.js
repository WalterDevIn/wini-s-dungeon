import { getComponent, queryEntities } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";

const WINDUP_PHASE = "windup";
const RECOVERY_PHASE = "recovery";

export function buildRenderSnapshot({ world, tilemap, camera }) {
  return {
    tilemap,
    camera,
    entities: buildRenderableEntitySnapshots(world),
    actionIndicators: buildActionIndicatorSnapshots(world),
  };
}

function buildRenderableEntitySnapshots(world) {
  const entityIds = queryEntities(world, [
    ComponentType.Position,
    ComponentType.Renderable,
  ]);

  return entityIds.map((entityId) => {
    const position = getComponent(world, entityId, ComponentType.Position);
    const renderable = getComponent(world, entityId, ComponentType.Renderable);
    const playerControlled = getComponent(world, entityId, ComponentType.PlayerControlled);

    return {
      position: { ...position },
      renderable: { ...renderable },
      isPlayer: Boolean(playerControlled),
    };
  });
}

function buildActionIndicatorSnapshots(world) {
  const entityIds = queryEntities(world, [
    ComponentType.Position,
    ComponentType.Renderable,
    ComponentType.ActionEconomy,
    ComponentType.AIControlled,
  ]);

  return entityIds.flatMap((entityId) => {
    const actionEconomy = getComponent(world, entityId, ComponentType.ActionEconomy);

    if (!shouldShowActionIndicator(actionEconomy)) {
      return [];
    }

    const position = getComponent(world, entityId, ComponentType.Position);
    const renderable = getComponent(world, entityId, ComponentType.Renderable);

    return [
      {
        position: { ...position },
        renderable: { ...renderable },
        phase: actionEconomy.phase,
        phaseProgress: getActionPhaseProgress(
          actionEconomy.timeRemaining,
          actionEconomy.phaseDuration,
        ),
      },
    ];
  });
}

function shouldShowActionIndicator(actionEconomy) {
  return actionEconomy.phase === WINDUP_PHASE || actionEconomy.phase === RECOVERY_PHASE;
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
