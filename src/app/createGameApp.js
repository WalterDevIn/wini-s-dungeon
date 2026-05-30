import { createWorld } from "../ecs/world.js";
import { createEnemy } from "../game/createEnemy.js";
import { createPlayer } from "../game/createPlayer.js";
import { buildUiSnapshot } from "../game/buildUiSnapshot.js";
import { createKeyboardInput } from "../input/keyboardInput.js";
import { createMouseInput } from "../input/mouseInput.js";
import { tilemap } from "../world/tilemap.js";
import { runSimulationStep } from "../simulation/runSimulationStep.js";
import { createCanvasRenderer } from "../render/canvasRenderer.js";
import { createHudUi } from "../ui/hudUi.js";
import { collectCommandsFromInput } from "./commandMapper.js";

export function createGameApp({ canvas, context, uiRoot }) {
  const world = createWorld();
  const keyboardInput = createKeyboardInput();
  const mouseInput = createMouseInput(canvas);
  const renderer = createCanvasRenderer(canvas, context);
  const hudUi = createHudUi(uiRoot);

  createPlayer(world);
  createEnemy(world);

  let lastFrameTime = performance.now();
  let lastCommand = null;

  function start() {
    requestAnimationFrame(frame);
  }

  function frame(currentTime) {
    const deltaSeconds = Math.min((currentTime - lastFrameTime) / 1000, 0.05);
    lastFrameTime = currentTime;

    const commandResult = collectCommandsFromInput({ world, mouseInput });

    if (commandResult.lastCommand) {
      lastCommand = commandResult.lastCommand;
    }

    runSimulationStep({
      world,
      tilemap,
      deltaSeconds,
      movementIntent: keyboardInput.getMovementIntent(),
      commands: commandResult.commands,
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

  return {
    start,
  };
}
