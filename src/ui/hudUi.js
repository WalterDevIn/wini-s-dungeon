const KEYBOARD_CAPS = Object.freeze([
  { code: "moveUp", label: "W", group: "movement-top" },
  { code: "moveLeft", label: "A", group: "movement-bottom" },
  { code: "moveRight", label: "R", group: "movement-bottom" },
  { code: "moveDown", label: "S", group: "movement-bottom" },
  { code: "q", label: "Q", group: "actions" },
  { code: "f", label: "F", group: "actions" },
  { code: "Tab", label: "Tab", group: "actions", size: "tab" },
  { code: "Space", label: "Space", group: "actions", size: "space" },
]);

const MOUSE_CAPS = Object.freeze([
  { code: "leftButtonPressed", label: "LMB" },
  { code: "rightButtonPressed", label: "RMB" },
  { code: "middleButtonPressed", label: "MMB" },
  { code: "button4Pressed", label: "M4" },
  { code: "button5Pressed", label: "M5" },
]);

export function createHudUi(root) {
  root.classList.add("game-ui-root");
  root.innerHTML = `
    <section class="input-hud" aria-label="Entradas presionadas">
      <div class="keyboard-hud" aria-label="Teclado">
        <div class="movement-key-block">
          <div class="movement-key-row movement-key-row-top">
            ${renderKeyCap(KEYBOARD_CAPS[0])}
          </div>
          <div class="movement-key-row movement-key-row-bottom">
            ${KEYBOARD_CAPS.filter((keyCap) => keyCap.group === "movement-bottom").map(renderKeyCap).join("")}
          </div>
        </div>
        <div class="action-key-row">
          ${KEYBOARD_CAPS.filter((keyCap) => keyCap.group === "actions").map(renderKeyCap).join("")}
        </div>
      </div>
      <div class="mouse-hud" aria-label="Mouse">
        ${MOUSE_CAPS.map(renderMouseCap).join("")}
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

  const keyCaps = new Map(
    [...root.querySelectorAll("[data-key-code]")].map((element) => [
      element.dataset.keyCode,
      element,
    ]),
  );
  const mouseCaps = new Map(
    [...root.querySelectorAll("[data-mouse-code]")].map((element) => [
      element.dataset.mouseCode,
      element,
    ]),
  );
  const leftButton = root.querySelector("[data-debug-left-button]");
  const lastCommand = root.querySelector("[data-debug-last-command]");
  const action = root.querySelector("[data-debug-action]");
  const phase = root.querySelector("[data-debug-phase]");
  const time = root.querySelector("[data-debug-time]");

  function update(snapshot) {
    updateKeyboardCaps(keyCaps, snapshot.input.keyboard);
    updateMouseCaps(mouseCaps, snapshot.input.mouse);

    const actionState = snapshot.playerActionState;

    leftButton.textContent = snapshot.input.mouse.leftButtonPressed ? "Sí" : "No";
    lastCommand.textContent = snapshot.lastCommand;
    action.textContent = actionState.currentAction ?? actionState.status;
    phase.textContent = actionState.phase ?? "-";
    time.textContent = `${actionState.timeRemaining.toFixed(2)}s`;
  }

  return {
    update,
  };
}

function renderKeyCap({ code, label, size = "normal" }) {
  const classes = ["key-cap", `key-cap-${size}`].join(" ");
  return `<div class="${classes}" data-key-code="${code}">${label}</div>`;
}

function renderMouseCap({ code, label }) {
  return `<div class="key-cap mouse-cap" data-mouse-code="${code}">${label}</div>`;
}

function updateKeyboardCaps(keyCaps, keyboardInput) {
  const movement = keyboardInput.movement;
  const pressedKeys = keyboardInput.pressedKeys;

  const pressedByCode = {
    moveUp: movement.moveUp,
    moveLeft: movement.moveLeft,
    moveRight: movement.moveRight,
    moveDown: movement.moveDown,
    q: pressedKeys.q,
    f: pressedKeys.f,
    Tab: pressedKeys.Tab,
    Space: pressedKeys.Space,
  };

  for (const [keyCode, keyCap] of keyCaps) {
    keyCap.classList.toggle("is-pressed", Boolean(pressedByCode[keyCode]));
  }
}

function updateMouseCaps(mouseCaps, mouseInput) {
  for (const [mouseCode, mouseCap] of mouseCaps) {
    mouseCap.classList.toggle("is-pressed", Boolean(mouseInput[mouseCode]));
  }
}
