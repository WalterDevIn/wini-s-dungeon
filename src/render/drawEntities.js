import { getComponent, queryEntities } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";
import { worldToScreen } from "./camera.js";

const FONT_FAMILY = "Georgia, 'Times New Roman', serif";

export function drawEntities(context, world, pixelRatio, camera) {
  const renderableEntities = queryEntities(world, [
    ComponentType.Position,
    ComponentType.Renderable,
  ]);

  for (const entityId of renderableEntities) {
    const position = getComponent(world, entityId, ComponentType.Position);
    const renderable = getComponent(world, entityId, ComponentType.Renderable);

    if (renderable.shape === "glyph") {
      drawGlyph(context, position, renderable, pixelRatio, camera);
      continue;
    }

    if (renderable.shape === "rect") {
      drawRect(context, position, renderable, pixelRatio, camera);
    }
  }
}

function drawGlyph(context, position, renderable, pixelRatio, camera) {
  const screenPosition = worldToScreen(camera, position);
  const width = renderable.width * pixelRatio;
  const height = renderable.height * pixelRatio;
  const x = screenPosition.x * pixelRatio + width / 2;
  const y = screenPosition.y * pixelRatio + height / 2;
  const fontSize = (renderable.fontSize ?? renderable.height) * pixelRatio;

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `700 ${fontSize}px ${FONT_FAMILY}`;
  context.fillStyle = renderable.color;
  context.fillText(renderable.glyph, x, y);
}

function drawRect(context, position, renderable, pixelRatio, camera) {
  const screenPosition = worldToScreen(camera, position);

  context.fillStyle = renderable.color;
  context.fillRect(
    screenPosition.x * pixelRatio,
    screenPosition.y * pixelRatio,
    renderable.width * pixelRatio,
    renderable.height * pixelRatio,
  );
}
