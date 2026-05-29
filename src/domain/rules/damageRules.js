export function calculateMitigatedDamage(amount, damageReduction = null) {
  const reduction = damageReduction?.flat ?? 0;
  return Math.max(0, amount - reduction);
}

export function applyDamage(health, amount, damageReduction = null) {
  const finalDamage = calculateMitigatedDamage(amount, damageReduction);
  health.current = Math.max(0, health.current - finalDamage);
  return finalDamage;
}
