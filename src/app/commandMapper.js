import { AttackCommand, CastCommand } from "../domain/commands.js";
import { findPlayerEntity } from "../game/playerQueries.js";

const PRIMARY_SPELL_ID = "firebolt";

export function collectCommandsFromInput({ world, mouseInput, mouseSnapshot, screenToWorldPoint }) {
  const commands = [];
  const attackCommand = consumeAttackCommandFromPrimaryClick({ world, mouseInput });
  const castCommand = consumeFireboltCommandFromSecondaryClick({
    world,
    mouseInput,
    mouseSnapshot,
    screenToWorldPoint,
  });

  if (attackCommand) {
    commands.push(attackCommand);
  }

  if (castCommand) {
    commands.push(castCommand);
  }

  return {
    commands,
    lastCommand: commands.at(-1) ?? null,
  };
}

export function consumeAttackCommandFromPrimaryClick({ world, mouseInput }) {
  if (!mouseInput.consumePrimaryClickIntent()) {
    return null;
  }

  const playerId = findPlayerEntity(world);

  if (playerId === null) {
    return null;
  }

  return AttackCommand({ actorId: playerId });
}

function consumeFireboltCommandFromSecondaryClick({
  world,
  mouseInput,
  mouseSnapshot,
  screenToWorldPoint,
}) {
  if (!mouseInput.consumeSecondaryClickIntent()) {
    return null;
  }

  const playerId = findPlayerEntity(world);

  if (playerId === null) {
    return null;
  }

  const pointer = mouseSnapshot.pointer;

  if (!pointer.hasPosition) {
    return null;
  }

  const targetPoint = screenToWorldPoint(pointer);

  return CastCommand({
    actorId: playerId,
    spellId: PRIMARY_SPELL_ID,
    targetPoint: {
      x: targetPoint.x,
      y: targetPoint.y,
      hasPosition: targetPoint.hasPosition,
    },
  });
}
