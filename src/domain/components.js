export const ComponentType = Object.freeze({
  Position: "Position",
  Velocity: "Velocity",
  Renderable: "Renderable",
  Collider: "Collider",
  MovementStats: "MovementStats",
  PlayerControlled: "PlayerControlled",
  AIControlled: "AIControlled",
  Health: "Health",
  Creature: "Creature",
  Faction: "Faction",
  ActionEconomy: "ActionEconomy",
  AttackProfile: "AttackProfile",
  DefenseProfile: "DefenseProfile",
  DamageReduction: "DamageReduction",
});

export function Position(x, y) {
  return { x, y };
}

export function Velocity(x = 0, y = 0) {
  return { x, y };
}

export function Renderable({
  shape = "rect",
  width,
  height,
  color,
  glyph = null,
  fontSize = null,
}) {
  return { shape, width, height, color, glyph, fontSize };
}

export function Collider({ width, height }) {
  return { width, height };
}

export function MovementStats({ speed }) {
  return { speed };
}

export function PlayerControlled() {
  return { enabled: true };
}

export function AIControlled({ detectionRange, targetFactionId }) {
  return { detectionRange, targetFactionId };
}

export function Health({ current, max }) {
  return { current, max };
}

export function Creature({ kind }) {
  return { kind };
}

export function Faction({ id }) {
  return { id };
}

export function ActionEconomy({
  currentAction = null,
  phase = null,
  timeRemaining = 0,
  pendingAttack = null,
} = {}) {
  return { currentAction, phase, timeRemaining, pendingAttack };
}

export function AttackProfile({ damage, range, windupSeconds, recoverySeconds }) {
  return { damage, range, windupSeconds, recoverySeconds };
}

export function DefenseProfile({ canBeHit = true } = {}) {
  return { canBeHit };
}

export function DamageReduction({ flat = 0 } = {}) {
  return { flat };
}
