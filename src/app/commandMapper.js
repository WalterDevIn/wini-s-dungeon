import { AttackCommand, CastCommand } from "../domain/commands.js";
import { findPlayerEntity } from "../game/playerQueries.js";

const PRIMARY_SPELL_ID = "firebolt";

export function collectCommandsFromInput({ world, mouseInput }) {
  const commands = [];
  const attackCommand = consumeAttackCommandFromPrimaryClick({ world, mouseInput });
  const castCommand = consumeFireboltCommandFromSecondaryClick({ world, mouseInput });

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

function consumeFireboltCommandFromSecondaryClick({ world, mouseInput }) {
  if (!mouseInput.consumeSecondaryClickIntent()) {
    return null;
  }

  const playerId = findPlayerEntity(world);

  if (playerId === null) {
    return null;
  }

  const pointer = mouseInput.getSnapshot().pointer;

  if (!pointer.hasPosition) {
    return null;
  }

  return CastCommand({
    actorId: playerId,
    spellId: PRIMARY_SPELL_ID,
    targetPoint: {
      x: pointer.x,
      y: pointer.y,
      hasPosition: pointer.hasPosition,
    },
  });
}
