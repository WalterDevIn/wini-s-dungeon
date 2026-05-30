import { AttackCommand } from "../domain/commands.js";
import { findPlayerEntity } from "../game/playerQueries.js";

export function collectCommandsFromInput({ world, mouseInput }) {
  if (!mouseInput.consumePrimaryClickIntent()) {
    return {
      commands: [],
      lastCommand: null,
    };
  }

  const playerId = findPlayerEntity(world);

  if (playerId === null) {
    return {
      commands: [],
      lastCommand: null,
    };
  }

  const command = AttackCommand({ actorId: playerId });

  return {
    commands: [command],
    lastCommand: command,
  };
}
