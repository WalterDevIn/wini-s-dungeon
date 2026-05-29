import { getDistanceBetweenRects } from "./geometryRules.js";

export function isWithinAttackRange(
  attackerPosition,
  attackerCollider,
  targetPosition,
  targetCollider,
  range,
) {
  return (
    getDistanceBetweenRects(
      attackerPosition,
      attackerCollider,
      targetPosition,
      targetCollider,
    ) <= range
  );
}
