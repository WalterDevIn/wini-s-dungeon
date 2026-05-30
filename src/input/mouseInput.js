const WHEEL_MIN_INDEX = 0;
const WHEEL_MAX_INDEX = 9;
const WHEEL_IDLE_DIRECTION = null;

export function createMouseInput(target) {
  const pressedButtons = new Set();
  let primaryClickRequested = false;
  let wheelIndex = 0;
  let wheelDirection = WHEEL_IDLE_DIRECTION;
  let wheelPulse = false;
  let pointerX = 0;
  let pointerY = 0;
  let hasPointerPosition = false;

  function updatePointerPosition(event) {
    pointerX = event.clientX;
    pointerY = event.clientY;
    hasPointerPosition = true;
  }

  function handleMouseDown(event) {
    updatePointerPosition(event);
    pressedButtons.add(event.button);

    if (event.button === 0) {
      primaryClickRequested = true;
    }

    event.preventDefault();
  }

  function handleMouseUp(event) {
    updatePointerPosition(event);
    pressedButtons.delete(event.button);
    event.preventDefault();
  }

  function handleMouseMove(event) {
    updatePointerPosition(event);
  }

  function handleWheel(event) {
    updatePointerPosition(event);

    if (event.deltaY < 0) {
      wheelIndex = incrementWheelIndex(wheelIndex);
      wheelDirection = "up";
      wheelPulse = true;
      event.preventDefault();
      return;
    }

    if (event.deltaY > 0) {
      wheelIndex = decrementWheelIndex(wheelIndex);
      wheelDirection = "down";
      wheelPulse = true;
      event.preventDefault();
    }
  }

  function handleContextMenu(event) {
    event.preventDefault();
  }

  target.addEventListener("mousedown", handleMouseDown);
  target.addEventListener("mouseup", handleMouseUp);
  target.addEventListener("mousemove", handleMouseMove);
  target.addEventListener("wheel", handleWheel, { passive: false });
  target.addEventListener("contextmenu", handleContextMenu);

  function consumePrimaryClickIntent() {
    const wasRequested = primaryClickRequested;
    primaryClickRequested = false;
    return wasRequested;
  }

  function getSnapshot() {
    const snapshot = {
      leftButtonPressed: pressedButtons.has(0),
      rightButtonPressed: pressedButtons.has(2),
      button4Pressed: pressedButtons.has(3),
      button5Pressed: pressedButtons.has(4),
      wheelIndex,
      wheelDirection,
      wheelPulse,
      pointer: {
        x: pointerX,
        y: pointerY,
        hasPosition: hasPointerPosition,
      },
    };

    wheelPulse = false;
    wheelDirection = WHEEL_IDLE_DIRECTION;

    return snapshot;
  }

  return {
    consumePrimaryClickIntent,
    getSnapshot,
  };
}

function incrementWheelIndex(currentIndex) {
  if (currentIndex >= WHEEL_MAX_INDEX) {
    return WHEEL_MIN_INDEX;
  }

  return currentIndex + 1;
}

function decrementWheelIndex(currentIndex) {
  if (currentIndex <= WHEEL_MIN_INDEX) {
    return WHEEL_MAX_INDEX;
  }

  return currentIndex - 1;
}
