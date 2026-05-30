const BAT_SIZE = 20;

export const batDefinition = Object.freeze({
  id: "bat",
  position: {
    x: 240,
    y: 192,
  },
  renderable: {
    shape: "glyph",
    glyph: "b",
    width: BAT_SIZE,
    height: BAT_SIZE,
    color: "#7b6bb3",
    fontSize: 24,
  },
  collider: {
    width: BAT_SIZE,
    height: BAT_SIZE,
  },
  movementStats: {
    speed: 190,
  },
  controls: {
    aiControlled: {
      detectionRange: 240,
      targetFactionId: "player",
    },
  },
  health: {
    current: 2,
    max: 2,
  },
  creature: {
    kind: "bat",
  },
  faction: {
    id: "enemy",
  },
  attackProfile: {
    damage: 1,
    range: 28,
    windupSeconds: 0.05,
    recoverySeconds: 0.5,
  },
  defenseProfile: {},
  damageReduction: {
    flat: 0,
  },
});
