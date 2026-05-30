import { createCreature } from "../domain/factories/createCreature.js";

const ENEMY_SIZE = 28;

export function createEnemy(world) {
  return createCreature(world, {
    position: {
      x: 240,
      y: 192,
    },
    renderable: {
      shape: "glyph",
      glyph: "e",
      width: ENEMY_SIZE,
      height: ENEMY_SIZE,
      color: "#ff6b6b",
      fontSize: 32,
    },
    collider: {
      width: ENEMY_SIZE,
      height: ENEMY_SIZE,
    },
    movementStats: {
      speed: 120,
    },
    controls: {
      aiControlled: {
        detectionRange: 240,
        targetFactionId: "player",
      },
    },
    health: {
      current: 6,
      max: 6,
    },
    creature: {
      kind: "enemy",
    },
    faction: {
      id: "enemy",
    },
    attackProfile: {
      damage: 1,
      range: 42,
      windupSeconds: 0.2,
      recoverySeconds: 0.6,
    },
    defenseProfile: {},
    damageReduction: {
      flat: 1,
    },
  });
}
