import { createWorld, getComponent } from "../ecs/world.js";
import { ComponentType } from "../domain/components.js";
import { createDemoEncounter } from "../game/createDemoEncounter.js";
import { createPlayer } from "../game/createPlayer.js";
import { buildUiSnapshot } from "../game/buildUiSnapshot.js";
import { findPlayerEntity } from "../game/playerQueries.js";
import { createKeyboardInput } from "../input/keyboardInput.js";
import { createMouseInput } from "../input/mouseInput.js";
import { tilemap } from "../world/tilemap.js";
import { runSimulationStep } from "../simulation/runSimulationStep.js";
import { createCameraSnapshot, screenToWorld } from "../render/camera.js";
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
  createDemoEncounter(world);

  let lastFrameTime = performance.now();
  let lastCommand = null;

  function start() {
    requestAnimationFrame(frame);
  }

  function frame(currentTime) {
    const deltaSeconds = Math.min((currentTime - lastFrameTime) / 1000, 0.05);
    lastFrameTime = currentTime;
    const mouseSnapshot = mouseInput.getSnapshot();
    const camera = createCurrentCameraSnapshot(mouseSnapshot);
    const screenToWorldPoint = (screenPoint) => screenToWorld(camera, screenPoint);

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
      const commandResult = collectCommandsFromInput({
        world,
        mouseInput,
        mouseSnapshot,
        screenToWorldPoint,
      });
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
        aimIntent: createAimIntent(mouseSnapshot, screenToWorldPoint),
      });
    }

    renderer.render(world, tilemap, camera);
    hudUi.update(
      buildUiSnapshot({
        world,
        keyboardSnapshot: keyboardInput.getSnapshot(),
        mouseSnapshot,
        tacticalModeSnapshot: tacticalMode.getSnapshot(),
        lastCommand,
      }),
    );

    requestAnimationFrame(frame);
  }

  function createCurrentCameraSnapshot(mouseSnapshot) {
    return createCameraSnapshot({
      focusPoint: getPlayerFocusPoint(world),
      pointer: mouseSnapshot.pointer,
      viewport: renderer.getViewport(),
      tilemap,
    });
  }

  return {
    start,
  };
}

function createAimIntent(mouseSnapshot, screenToWorldPoint) {
  const pointer = mouseSnapshot.pointer;

  if (!pointer.hasPosition) {
    return {
      targetPoint: {
        hasPosition: false,
      },
    };
  }

  const targetPoint = screenToWorldPoint(pointer);

  return {
    targetPoint: {
      x: targetPoint.x,
      y: targetPoint.y,
      hasPosition: true,
    },
  };
}

function getPlayerFocusPoint(world) {
  const playerId = findPlayerEntity(world);

  if (playerId === null) {
    return { x: 0, y: 0 };
  }

  const position = getComponent(world, playerId, ComponentType.Position);
  const renderable = getComponent(world, playerId, ComponentType.Renderable);

  if (!position || !renderable) {
    return { x: 0, y: 0 };
  }

  return {
    x: position.x + renderable.width / 2,
    y: position.y + renderable.height / 2,
  };
}
