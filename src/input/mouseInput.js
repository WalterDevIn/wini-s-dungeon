export function createMouseInput(target) {
  const pressedButtons = new Set();
  let primaryClickRequested = false;

  function handleMouseDown(event) {
    pressedButtons.add(event.button);

    if (event.button === 0) {
      primaryClickRequested = true;
    }

    event.preventDefault();
  }

  function handleMouseUp(event) {
    pressedButtons.delete(event.button);
    event.preventDefault();
  }

  function handleContextMenu(event) {
    event.preventDefault();
  }

  target.addEventListener("mousedown", handleMouseDown);
  target.addEventListener("mouseup", handleMouseUp);
  target.addEventListener("contextmenu", handleContextMenu);

  function consumePrimaryClickIntent() {
    const wasRequested = primaryClickRequested;
    primaryClickRequested = false;
    return wasRequested;
  }

  function getSnapshot() {
    return {
      leftButtonPressed: pressedButtons.has(0),
      middleButtonPressed: pressedButtons.has(1),
      rightButtonPressed: pressedButtons.has(2),
      button4Pressed: pressedButtons.has(3),
      button5Pressed: pressedButtons.has(4),
    };
  }

  return {
    consumePrimaryClickIntent,
    getSnapshot,
  };
}
