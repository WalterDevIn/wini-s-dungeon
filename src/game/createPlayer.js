import { createCreature } from "../domain/factories/createCreature.js";

const PLAYER_SIZE = 28;

export function createPlayer(world) {
  return createCreature(world, {
    position: {
      x: 96,
      y: 96,
    },
    renderable: {
      shape: "glyph",
      glyph: "@",
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
      color: "#f5e6b8",
      fontSize: 34,
    },
    collider: {
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
    },
    movementStats: {
      speed: 180,
    },
    controls: {
      playerControlled: true,
    },
    health: {
      current: 10,
      max: 10,
    },
    creature: {
      kind: "player",
    },
    faction: {
      id: "player",
    },
    attackProfile: {
      damage: 2,
      range: 48,
      windupSeconds: 0.1,
      recoverySeconds: 0.35,
    },
    defenseProfile: {},
    damageReduction: {
      flat: 0,
    },
  });
}
