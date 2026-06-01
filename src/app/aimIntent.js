export function createAimIntent(mouseSnapshot, screenToWorldPoint) {
  const pointer = mouseSnapshot.pointer;

  if (!pointer.hasPosition) {
    return {
      targetPoint: {
        hasPosition: false,
      },
    };
  }

  const targetPoint = screenToWorldPoint(pointer);

  return {
    targetPoint: {
      x: targetPoint.x,
      y: targetPoint.y,
      hasPosition: true,
    },
  };
}
