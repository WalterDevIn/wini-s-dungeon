import { drawActionIndicators } from "./drawActionIndicators.js";
import { drawEntities } from "./drawEntities.js";
import { drawFirstPersonScene } from "./drawFirstPersonScene.js";
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

  function render(renderSnapshot) {
    const pixelRatio = window.devicePixelRatio || 1;

    resizeCanvas();
    clearFrame();

    if (renderSnapshot.camera.mode === "firstPerson") {
      drawFirstPersonScene(context, renderSnapshot, pixelRatio);
      return;
    }

    drawMap(context, renderSnapshot.tilemap, pixelRatio, renderSnapshot.camera);
    drawEntities(context, renderSnapshot.entities, pixelRatio, renderSnapshot.camera);
    drawActionIndicators(
      context,
      renderSnapshot.actionIndicators,
      pixelRatio,
      renderSnapshot.camera,
    );
  }

  return {
    getViewport,
    render,
  };
}
