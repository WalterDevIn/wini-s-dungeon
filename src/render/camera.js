const FIRST_PERSON_FOV = Math.PI / 3;
const FIRST_PERSON_TARGET_DISTANCE = 1024;

export function createCameraSnapshot({ focusPoint, pointer, viewport, tilemap }) {
  const mapWidth = tilemap.width * tilemap.tileSize;
  const mapHeight = tilemap.height * tilemap.tileSize;
  const viewportWidth = viewport.width;
  const viewportHeight = viewport.height;
  const cameraCenter = getCameraCenter({ focusPoint, pointer, viewport });
  const unclampedCamera = {
    mode: "topDown",
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

export function createFirstPersonCameraSnapshot({ focusPoint, viewport, yaw, pitch }) {
  return {
    mode: "firstPerson",
    x: focusPoint.x - viewport.width / 2,
    y: focusPoint.y - viewport.height / 2,
    width: viewport.width,
    height: viewport.height,
    position: { ...focusPoint },
    yaw,
    pitch,
    fov: FIRST_PERSON_FOV,
  };
}

export function worldToScreen(camera, worldPoint) {
  return {
    x: worldPoint.x - camera.x,
    y: worldPoint.y - camera.y,
  };
}

export function screenToWorld(camera, screenPoint) {
  if (camera.mode === "firstPerson") {
    return firstPersonScreenToWorld(camera, screenPoint);
  }

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

function firstPersonScreenToWorld(camera, screenPoint) {
  const screenX = screenPoint?.hasPosition ? screenPoint.x : camera.width / 2;
  const normalizedX = screenX / camera.width - 0.5;
  const angle = camera.yaw + normalizedX * camera.fov;

  return {
    x: camera.position.x + Math.cos(angle) * FIRST_PERSON_TARGET_DISTANCE,
    y: camera.position.y + Math.sin(angle) * FIRST_PERSON_TARGET_DISTANCE,
    hasPosition: true,
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
