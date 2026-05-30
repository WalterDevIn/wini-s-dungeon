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

export function updatePlayerHealthBar(playerHealthBar, playerHealth) {
  const current = Math.max(0, Math.ceil(playerHealth.current));
  const max = Math.max(0, Math.ceil(playerHealth.max));

  playerHealthBar.innerHTML = Array.from({ length: max }, (_, index) => {
    const filledClass = index < current ? " is-filled" : "";
    return `<span class="player-health-pip${filledClass}" aria-hidden="true"></span>`;
  }).join("");
}

export function updateQuickBar(
  quickBar,
  quickBarPairs,
  quickBarSlots,
  mouseInput,
  quickBarView,
) {
  const isSpellsMode = quickBarView.mode === "spells";
  const isFeaturesMode = quickBarView.mode === "features";
  const isInventoryMode = !isSpellsMode && !isFeaturesMode;
  const selectedSlotIndex = mouseInput.wheelIndex;
  const selectedPairIndex = Math.floor(selectedSlotIndex / 2);

  quickBar.classList.toggle("is-inventory-mode", isInventoryMode);
  quickBar.classList.toggle("is-spells-mode", isSpellsMode);
  quickBar.classList.toggle("is-features-mode", isFeaturesMode);

  quickBarPairs.forEach((pairElement, pairIndex) => {
    pairElement.classList.toggle(
      "is-selected",
      isInventoryMode && pairIndex === selectedPairIndex,
    );
  });

  quickBarSlots.forEach((slotElement) => {
    slotElement.classList.toggle(
      "is-selected",
      !isInventoryMode && Number(slotElement.dataset.quickBarSlot) === selectedSlotIndex,
    );
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
