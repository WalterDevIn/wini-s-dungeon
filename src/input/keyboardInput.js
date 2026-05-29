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

const ATTACK_KEY = "Space";

export function createKeyboardInput(target = window) {
  const pressedKeys = new Set();
  let attackRequested = false;

  function handleKeyDown(event) {
    if (event.code === ATTACK_KEY) {
      if (!pressedKeys.has(ATTACK_KEY)) {
        attackRequested = true;
      }

      pressedKeys.add(event.code);
      event.preventDefault();
      return;
    }

    if (!MOVEMENT_KEYS[event.code]) {
      return;
    }

    pressedKeys.add(event.code);
    event.preventDefault();
  }

  function handleKeyUp(event) {
    if (event.code === ATTACK_KEY) {
      pressedKeys.delete(event.code);
      event.preventDefault();
      return;
    }

    if (!MOVEMENT_KEYS[event.code]) {
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

  function consumeAttackIntent() {
    const wasRequested = attackRequested;
    attackRequested = false;
    return wasRequested;
  }

  return {
    getMovementIntent,
    consumeAttackIntent,
  };
}
