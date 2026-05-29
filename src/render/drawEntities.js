import { getComponent, queryEntities } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";

const FONT_FAMILY = "Georgia, 'Times New Roman', serif";

export function drawEntities(context, world, pixelRatio) {
  const renderableEntities = queryEntities(world, [
    ComponentType.Position,
    ComponentType.Renderable,
  ]);

  for (const entityId of renderableEntities) {
    const position = getComponent(world, entityId, ComponentType.Position);
    const renderable = getComponent(world, entityId, ComponentType.Renderable);

    if (renderable.shape === "glyph") {
      drawGlyph(context, position, renderable, pixelRatio);
      continue;
    }

    if (renderable.shape === "rect") {
      drawRect(context, position, renderable, pixelRatio);
    }
  }
}

function drawGlyph(context, position, renderable, pixelRatio) {
  const width = renderable.width * pixelRatio;
  const height = renderable.height * pixelRatio;
  const x = position.x * pixelRatio + width / 2;
  const y = position.y * pixelRatio + height / 2;
  const fontSize = (renderable.fontSize ?? renderable.height) * pixelRatio;

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `700 ${fontSize}px ${FONT_FAMILY}`;
  context.fillStyle = renderable.color;
  context.fillText(renderable.glyph, x, y);
}

function drawRect(context, position, renderable, pixelRatio) {
  context.fillStyle = renderable.color;
  context.fillRect(
    position.x * pixelRatio,
    position.y * pixelRatio,
    renderable.width * pixelRatio,
    renderable.height * pixelRatio,
  );
}
