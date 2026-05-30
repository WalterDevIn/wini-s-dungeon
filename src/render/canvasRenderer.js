import { drawActionIndicators } from "./drawActionIndicators.js";
import { drawEntities } from "./drawEntities.js";
import { drawMap } from "./drawMap.js";

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

  function render(world, tilemap) {
    const pixelRatio = window.devicePixelRatio || 1;

    resizeCanvas();
    clearFrame();
    drawMap(context, tilemap, pixelRatio);
    drawEntities(context, world, pixelRatio);
    drawActionIndicators(context, world, pixelRatio);
  }

  return {
    render,
  };
}
