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

  function getViewport() {
    const pixelRatio = window.devicePixelRatio || 1;

    resizeCanvas();

    return {
      width: canvas.width / pixelRatio,
      height: canvas.height / pixelRatio,
    };
  }

  function render(world, tilemap, camera) {
    const pixelRatio = window.devicePixelRatio || 1;

    resizeCanvas();
    clearFrame();
    drawMap(context, tilemap, pixelRatio, camera);
    drawEntities(context, world, pixelRatio, camera);
    drawActionIndicators(context, world, pixelRatio, camera);
  }

  return {
    getViewport,
    render,
  };
}
