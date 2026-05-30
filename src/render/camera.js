export function createCameraSnapshot({ focusPoint, pointer, viewport, tilemap }) {
  const mapWidth = tilemap.width * tilemap.tileSize;
  const mapHeight = tilemap.height * tilemap.tileSize;
  const viewportWidth = viewport.width;
  const viewportHeight = viewport.height;
  const cameraCenter = getCameraCenter({ focusPoint, pointer, viewport });
  const unclampedCamera = {
    x: cameraCenter.x - viewportWidth / 2,
    y: cameraCenter.y - viewportHeight / 2,
    width: viewportWidth,
    height: viewportHeight,
  };

  return clampCameraToTilemap(unclampedCamera, {
    width: mapWidth,
    height: mapHeight,
  });
}

export function worldToScreen(camera, worldPoint) {
  return {
    x: worldPoint.x - camera.x,
    y: worldPoint.y - camera.y,
  };
}

export function screenToWorld(camera, screenPoint) {
  return {
    x: screenPoint.x + camera.x,
    y: screenPoint.y + camera.y,
    hasPosition: screenPoint.hasPosition,
  };
}

export function clampCameraToTilemap(camera, mapSize) {
  return {
    ...camera,
    x: clampAxis(camera.x, camera.width, mapSize.width),
    y: clampAxis(camera.y, camera.height, mapSize.height),
  };
}

function getCameraCenter({ focusPoint, pointer, viewport }) {
  if (!pointer?.hasPosition) {
    return focusPoint;
  }

  return {
    x: focusPoint.x + pointer.x - viewport.width / 2,
    y: focusPoint.y + pointer.y - viewport.height / 2,
  };
}

function clampAxis(value, viewportSize, mapSize) {
  if (mapSize <= viewportSize) {
    return (mapSize - viewportSize) / 2;
  }

  return clamp(value, 0, mapSize - viewportSize);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
