export const ComponentType = Object.freeze({
  Position: "Position",
  Velocity: "Velocity",
  Renderable: "Renderable",
  Collider: "Collider",
  MovementStats: "MovementStats",
  PlayerControlled: "PlayerControlled",
});

export function Position(x, y) {
  return { x, y };
}

export function Velocity(x = 0, y = 0) {
  return { x, y };
}

export function Renderable({ shape = "rect", width, height, color }) {
  return { shape, width, height, color };
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
