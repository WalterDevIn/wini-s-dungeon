import { getComponent, queryEntities } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";

const FONT_FAMILY = "Georgia, 'Times New Roman', serif";

export function createCanvasRenderer(canvas, context) {
  function resizeCanvas() {
    const pixelRatio = window.devicePixelRatio || 1;
    const width = Math.floor(window.innerWidth * pixelRatio);
    const height = Math.floor(window.innerHeight * pixelRatio);

    if (canvas.width === width && canvas.height === height) {
      return;
    }

    canvas.width = width;
    canvas.height = height;
  }

  function clearFrame() {
    context.fillStyle = "#050505";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  function renderTilemap(tilemap) {
    const pixelRatio = window.devicePixelRatio || 1;
    const tileSize = tilemap.tileSize * pixelRatio;

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `${Math.floor(tileSize * 0.72)}px ${FONT_FAMILY}`;

    for (let y = 0; y < tilemap.height; y += 1) {
      for (let x = 0; x < tilemap.width; x += 1) {
        const tile = tilemap.tiles[y][x];
        const screenX = x * tileSize;
        const screenY = y * tileSize;
        const centerX = screenX + tileSize / 2;
        const centerY = screenY + tileSize / 2;

        context.fillStyle = tile === "#" ? "#101010" : "#070707";
        context.fillRect(screenX, screenY, tileSize, tileSize);

        context.strokeStyle = "rgba(255, 255, 255, 0.08)";
        context.lineWidth = Math.max(1, pixelRatio);
        context.strokeRect(screenX, screenY, tileSize, tileSize);

        if (tile === "#") {
          context.fillStyle = "#d7d0bd";
          context.fillText("#", centerX, centerY);
        } else {
          context.fillStyle = "rgba(215, 208, 189, 0.18)";
          context.fillText("·", centerX, centerY);
        }
      }
    }
  }

  function renderEntities(world) {
    const pixelRatio = window.devicePixelRatio || 1;
    const renderableEntities = queryEntities(world, [
      ComponentType.Position,
      ComponentType.Renderable,
    ]);

    for (const entityId of renderableEntities) {
      const position = getComponent(world, entityId, ComponentType.Position);
      const renderable = getComponent(world, entityId, ComponentType.Renderable);

      if (renderable.shape === "glyph") {
        renderGlyph(position, renderable, pixelRatio);
        continue;
      }

      if (renderable.shape === "rect") {
        renderRect(position, renderable, pixelRatio);
      }
    }
  }

  function renderGlyph(position, renderable, pixelRatio) {
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

  function renderRect(position, renderable, pixelRatio) {
    context.fillStyle = renderable.color;
    context.fillRect(
      position.x * pixelRatio,
      position.y * pixelRatio,
      renderable.width * pixelRatio,
      renderable.height * pixelRatio,
    );
  }

  function render(world, tilemap) {
    resizeCanvas();
    clearFrame();
    renderTilemap(tilemap);
    renderEntities(world);
  }

  return {
    render,
  };
}
