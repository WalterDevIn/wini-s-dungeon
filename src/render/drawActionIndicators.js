import { getComponent, queryEntities } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";

const WINDUP_PHASE = "windup";
const RECOVERY_PHASE = "recovery";
const WINDUP_COLOR = "#00ff66";
const RECOVERY_COLOR = "#ffcc33";
const BASE_RING_COLOR = "rgba(244, 241, 232, 0.16)";
const SHADOW_COLOR = "rgba(0, 0, 0, 0.75)";
const INDICATOR_OFFSET = 8;
const INDICATOR_RADIUS = 9;
const INDICATOR_LINE_WIDTH = 3;
const START_ANGLE = -Math.PI / 2;

export function drawActionIndicators(context, world, pixelRatio) {
  const actionEntities = queryEntities(world, [
    ComponentType.Position,
    ComponentType.Renderable,
    ComponentType.ActionEconomy,
    ComponentType.AIControlled,
  ]);

  for (const entityId of actionEntities) {
    const actionEconomy = getComponent(world, entityId, ComponentType.ActionEconomy);

    if (!shouldDrawActionIndicator(actionEconomy)) {
      continue;
    }

    const position = getComponent(world, entityId, ComponentType.Position);
    const renderable = getComponent(world, entityId, ComponentType.Renderable);
    const phaseProgress = getActionPhaseProgress(
      actionEconomy.timeRemaining,
      actionEconomy.phaseDuration,
    );

    drawActionIndicator({
      context,
      position,
      renderable,
      phase: actionEconomy.phase,
      phaseProgress,
      pixelRatio,
    });
  }
}

function shouldDrawActionIndicator(actionEconomy) {
  return actionEconomy.phase === WINDUP_PHASE || actionEconomy.phase === RECOVERY_PHASE;
}

function drawActionIndicator({
  context,
  position,
  renderable,
  phase,
  phaseProgress,
  pixelRatio,
}) {
  const centerX = (position.x + renderable.width / 2) * pixelRatio;
  const centerY =
    (position.y + renderable.height + INDICATOR_OFFSET) * pixelRatio;
  const radius = INDICATOR_RADIUS * pixelRatio;
  const lineWidth = INDICATOR_LINE_WIDTH * pixelRatio;
  const endAngle = START_ANGLE + phaseProgress * Math.PI * 2;

  context.save();
  context.lineCap = "round";
  context.lineWidth = lineWidth;
  context.shadowColor = SHADOW_COLOR;
  context.shadowBlur = 6 * pixelRatio;

  context.strokeStyle = BASE_RING_COLOR;
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, Math.PI * 2);
  context.stroke();

  context.strokeStyle = getPhaseColor(phase);
  context.beginPath();
  context.arc(centerX, centerY, radius, START_ANGLE, endAngle);
  context.stroke();

  context.restore();
}

function getPhaseColor(phase) {
  if (phase === WINDUP_PHASE) {
    return WINDUP_COLOR;
  }

  return RECOVERY_COLOR;
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
