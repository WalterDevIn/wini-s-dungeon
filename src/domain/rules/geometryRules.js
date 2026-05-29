export function getRectCenter(position, collider) {
  return {
    x: position.x + collider.width / 2,
    y: position.y + collider.height / 2,
  };
}

export function getDistanceBetweenRects(
  firstPosition,
  firstCollider,
  secondPosition,
  secondCollider,
) {
  const firstCenter = getRectCenter(firstPosition, firstCollider);
  const secondCenter = getRectCenter(secondPosition, secondCollider);

  return Math.hypot(secondCenter.x - firstCenter.x, secondCenter.y - firstCenter.y);
}
