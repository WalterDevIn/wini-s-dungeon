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
import {
  collectCommandsFromInput,
  consumeAttackCommandFromPrimaryClick,
} from "./commandMapper.js";
import { createTacticalModeController } from "./tacticalModeController.js";

export function createGameApp({ canvas, context, uiRoot }) {
  const world = createWorld();
  const keyboardInput = createKeyboardInput();
  const mouseInput = createMouseInput(window);
  const renderer = createCanvasRenderer(canvas, context);
  const hudUi = createHudUi(uiRoot);
  const tacticalMode = createTacticalModeController();

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

    if (keyboardInput.consumeTacticalToggleIntent()) {
      tacticalMode.toggle();
    }

    const commands = tacticalMode.consumeCommandsToRun();

    if (tacticalMode.isPaused()) {
      const preparedCommand = consumeAttackCommandFromPrimaryClick({ world, mouseInput });

      if (preparedCommand) {
        tacticalMode.prepareCommand(preparedCommand);
        lastCommand = preparedCommand;
      }
    } else {
      const commandResult = collectCommandsFromInput({ world, mouseInput });
      commands.push(...commandResult.commands);

      if (commandResult.lastCommand) {
        lastCommand = commandResult.lastCommand;
      }

      runSimulationStep({
        world,
        tilemap,
        deltaSeconds,
        movementIntent: keyboardInput.getMovementIntent(),
        commands,
        aimIntent: createAimIntent(mouseInput),
      });
    }

    renderer.render(world, tilemap);
    hudUi.update(
      buildUiSnapshot({
        world,
        keyboardSnapshot: keyboardInput.getSnapshot(),
        mouseSnapshot: mouseInput.getSnapshot(),
        tacticalModeSnapshot: tacticalMode.getSnapshot(),
        lastCommand,
      }),
    );

    requestAnimationFrame(frame);
  }

  return {
    start,
  };
}

function createAimIntent(mouseInput) {
  const pointer = mouseInput.getSnapshot().pointer;

  if (!pointer.hasPosition) {
    return {
      targetPoint: {
        hasPosition: false,
      },
    };
  }

  return {
    targetPoint: {
      x: pointer.x,
      y: pointer.y,
      hasPosition: true,
    },
  };
}
