const KEY_CAPS = Object.freeze([
  { code: "KeyW", label: "W" },
  { code: "KeyA", label: "A" },
  { code: "KeyS", label: "S" },
  { code: "KeyD", label: "D" },
  { code: "KeyQ", label: "Q" },
  { code: "KeyF", label: "F" },
  { code: "Space", label: "Space", wide: true },
  { code: "LMB", label: "LMB" },
]);

export function createHudUi(root) {
  root.classList.add("game-ui-root");
  root.innerHTML = `
    <section class="key-hud" aria-label="Teclas presionadas">
      ${KEY_CAPS.map(renderKeyCap).join("")}
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

  const keyCaps = new Map(
    [...root.querySelectorAll("[data-key-code]")].map((element) => [
      element.dataset.keyCode,
      element,
    ]),
  );
  const leftButton = root.querySelector("[data-debug-left-button]");
  const lastCommand = root.querySelector("[data-debug-last-command]");
  const action = root.querySelector("[data-debug-action]");
  const phase = root.querySelector("[data-debug-phase]");
  const time = root.querySelector("[data-debug-time]");

  function update(snapshot) {
    updateKeyCaps(keyCaps, snapshot.input);

    const actionState = snapshot.playerActionState;

    leftButton.textContent = snapshot.input.leftButtonPressed ? "Sí" : "No";
    lastCommand.textContent = snapshot.lastCommand;
    action.textContent = actionState.currentAction ?? actionState.status;
    phase.textContent = actionState.phase ?? "-";
    time.textContent = `${actionState.timeRemaining.toFixed(2)}s`;
  }

  return {
    update,
  };
}

function renderKeyCap({ code, label, wide = false }) {
  const classes = ["key-cap", wide ? "key-cap-wide" : ""].filter(Boolean).join(" ");
  return `<div class="${classes}" data-key-code="${code}">${label}</div>`;
}

function updateKeyCaps(keyCaps, input) {
  for (const [keyCode, keyCap] of keyCaps) {
    const isPressed = keyCode === "LMB"
      ? input.leftButtonPressed
      : Boolean(input.pressedKeys[keyCode]);

    keyCap.classList.toggle("is-pressed", isPressed);
  }
}
