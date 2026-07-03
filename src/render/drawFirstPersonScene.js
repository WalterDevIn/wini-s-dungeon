const MAX_RAY_DISTANCE = 1100;
const RAY_STEP = 4;
const COLUMN_WIDTH = 2;
const WALL_HEIGHT = 96;
const MIN_ENTITY_DISTANCE = 24;
const PLAYER_ALPHA = 0.22;

export function drawFirstPersonScene(context, renderSnapshot, pixelRatio) {
  const camera = renderSnapshot.camera;
  const viewport = getScaledViewport(camera, pixelRatio);

  context.save();
  drawBackdrop(context, viewport, camera.pitch);
  drawRaycastWalls(context, renderSnapshot.tilemap, camera, viewport);
  drawProjectedEntities(context, renderSnapshot.entities, camera, viewport);
  drawTransparentPlayerBody(context, viewport);
  drawCrosshair(context, viewport);
  context.restore();
}

function drawBackdrop(context, viewport, pitch) {
  const horizonY = viewport.height * (0.48 + pitch);

  context.fillStyle = "#08090b";
  context.fillRect(0, 0, viewport.width, horizonY);

  context.fillStyle = "#16120f";
  context.fillRect(0, horizonY, viewport.width, viewport.height - horizonY);
}

function drawRaycastWalls(context, tilemap, camera, viewport) {
  const projectionDistance = viewport.width / 2 / Math.tan(camera.fov / 2);

  for (let screenX = 0; screenX < viewport.width; screenX += COLUMN_WIDTH) {
    const rayRatio = screenX / viewport.width - 0.5;
    const rayAngle = camera.yaw + rayRatio * camera.fov;
    const hit = castRay(tilemap, camera.position, rayAngle);
    const correctedDistance = Math.max(
      1,
      hit.distance * Math.cos(rayAngle - camera.yaw),
    );
    const wallHeight = WALL_HEIGHT * projectionDistance / correctedDistance;
    const wallTop = viewport.height * (0.5 + camera.pitch) - wallHeight / 2;
    const shade = getWallShade(correctedDistance, hit.axis);

    context.fillStyle = `rgb(${shade}, ${shade}, ${shade + 8})`;
    context.fillRect(screenX, wallTop, COLUMN_WIDTH + 1, wallHeight);
  }
}

function drawProjectedEntities(context, entities, camera, viewport) {
  const projectionDistance = viewport.width / 2 / Math.tan(camera.fov / 2);
  const sortedEntities = [...entities].sort((a, b) => {
    return getDistanceToCamera(b, camera) - getDistanceToCamera(a, camera);
  });

  for (const entity of sortedEntities) {
    if (entity.isPlayer) {
      continue;
    }

    drawProjectedEntity(context, entity, camera, viewport, projectionDistance);
  }
}

function drawProjectedEntity(context, entity, camera, viewport, projectionDistance) {
  const center = getEntityCenter(entity);
  const dx = center.x - camera.position.x;
  const dy = center.y - camera.position.y;
  const distance = Math.hypot(dx, dy);

  if (distance < MIN_ENTITY_DISTANCE) {
    return;
  }

  const angleToEntity = Math.atan2(dy, dx);
  const relativeAngle = normalizeAngle(angleToEntity - camera.yaw);

  if (Math.abs(relativeAngle) > camera.fov * 0.55) {
    return;
  }

  const correctedDistance = Math.max(1, distance * Math.cos(relativeAngle));
  const screenX = viewport.width / 2 + Math.tan(relativeAngle) * projectionDistance;
  const entityHeight = entity.renderable.height * projectionDistance / correctedDistance;
  const entityWidth = entity.renderable.width * projectionDistance / correctedDistance;
  const y = viewport.height * (0.55 + camera.pitch) - entityHeight;

  context.globalAlpha = 0.92;
  context.fillStyle = entity.renderable.color;
  context.fillRect(
    screenX - entityWidth / 2,
    y,
    Math.max(3, entityWidth),
    Math.max(3, entityHeight),
  );
  context.globalAlpha = 1;
}

function drawTransparentPlayerBody(context, viewport) {
  const bodyWidth = viewport.width * 0.22;
  const bodyHeight = viewport.height * 0.28;
  const x = viewport.width / 2 - bodyWidth / 2;
  const y = viewport.height - bodyHeight * 0.82;

  context.globalAlpha = PLAYER_ALPHA;
  context.fillStyle = "#d9d2c3";
  context.fillRect(x, y, bodyWidth, bodyHeight);
  context.fillStyle = "#ffffff";
  context.fillRect(x + bodyWidth * 0.35, y - bodyHeight * 0.18, bodyWidth * 0.3, bodyHeight * 0.2);
  context.globalAlpha = 1;
}

function drawCrosshair(context, viewport) {
  const x = viewport.width / 2;
  const y = viewport.height / 2;

  context.strokeStyle = "rgba(255, 255, 255, 0.45)";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(x - 7, y);
  context.lineTo(x - 2, y);
  context.moveTo(x + 2, y);
  context.lineTo(x + 7, y);
  context.moveTo(x, y - 7);
  context.lineTo(x, y - 2);
  context.moveTo(x, y + 2);
  context.lineTo(x, y + 7);
  context.stroke();
}

function castRay(tilemap, origin, angle) {
  const rayDirection = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
  let previousTileX = Math.floor(origin.x / tilemap.tileSize);

  for (let distance = 0; distance <= MAX_RAY_DISTANCE; distance += RAY_STEP) {
    const x = origin.x + rayDirection.x * distance;
    const y = origin.y + rayDirection.y * distance;
    const tileX = Math.floor(x / tilemap.tileSize);
    const tileY = Math.floor(y / tilemap.tileSize);

    if (isSolidTile(tilemap, tileX, tileY)) {
      return {
        distance,
        axis: tileX !== previousTileX ? "x" : "y",
      };
    }

    previousTileX = tileX;
  }

  return {
    distance: MAX_RAY_DISTANCE,
    axis: "none",
  };
}

function isSolidTile(tilemap, tileX, tileY) {
  if (tileX < 0 || tileX >= tilemap.width || tileY < 0 || tileY >= tilemap.height) {
    return true;
  }

  return tilemap.tiles[tileY][tileX] === "#";
}

function getScaledViewport(camera, pixelRatio) {
  return {
    width: camera.width * pixelRatio,
    height: camera.height * pixelRatio,
  };
}

function getWallShade(distance, axis) {
  const shade = Math.max(38, 150 - distance * 0.12);
  const shadedValue = axis === "x" ? shade : shade * 0.8;

  return Math.floor(shadedValue);
}

function getDistanceToCamera(entity, camera) {
  const center = getEntityCenter(entity);
  return Math.hypot(center.x - camera.position.x, center.y - camera.position.y);
}

function getEntityCenter(entity) {
  return {
    x: entity.position.x + entity.renderable.width / 2,
    y: entity.position.y + entity.renderable.height / 2,
  };
}

function normalizeAngle(angle) {
  let normalized = angle;

  while (normalized > Math.PI) {
    normalized -= Math.PI * 2;
  }

  while (normalized < -Math.PI) {
    normalized += Math.PI * 2;
  }

  return normalized;
}
