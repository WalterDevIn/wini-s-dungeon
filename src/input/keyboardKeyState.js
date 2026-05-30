const VISUAL_KEYS = Object.freeze(["w", "a", "r", "s", "q", "f", "Tab", "Space"]);

export function createKeyboardKeyState({ movementKeys }) {
  const pressedCodes = new Set();
  const pressedVisualKeys = new Set();
  let tacticalToggleRequested = false;

  function handleKeyDown(event) {
    if (!isTrackedKey(event, movementKeys)) {
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
    if (!isTrackedKey(event, movementKeys)) {
      return;
    }

    pressedCodes.delete(event.code);

    const visualKey = getVisualKey(event);

    if (visualKey) {
      pressedVisualKeys.delete(visualKey);
    }

    event.preventDefault();
  }

  function consumeTacticalToggleIntent() {
    const wasRequested = tacticalToggleRequested;
    tacticalToggleRequested = false;
    return wasRequested;
  }

  return {
    pressedCodes,
    pressedVisualKeys,
    handleKeyDown,
    handleKeyUp,
    consumeTacticalToggleIntent,
  };
}

function isTrackedKey(event, movementKeys) {
  return Boolean(movementKeys[event.code]) || getVisualKey(event) !== null;
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
