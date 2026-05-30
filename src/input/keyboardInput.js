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

const VISUAL_KEYS = Object.freeze(["w", "a", "r", "s", "q", "f", "Tab", "Space"]);

export function createKeyboardInput(target = window) {
  const pressedCodes = new Set();
  const pressedVisualKeys = new Set();
  let tacticalToggleRequested = false;

  function handleKeyDown(event) {
    if (!isTrackedKey(event)) {
      return;
    }

    if (event.code === "Space" && !pressedCodes.has("Space")) {
      tacticalToggleRequested = true;
    }

    pressedCodes.add(event.code);

    const visualKey = getVisualKey(event);

    if (visualKey) {
      pressedVisualKeys.add(visualKey);
    }

    event.preventDefault();
  }

  function handleKeyUp(event) {
    if (!isTrackedKey(event)) {
      return;
    }

    pressedCodes.delete(event.code);

    const visualKey = getVisualKey(event);

    if (visualKey) {
      pressedVisualKeys.delete(visualKey);
    }

    event.preventDefault();
  }

  target.addEventListener("keydown", handleKeyDown);
  target.addEventListener("keyup", handleKeyUp);

  function getMovementIntent() {
    let x = 0;
    let y = 0;

    for (const keyCode of pressedCodes) {
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

  function consumeTacticalToggleIntent() {
    const wasRequested = tacticalToggleRequested;
    tacticalToggleRequested = false;
    return wasRequested;
  }

  function getSnapshot() {
    return {
      movement: {
        moveUp: pressedVisualKeys.has("w"),
        moveLeft: pressedVisualKeys.has("a"),
        moveRight: pressedVisualKeys.has("r"),
        moveDown: pressedVisualKeys.has("s"),
      },
      pressedKeys: {
        q: pressedVisualKeys.has("q"),
        f: pressedVisualKeys.has("f"),
        Tab: pressedVisualKeys.has("Tab"),
        Space: pressedVisualKeys.has("Space"),
      },
    };
  }

  return {
    getMovementIntent,
    consumeTacticalToggleIntent,
    getSnapshot,
  };
}

function isTrackedKey(event) {
  return Boolean(MOVEMENT_KEYS[event.code]) || getVisualKey(event) !== null;
}

function getVisualKey(event) {
  if (event.code === "Tab") {
    return "Tab";
  }

  if (event.code === "Space") {
    return "Space";
  }

  const key = event.key.toLowerCase();

  if (VISUAL_KEYS.includes(key)) {
    return key;
  }

  return null;
}
