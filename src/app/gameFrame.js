import { buildRenderSnapshot } from "../game/buildRenderSnapshot.js";
import { buildUiSnapshot } from "../game/buildUiSnapshot.js";
import { getPlayerCenterPoint } from "../game/playerQueries.js";
import { runSimulationStep } from "../simulation/runSimulationStep.js";
import {
  createCameraSnapshot,
  createFirstPersonCameraSnapshot,
  screenToWorld,
} from "../render/camera.js";
import {
  collectCommandsFromInput,
  consumeAttackCommandFromPrimaryClick,
} from "./commandMapper.js";
import { createAimIntent } from "./aimIntent.js";

const FIRST_PERSON_MOUSE_SENSITIVITY = 0.004;
const FIRST_PERSON_PITCH_SENSITIVITY = 0.002;
const MAX_FIRST_PERSON_PITCH = 0.35;

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
  updateFirstPersonCameraState(frameState, mouseSnapshot);

  const camera = createCurrentCameraSnapshot({
    world,
    tilemap,
    renderer,
    mouseSnapshot,
    frameState,
  });
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

function createCurrentCameraSnapshot({ world, tilemap, renderer, mouseSnapshot, frameState }) {
  const focusPoint = getPlayerCenterPoint(world);

  if (frameState.renderMode === "firstPerson") {
    return createFirstPersonCameraSnapshot({
      focusPoint,
      viewport: renderer.getViewport(),
      yaw: frameState.firstPersonCamera.yaw,
      pitch: frameState.firstPersonCamera.pitch,
    });
  }

  return createCameraSnapshot({
    focusPoint,
    pointer: mouseSnapshot.pointer,
    viewport: renderer.getViewport(),
    tilemap,
  });
}

function updateFirstPersonCameraState(frameState, mouseSnapshot) {
  if (frameState.renderMode !== "firstPerson") {
    return;
  }

  const cameraState = frameState.firstPersonCamera;
  cameraState.yaw += mouseSnapshot.pointer.movementX * FIRST_PERSON_MOUSE_SENSITIVITY;
  cameraState.pitch = clamp(
    cameraState.pitch - mouseSnapshot.pointer.movementY * FIRST_PERSON_PITCH_SENSITIVITY,
    -MAX_FIRST_PERSON_PITCH,
    MAX_FIRST_PERSON_PITCH,
  );
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
