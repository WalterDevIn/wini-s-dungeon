import { createWorld } from "../ecs/world.js";
import { AttackCommand } from "../domain/commands.js";
import { createEnemy } from "../game/createEnemy.js";
import { createPlayer } from "../game/createPlayer.js";
import { findPlayerEntity } from "../game/playerQueries.js";
import { buildUiSnapshot } from "../game/buildUiSnapshot.js";
import { createKeyboardInput } from "../input/keyboardInput.js";
import { createMouseInput } from "../input/mouseInput.js";
import { tilemap } from "../world/tilemap.js";
import { runSimulationStep } from "../simulation/runSimulationStep.js";
import { createCanvasRenderer } from "../render/canvasRenderer.js";
import { createHudUi } from "../ui/hudUi.js";

const canvas = document.querySelector("#game-canvas");
const context = canvas?.getContext("2d");
const uiRoot = document.querySelector("#ui-root");

if (!canvas || !context) {
  throw new Error("No se pudo inicializar el canvas del juego.");
}

if (!uiRoot) {
  throw new Error("No se pudo inicializar la UI del juego.");
}

const world = createWorld();
const keyboardInput = createKeyboardInput();
const mouseInput = createMouseInput(canvas);
const renderer = createCanvasRenderer(canvas, context);
const hudUi = createHudUi(uiRoot);

createPlayer(world);
createEnemy(world);

let lastFrameTime = performance.now();
let lastCommand = null;

function frame(currentTime) {
  const deltaSeconds = Math.min((currentTime - lastFrameTime) / 1000, 0.05);
  lastFrameTime = currentTime;

  const commands = collectCommands();

  runSimulationStep({
    world,
    tilemap,
    deltaSeconds,
    movementIntent: keyboardInput.getMovementIntent(),
    commands,
  });

  renderer.render(world, tilemap);
  hudUi.update(
    buildUiSnapshot({
      world,
      mouseSnapshot: mouseInput.getSnapshot(),
      lastCommand,
    }),
  );

  requestAnimationFrame(frame);
}

function collectCommands() {
  if (!mouseInput.consumePrimaryClickIntent()) {
    return [];
  }

  const playerId = findPlayerEntity(world);

  if (playerId === null) {
    lastCommand = null;
    return [];
  }

  const command = AttackCommand({ actorId: playerId });
  lastCommand = command;
  return [command];
}

requestAnimationFrame(frame);
