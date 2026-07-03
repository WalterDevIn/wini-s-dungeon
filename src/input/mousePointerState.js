export function createMousePointerState() {
  let pointerX = 0;
  let pointerY = 0;
  let movementX = 0;
  let movementY = 0;
  let hasPointerPosition = false;

  function updatePointerPosition(event) {
    pointerX = event.clientX;
    pointerY = event.clientY;
    movementX += event.movementX || 0;
    movementY += event.movementY || 0;
    hasPointerPosition = true;
  }

  function getSnapshot() {
    const snapshot = {
      x: pointerX,
      y: pointerY,
      movementX,
      movementY,
      hasPosition: hasPointerPosition,
    };

    movementX = 0;
    movementY = 0;

    return snapshot;
  }

  return {
    updatePointerPosition,
    getSnapshot,
  };
}
