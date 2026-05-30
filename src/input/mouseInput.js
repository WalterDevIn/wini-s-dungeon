import { createMouseButtonState } from "./mouseButtonState.js";
import { createMousePointerState } from "./mousePointerState.js";
import { createMouseWheelState } from "./mouseWheelState.js";

export function createMouseInput(target) {
  const pointerState = createMousePointerState();
  const buttonState = createMouseButtonState({ pointerState });
  const wheelState = createMouseWheelState({ pointerState });

  function handleMouseMove(event) {
    pointerState.updatePointerPosition(event);
  }

  function handleContextMenu(event) {
    event.preventDefault();
  }

  target.addEventListener("mousedown", buttonState.handleMouseDown);
  target.addEventListener("mouseup", buttonState.handleMouseUp);
  target.addEventListener("mousemove", handleMouseMove);
  target.addEventListener("wheel", wheelState.handleWheel, { passive: false });
  target.addEventListener("contextmenu", handleContextMenu);

  function getSnapshot() {
    return {
      ...buttonState.getSnapshot(),
      ...wheelState.getSnapshot(),
      pointer: pointerState.getSnapshot(),
    };
  }

  return {
    consumePrimaryClickIntent: buttonState.consumePrimaryClickIntent,
    consumeSecondaryClickIntent: buttonState.consumeSecondaryClickIntent,
    getSnapshot,
  };
}
