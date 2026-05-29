export function createHudUi(root) {
  root.classList.add("game-ui-root");
  root.innerHTML = `
    <section class="primary-action-card" aria-label="Acción primaria">
      <div class="primary-action-orb" data-primary-action-orb>
        <span class="primary-action-key">LMB</span>
      </div>
      <div class="primary-action-copy">
        <div class="primary-action-title">Ataque</div>
        <div class="primary-action-state" data-primary-action-state>Listo</div>
      </div>
    </section>

    <section class="debug-panel" aria-label="Feedback de simulación">
      <div class="debug-panel-title">Feedback</div>
      <dl class="debug-grid">
        <dt>Click izquierdo</dt>
        <dd data-debug-left-button>No</dd>
        <dt>Último command</dt>
        <dd data-debug-last-command>none</dd>
        <dt>Acción jugador</dt>
        <dd data-debug-action>ready</dd>
        <dt>Fase</dt>
        <dd data-debug-phase>-</dd>
        <dt>Tiempo</dt>
        <dd data-debug-time>0.00s</dd>
      </dl>
    </section>
  `;

  const primaryActionOrb = root.querySelector("[data-primary-action-orb]");
  const primaryActionState = root.querySelector("[data-primary-action-state]");
  const leftButton = root.querySelector("[data-debug-left-button]");
  const lastCommand = root.querySelector("[data-debug-last-command]");
  const action = root.querySelector("[data-debug-action]");
  const phase = root.querySelector("[data-debug-phase]");
  const time = root.querySelector("[data-debug-time]");

  function update(snapshot) {
    const isPressed = snapshot.input.leftButtonPressed;
    const actionState = snapshot.playerActionState;

    primaryActionOrb.classList.toggle("is-pressed", isPressed);
    primaryActionOrb.classList.toggle("is-busy", actionState.status !== "ready");
    primaryActionState.textContent = getPrimaryActionLabel(isPressed, actionState);

    leftButton.textContent = isPressed ? "Sí" : "No";
    lastCommand.textContent = snapshot.lastCommand;
    action.textContent = actionState.currentAction ?? actionState.status;
    phase.textContent = actionState.phase ?? "-";
    time.textContent = `${actionState.timeRemaining.toFixed(2)}s`;
  }

  return {
    update,
  };
}

function getPrimaryActionLabel(isPressed, actionState) {
  if (isPressed) {
    return "Presionado";
  }

  if (actionState.status === "windup") {
    return "Preparando golpe";
  }

  if (actionState.status === "recovery") {
    return "Recuperando";
  }

  if (actionState.status === "missing") {
    return "Sin jugador";
  }

  return "Listo";
}
