export function createMouseButtonState({ pointerState }) {
  const pressedButtons = new Set();
  let primaryClickRequested = false;

  function handleMouseDown(event) {
    pointerState.updatePointerPosition(event);
    pressedButtons.add(event.button);

    if (event.button === 0) {
      primaryClickRequested = true;
    }

    event.preventDefault();
  }

  function handleMouseUp(event) {
    pointerState.updatePointerPosition(event);
    pressedButtons.delete(event.button);
    event.preventDefault();
  }

  function consumePrimaryClickIntent() {
    const wasRequested = primaryClickRequested;
    primaryClickRequested = false;
    return wasRequested;
  }

  function getSnapshot() {
    return {
      leftButtonPressed: pressedButtons.has(0),
      rightButtonPressed: pressedButtons.has(2),
      button4Pressed: pressedButtons.has(3),
      button5Pressed: pressedButtons.has(4),
    };
  }

  return {
    handleMouseDown,
    handleMouseUp,
    consumePrimaryClickIntent,
    getSnapshot,
  };
}
