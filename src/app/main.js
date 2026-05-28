import { createWorld } from "../ecs/world.js";
import { createEnemy } from "../game/createEnemy.js";
import { createPlayer } from "../game/createPlayer.js";
import { createKeyboardInput } from "../input/keyboardInput.js";
import { tilemap } from "../world/tilemap.js";
import { runSimulationStep } from "../simulation/runSimulationStep.js";
import { createCanvasRenderer } from "../render/canvasRenderer.js";

const canvas = document.querySelector("#game-canvas");
const context = canvas?.getContext("2d");

if (!canvas || !context) {
  throw new Error("No se pudo inicializar el canvas del juego.");
}

const world = createWorld();
const keyboardInput = createKeyboardInput();
const renderer = createCanvasRenderer(canvas, context);

createPlayer(world);
createEnemy(world);

let lastFrameTime = performance.now();

function frame(currentTime) {
  const deltaSeconds = Math.min((currentTime - lastFrameTime) / 1000, 0.05);
  lastFrameTime = currentTime;

  runSimulationStep({
    world,
    tilemap,
    deltaSeconds,
    movementIntent: keyboardInput.getMovementIntent(),
    basicAttackIntent: keyboardInput.consumeTestAttackIntent(),
  });

  renderer.render(world, tilemap);

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
