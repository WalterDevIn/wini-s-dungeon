import { worldToScreen } from "./camera.js";

const FONT_FAMILY = "Georgia, 'Times New Roman', serif";

export function drawEntities(context, entities, pixelRatio, camera) {
  for (const entity of entities) {
    if (entity.renderable.shape === "glyph") {
      drawGlyph(context, entity.position, entity.renderable, pixelRatio, camera);
      continue;
    }

    if (entity.renderable.shape === "rect") {
      drawRect(context, entity.position, entity.renderable, pixelRatio, camera);
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
