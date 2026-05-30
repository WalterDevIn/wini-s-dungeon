import { renderHudTemplate } from "./hudLayout.js";
import {
  updateKeyboardCaps,
  updateMouseCaps,
  updateTacticalStatus,
  updateWheelFeedback,
} from "./hudUpdate.js";

export function createHudUi(root) {
  root.classList.add("game-ui-root");
  root.innerHTML = renderHudTemplate();

  const elements = collectHudElements(root);

  function update(snapshot) {
    updateKeyboardCaps(elements.keyCaps, snapshot.input.keyboard);
    updateMouseCaps(elements.mouseCaps, snapshot.input.mouse);
    updateWheelFeedback(
      elements.wheelFeedback,
      elements.wheelDirection,
      elements.wheelIndexSmall,
      snapshot.input.mouse,
    );
    updateTacticalStatus(elements.tacticalStatus, snapshot.tacticalMode);
    updateDebugPanel(elements, snapshot);
  }

  return {
    update,
  };
}

function collectHudElements(root) {
  return {
    keyCaps: collectElementsByDataAttribute(root, "keyCode", "[data-key-code]"),
    mouseCaps: collectElementsByDataAttribute(root, "mouseCode", "[data-mouse-code]"),
    tacticalStatus: {
      root: root.querySelector("[data-tactical-status]"),
    },
    wheelFeedback: root.querySelector("[data-wheel-feedback]"),
    wheelDirection: root.querySelector("[data-wheel-direction]"),
    wheelIndexSmall: root.querySelector("[data-wheel-index-small]"),
    debugTacticalMode: root.querySelector("[data-debug-tactical-mode]"),
    debugPendingAction: root.querySelector("[data-debug-pending-action]"),
    leftButton: root.querySelector("[data-debug-left-button]"),
    wheelIndex: root.querySelector("[data-debug-wheel-index]"),
    lastCommand: root.querySelector("[data-debug-last-command]"),
    action: root.querySelector("[data-debug-action]"),
    phase: root.querySelector("[data-debug-phase]"),
    time: root.querySelector("[data-debug-time]"),
  };
}

function collectElementsByDataAttribute(root, dataKey, selector) {
  return new Map(
    [...root.querySelectorAll(selector)].map((element) => [
      element.dataset[dataKey],
      element,
    ]),
  );
}

function updateDebugPanel(elements, snapshot) {
  const actionState = snapshot.playerActionState;

  elements.debugTacticalMode.textContent = snapshot.tacticalMode.mode;
  elements.debugPendingAction.textContent = snapshot.tacticalMode.pendingAction;
  elements.leftButton.textContent = snapshot.input.mouse.leftButtonPressed ? "Sí" : "No";
  elements.wheelIndex.textContent = String(snapshot.input.mouse.wheelIndex);
  elements.lastCommand.textContent = snapshot.lastCommand;
  elements.action.textContent = actionState.currentAction ?? actionState.status;
  elements.phase.textContent = actionState.phase ?? "-";
  elements.time.textContent = `${actionState.timeRemaining.toFixed(2)}s`;
}
