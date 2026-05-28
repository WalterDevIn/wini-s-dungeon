import { getComponent, queryEntities } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";

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
    context.fillStyle = "#10131a";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  function renderTilemap(tilemap) {
    const pixelRatio = window.devicePixelRatio || 1;
    const tileSize = tilemap.tileSize * pixelRatio;

    for (let y = 0; y < tilemap.height; y += 1) {
      for (let x = 0; x < tilemap.width; x += 1) {
        const tile = tilemap.tiles[y][x];
        context.fillStyle = tile === "#" ? "#373b4d" : "#181c27";
        context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
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

      if (renderable.shape !== "rect") {
        continue;
      }

      context.fillStyle = renderable.color;
      context.fillRect(
        position.x * pixelRatio,
        position.y * pixelRatio,
        renderable.width * pixelRatio,
        renderable.height * pixelRatio,
      );
    }
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
