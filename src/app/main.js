import { createWorld } from "../ecs/world.js";
import { createPlayer } from "../game/createPlayer.js";
import { createKeyboardInput } from "../input/keyboardInput.js";
import { tilemap } from "../world/tilemap.js";
import { playerControlSystem } from "../simulation/playerControlSystem.js";
import { movementSystem } from "../simulation/movementSystem.js";
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

let lastFrameTime = performance.now();

function frame(currentTime) {
  const deltaSeconds = Math.min((currentTime - lastFrameTime) / 1000, 0.05);
  lastFrameTime = currentTime;

  const movementIntent = keyboardInput.getMovementIntent();

  playerControlSystem(world, movementIntent);
  movementSystem(world, tilemap, deltaSeconds);
  renderer.render(world, tilemap);

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
