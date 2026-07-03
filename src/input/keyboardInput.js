import { createKeyboardKeyState } from "./keyboardKeyState.js";
import { buildKeyboardSnapshot } from "./keyboardSnapshot.js";

const MOVEMENT_KEYS = Object.freeze({
  ArrowUp: { x: 0, y: -1 },
  KeyW: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  KeyS: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  KeyA: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  KeyD: { x: 1, y: 0 },
});

export function createKeyboardInput(target = window) {
  const keyState = createKeyboardKeyState({ movementKeys: MOVEMENT_KEYS });

  target.addEventListener("keydown", keyState.handleKeyDown);
  target.addEventListener("keyup", keyState.handleKeyUp);

  function getMovementIntent() {
    let x = 0;
    let y = 0;

    for (const keyCode of keyState.pressedCodes) {
      const direction = MOVEMENT_KEYS[keyCode];

      if (!direction) {
        continue;
      }

      x += direction.x;
      y += direction.y;
    }

    const length = Math.hypot(x, y);

    if (length === 0) {
      return { x: 0, y: 0 };
    }

    return {
      x: x / length,
      y: y / length,
    };
  }

  function getSnapshot() {
    return buildKeyboardSnapshot({
      pressedVisualKeys: keyState.pressedVisualKeys,
    });
  }

  return {
    getMovementIntent,
    consumeTacticalToggleIntent: keyState.consumeTacticalToggleIntent,
    consumeCameraToggleIntent: keyState.consumeCameraToggleIntent,
    getSnapshot,
  };
}
