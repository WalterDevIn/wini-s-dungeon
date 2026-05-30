const STONE_CRAWLER_SIZE = 28;

export const stoneCrawlerDefinition = Object.freeze({
  id: "stoneCrawler",
  position: {
    x: 240,
    y: 192,
  },
  renderable: {
    shape: "glyph",
    glyph: "c",
    width: STONE_CRAWLER_SIZE,
    height: STONE_CRAWLER_SIZE,
    color: "#8a8f98",
    fontSize: 30,
  },
  collider: {
    width: STONE_CRAWLER_SIZE,
    height: STONE_CRAWLER_SIZE,
  },
  movementStats: {
    speed: 70,
  },
  controls: {
    aiControlled: {
      detectionRange: 240,
      targetFactionId: "player",
    },
  },
  health: {
    current: 10,
    max: 10,
  },
  creature: {
    kind: "stoneCrawler",
  },
  faction: {
    id: "enemy",
  },
  attackProfile: {
    damage: 1,
    range: 36,
    windupSeconds: 0.25,
    recoverySeconds: 0.8,
  },
  defenseProfile: {},
  damageReduction: {
    flat: 1,
  },
});
