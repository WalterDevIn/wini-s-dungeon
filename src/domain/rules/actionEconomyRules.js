export function canStartAction(actionEconomy) {
  return Boolean(actionEconomy) && !actionEconomy.currentAction;
}

export function startAction(
  actionEconomy,
  { currentAction, phase, duration, pendingAttack = null, pendingSpell = null },
) {
  actionEconomy.currentAction = currentAction;
  actionEconomy.phase = phase;
  actionEconomy.timeRemaining = duration;
  actionEconomy.phaseDuration = duration;
  actionEconomy.pendingAttack = pendingAttack;
  actionEconomy.pendingSpell = pendingSpell;
}

export function transitionActionPhase(actionEconomy, { phase, duration }) {
  actionEconomy.phase = phase;
  actionEconomy.timeRemaining = duration;
  actionEconomy.phaseDuration = duration;
}

export function clearAction(actionEconomy) {
  actionEconomy.currentAction = null;
  actionEconomy.phase = null;
  actionEconomy.timeRemaining = 0;
  actionEconomy.phaseDuration = 0;
  actionEconomy.pendingAttack = null;
  actionEconomy.pendingSpell = null;
}
