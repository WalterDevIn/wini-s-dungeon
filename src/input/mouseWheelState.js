const MIN_INDEX = 0;
const MAX_INDEX = 9;
const IDLE_DIRECTION = null;

export function createMouseWheelState({ pointerState }) {
  let index = 0;
  let direction = IDLE_DIRECTION;
  let pulse = false;

  function handleWheel(event) {
    pointerState.updatePointerPosition(event);

    if (event.deltaY < 0) {
      index = index >= MAX_INDEX ? MIN_INDEX : index + 1;
      direction = "up";
      pulse = true;
      event.preventDefault();
      return;
    }

    if (event.deltaY > 0) {
      index = index <= MIN_INDEX ? MAX_INDEX : index - 1;
      direction = "down";
      pulse = true;
      event.preventDefault();
    }
  }

  function getSnapshot() {
    const snapshot = {
      wheelIndex: index,
      wheelDirection: direction,
      wheelPulse: pulse,
    };

    pulse = false;
    direction = IDLE_DIRECTION;

    return snapshot;
  }

  return {
    handleWheel,
    getSnapshot,
  };
}
