export const CommandType = Object.freeze({
  Attack: "attack",
});

export function AttackCommand({ actorId, source = "primaryAction" }) {
  return {
    type: CommandType.Attack,
    actorId,
    source,
  };
}
