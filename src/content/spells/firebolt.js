export const firebolt = Object.freeze({
  id: "firebolt",
  name: "Firebolt",
  kind: "spell",
  targeting: Object.freeze({
    type: "point",
  }),
  cast: Object.freeze({
    windupSeconds: 1.5,
    recoverySeconds: 3,
  }),
  effect: Object.freeze({
    type: "spawnProjectile",
    projectile: Object.freeze({
      speed: 260,
      size: 10,
      damage: 3,
      lifetimeSeconds: 1.4,
      color: "#ff7a33",
      glyph: "x",
      fontSize: 16,
      destroyOnWall: true,
      destroyOnHit: true,
    }),
  }),
});
