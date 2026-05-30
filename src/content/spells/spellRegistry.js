import { firebolt } from "./firebolt.js";

const SPELL_DEFINITIONS = Object.freeze({
  [firebolt.id]: firebolt,
});

export function getSpellDefinition(spellId) {
  return SPELL_DEFINITIONS[spellId] ?? null;
}
