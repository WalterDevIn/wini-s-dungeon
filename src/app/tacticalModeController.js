export const GameMode = Object.freeze({
  Running: "running",
  TacticalPaused: "tacticalPaused",
});

export function createTacticalModeController() {
  let mode = GameMode.Running;
  let pendingCommand = null;
  let commandsToRun = [];

  function toggle() {
    if (mode === GameMode.Running) {
      mode = GameMode.TacticalPaused;
      pendingCommand = null;
      commandsToRun = [];
      return;
    }

    mode = GameMode.Running;
    commandsToRun = pendingCommand ? [pendingCommand] : [];
    pendingCommand = null;
  }

  function isPaused() {
    return mode === GameMode.TacticalPaused;
  }

  function prepareCommand(command) {
    if (!isPaused() || !command) {
      return;
    }

    pendingCommand = command;
  }

  function consumeCommandsToRun() {
    const commands = commandsToRun;
    commandsToRun = [];
    return commands;
  }

  function getSnapshot() {
    return {
      mode,
      pendingAction: pendingCommand?.type ?? "none",
    };
  }

  return {
    toggle,
    isPaused,
    prepareCommand,
    consumeCommandsToRun,
    getSnapshot,
  };
}
