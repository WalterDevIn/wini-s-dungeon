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

export function updateQuickBar(quickBarPairs, mouseInput) {
  const selectedPairIndex = Math.floor(mouseInput.wheelIndex / 2);

  quickBarPairs.forEach((pairElement, pairIndex) => {
    pairElement.classList.toggle("is-selected", pairIndex === selectedPairIndex);
  });
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

export function updateCursorFeedback(cursorFeedback, mouseInput, playerActionState) {
  const pointer = mouseInput.pointer;
  const hasPointer = Boolean(pointer?.hasPosition);

  cursorFeedback.root.classList.toggle("has-position", hasPointer);

  if (!hasPointer) {
    return;
  }

  cursorFeedback.root.style.left = `${pointer.x}px`;
  cursorFeedback.root.style.top = `${pointer.y}px`;

  const phase = playerActionState.phase;
  const showRing = phase === "windup" || phase === "recovery";

  cursorFeedback.root.classList.toggle("has-action-progress", showRing);
  cursorFeedback.root.classList.toggle("is-windup", phase === "windup");
  cursorFeedback.root.classList.toggle("is-recovery", phase === "recovery");
  cursorFeedback.ring.style.setProperty(
    "--cursor-progress",
    String(playerActionState.phaseProgress ?? 0),
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
