export function isWithinAttackRange(
  attackerPosition,
  attackerCollider,
  targetPosition,
  targetCollider,
  range,
) {
  const attackerCenter = getRectCenter(attackerPosition, attackerCollider);
  const targetCenter = getRectCenter(targetPosition, targetCollider);
  const distance = Math.hypot(
    targetCenter.x - attackerCenter.x,
    targetCenter.y - attackerCenter.y,
  );

  return distance <= range;
}

function getRectCenter(position, collider) {
  return {
    x: position.x + collider.width / 2,
    y: position.y + collider.height / 2,
  };
}
