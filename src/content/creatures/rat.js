const RAT_SIZE = 20;

export const ratDefinition = Object.freeze({
  id: "rat",
  position: {
    x: 240,
    y: 192,
  },
  renderable: {
    shape: "glyph",
    glyph: "r",
    width: RAT_SIZE,
    height: RAT_SIZE,
    color: "#9b7f62",
    fontSize: 24,
  },
  collider: {
    width: RAT_SIZE,
    height: RAT_SIZE,
  },
  movementStats: {
    speed: 155,
  },
  controls: {
    aiControlled: {
      detectionRange: 240,
      targetFactionId: "player",
    },
  },
  health: {
    current: 3,
    max: 3,
  },
  creature: {
    kind: "rat",
  },
  faction: {
    id: "enemy",
  },
  attackProfile: {
    damage: 1,
    range: 30,
    windupSeconds: 0.08,
    recoverySeconds: 0.45,
  },
  defenseProfile: {},
  damageReduction: {
    flat: 0,
  },
});
