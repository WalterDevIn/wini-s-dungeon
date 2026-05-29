export function createMouseInput(target) {
  let leftButtonPressed = false;
  let primaryClickRequested = false;

  function handleMouseDown(event) {
    if (event.button !== 0) {
      return;
    }

    if (!leftButtonPressed) {
      primaryClickRequested = true;
    }

    leftButtonPressed = true;
    event.preventDefault();
  }

  function handleMouseUp(event) {
    if (event.button !== 0) {
      return;
    }

    leftButtonPressed = false;
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
      leftButtonPressed,
    };
  }

  return {
    consumePrimaryClickIntent,
    getSnapshot,
  };
}
