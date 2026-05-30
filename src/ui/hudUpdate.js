export function updateKeyboardCaps(keyCaps, keyboardInput) {
  const movement = keyboardInput.movement;
  const pressedKeys = keyboardInput.pressedKeys;

  const pressedByCode = {
    moveUp: movement.moveUp,
    moveLeft: movement.moveLeft,
    moveRight: movement.moveRight,
    moveDown: movement.moveDown,
    q: pressedKeys.q,
    f: pressedKeys.f,
    Tab: pressedKeys.Tab,
    Space: pressedKeys.Space,
  };

  for (const [keyCode, keyCap] of keyCaps) {
    keyCap.classList.toggle("is-pressed", Boolean(pressedByCode[keyCode]));
  }
}

export function updateMouseCaps(mouseCaps, mouseInput) {
  for (const [mouseCode, mouseCap] of mouseCaps) {
    mouseCap.classList.toggle("is-pressed", Boolean(mouseInput[mouseCode]));
  }
}

export function updateWheelFeedback(
  wheelFeedback,
  wheelDirection,
  wheelIndexSmall,
  mouseInput,
) {
  wheelFeedback.classList.toggle("is-active", mouseInput.wheelPulse);
  wheelDirection.textContent = getWheelDirectionLabel(mouseInput.wheelDirection);
  wheelIndexSmall.textContent = String(mouseInput.wheelIndex);
}

export function updateTacticalStatus(tacticalStatus, tacticalMode) {
  tacticalStatus.root.classList.toggle(
    "is-paused",
    tacticalMode.mode === "tacticalPaused",
  );
}

function getWheelDirectionLabel(direction) {
  if (direction === "up") {
    return "↑";
  }

  if (direction === "down") {
    return "↓";
  }

  return "-";
}
