export function applyDamage(health, amount) {
  health.current = Math.max(0, health.current - amount);
}
