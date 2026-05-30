const PLAYER_SIZE = 28;

export const humanAdventurerDefinition = Object.freeze({
  id: "humanAdventurer",
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
    kind: "human",
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
