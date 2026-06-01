import { buildRenderSnapshot } from "../game/buildRenderSnapshot.js";
import { buildUiSnapshot } from "../game/buildUiSnapshot.js";
import { getPlayerCenterPoint } from "../game/playerQueries.js";
import { runSimulationStep } from "../simulation/runSimulationStep.js";
import { createCameraSnapshot, screenToWorld } from "../render/camera.js";
import {
  collectCommandsFromInput,
  consumeAttackCommandFromPrimaryClick,
} from "./commandMapper.js";
import { createAimIntent } from "./aimIntent.js";

export function runGameFrame({
  currentTime,
  frameState,
  world,
  tilemap,
  keyboardInput,
  mouseInput,
  renderer,
  hudUi,
  tacticalMode,
}) {
  const deltaSeconds = Math.min((currentTime - frameState.lastFrameTime) / 1000, 0.05);
  frameState.lastFrameTime = currentTime;

  const mouseSnapshot = mouseInput.getSnapshot();
  const camera = createCurrentCameraSnapshot({ world, tilemap, renderer, mouseSnapshot });
  const screenToWorldPoint = (screenPoint) => screenToWorld(camera, screenPoint);

  if (keyboardInput.consumeTacticalToggleIntent()) {
    tacticalMode.toggle();
  }

  const commands = tacticalMode.consumeCommandsToRun();

  if (tacticalMode.isPaused()) {
    const preparedCommand = consumeAttackCommandFromPrimaryClick({ world, mouseInput });

    if (preparedCommand) {
      tacticalMode.prepareCommand(preparedCommand);
      frameState.lastCommand = preparedCommand;
    }
  } else {
    const commandResult = collectCommandsFromInput({
      world,
      mouseInput,
      mouseSnapshot,
      screenToWorldPoint,
    });
    commands.push(...commandResult.commands);

    if (commandResult.lastCommand) {
      frameState.lastCommand = commandResult.lastCommand;
    }

    runSimulationStep({
      world,
      tilemap,
      deltaSeconds,
      movementIntent: keyboardInput.getMovementIntent(),
      commands,
      aimIntent: createAimIntent(mouseSnapshot, screenToWorldPoint),
    });
  }

  renderer.render(buildRenderSnapshot({ world, tilemap, camera }));
  hudUi.update(
    buildUiSnapshot({
      world,
      keyboardSnapshot: keyboardInput.getSnapshot(),
      mouseSnapshot,
      tacticalModeSnapshot: tacticalMode.getSnapshot(),
      lastCommand: frameState.lastCommand,
    }),
  );
}

function createCurrentCameraSnapshot({ world, tilemap, renderer, mouseSnapshot }) {
  return createCameraSnapshot({
    focusPoint: getPlayerCenterPoint(world),
    pointer: mouseSnapshot.pointer,
    viewport: renderer.getViewport(),
    tilemap,
  });
}
