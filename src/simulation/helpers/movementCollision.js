import { collidesWithSolidTile } from "../../world/tilemap.js";

export function moveWithTileCollision(tilemap, position, collider, deltaX, deltaY) {
  moveAxis(tilemap, position, collider, deltaX, 0);
  moveAxis(tilemap, position, collider, 0, deltaY);
}

function moveAxis(tilemap, position, collider, deltaX, deltaY) {
  if (deltaX === 0 && deltaY === 0) {
    return;
  }

  const nextPosition = {
    x: position.x + deltaX,
    y: position.y + deltaY,
  };

  const nextRect = {
    x: nextPosition.x,
    y: nextPosition.y,
    width: collider.width,
    height: collider.height,
  };

  if (collidesWithSolidTile(tilemap, nextRect)) {
    return;
  }

  position.x = nextPosition.x;
  position.y = nextPosition.y;
}
