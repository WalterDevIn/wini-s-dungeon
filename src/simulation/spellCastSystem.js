import { CommandType } from "../domain/commands.js";
import { getSpellDefinition } from "../content/spells/spellRegistry.js";
import { createSpellProjectile } from "./helpers/spellProjectileFactory.js";

export function spellCastSystem(world, commands) {
  for (const command of commands) {
    if (command.type !== CommandType.Cast) {
      continue;
    }

    const spellDefinition = getSpellDefinition(command.spellId);

    if (!spellDefinition) {
      continue;
    }

    if (!command.targetPoint?.hasPosition) {
      continue;
    }

    createSpellProjectile({
      world,
      actorId: command.actorId,
      targetPoint: command.targetPoint,
      spellDefinition,
    });
  }
}
