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

const VISUAL_KEYS = Object.freeze([
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "KeyQ",
  "KeyF",
  "Space",
]);

export function createKeyboardInput(target = window) {
  const pressedKeys = new Set();

  function handleKeyDown(event) {
    if (!isTrackedKey(event.code)) {
      return;
    }

    pressedKeys.add(event.code);
    event.preventDefault();
  }

  function handleKeyUp(event) {
    if (!isTrackedKey(event.code)) {
      return;
    }

    pressedKeys.delete(event.code);
    event.preventDefault();
  }

  target.addEventListener("keydown", handleKeyDown);
  target.addEventListener("keyup", handleKeyUp);

  function getMovementIntent() {
    let x = 0;
    let y = 0;

    for (const keyCode of pressedKeys) {
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
    return {
      pressedKeys: Object.fromEntries(
        VISUAL_KEYS.map((keyCode) => [keyCode, pressedKeys.has(keyCode)]),
      ),
    };
  }

  return {
    getMovementIntent,
    getSnapshot,
  };
}

function isTrackedKey(keyCode) {
  return Boolean(MOVEMENT_KEYS[keyCode]) || VISUAL_KEYS.includes(keyCode);
}
