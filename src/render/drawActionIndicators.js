import { worldToScreen } from "./camera.js";

const WINDUP_PHASE = "windup";
const WINDUP_COLOR = "#00ff66";
const RECOVERY_COLOR = "#ffcc33";
const BASE_RING_COLOR = "rgba(244, 241, 232, 0.16)";
const SHADOW_COLOR = "rgba(0, 0, 0, 0.75)";
const INDICATOR_VERTICAL_FACTOR = 0.58;
const INDICATOR_RADIUS = 9;
const INDICATOR_LINE_WIDTH = 3;
const START_ANGLE = -Math.PI / 2;

export function drawActionIndicators(context, actionIndicators, pixelRatio, camera) {
  for (const actionIndicator of actionIndicators) {
    drawActionIndicator({
      context,
      position: actionIndicator.position,
      renderable: actionIndicator.renderable,
      phase: actionIndicator.phase,
      phaseProgress: actionIndicator.phaseProgress,
      pixelRatio,
      camera,
    });
  }
}

function drawActionIndicator({
  context,
  position,
  renderable,
  phase,
  phaseProgress,
  pixelRatio,
  camera,
}) {
  const worldCenter = {
    x: position.x + renderable.width / 2,
    y: position.y + renderable.height * INDICATOR_VERTICAL_FACTOR,
  };
  const screenCenter = worldToScreen(camera, worldCenter);
  const centerX = screenCenter.x * pixelRatio;
  const centerY = screenCenter.y * pixelRatio;
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
