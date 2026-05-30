export function createMousePointerState() {
  let pointerX = 0;
  let pointerY = 0;
  let hasPointerPosition = false;

  function updatePointerPosition(event) {
    pointerX = event.clientX;
    pointerY = event.clientY;
    hasPointerPosition = true;
  }

  function getSnapshot() {
    return {
      x: pointerX,
      y: pointerY,
      hasPosition: hasPointerPosition,
    };
  }

  return {
    updatePointerPosition,
    getSnapshot,
  };
}
