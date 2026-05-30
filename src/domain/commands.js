export const CommandType = Object.freeze({
  Attack: "attack",
  Cast: "cast",
});

export function AttackCommand({ actorId, source = "primaryAction" }) {
  return {
    type: CommandType.Attack,
    actorId,
    source,
  };
}

export function CastCommand({
  actorId,
  spellId,
  targetPoint,
  source = "secondaryAction",
}) {
  return {
    type: CommandType.Cast,
    actorId,
    spellId,
    initialTargetPoint: targetPoint,
    source,
  };
}
