import { AttackCommand } from "../domain/commands.js";
import { findPlayerEntity } from "../game/playerQueries.js";

export function collectCommandsFromInput({ world, mouseInput }) {
  const command = consumeAttackCommandFromPrimaryClick({ world, mouseInput });

  if (!command) {
    return {
      commands: [],
      lastCommand: null,
    };
  }

  return {
    commands: [command],
    lastCommand: command,
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
