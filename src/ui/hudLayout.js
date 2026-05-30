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
  { code: "wheelPulse", label: "Wheel" },
  { code: "button4Pressed", label: "M4" },
  { code: "button5Pressed", label: "M5" },
]);

export function renderHudTemplate() {
  return `
    <section class="tactical-status" data-tactical-status aria-label="Modo táctico">
      <span class="tactical-status-title">Tactical</span>
      <span class="tactical-status-mode" data-tactical-mode>running</span>
      <span class="tactical-status-action" data-tactical-pending-action>none</span>
    </section>

    <section class="wheel-feedback" data-wheel-feedback aria-label="Giro de rueda">
      <span class="wheel-feedback-label">Wheel</span>
      <span class="wheel-feedback-direction" data-wheel-direction>-</span>
      <span class="wheel-feedback-index" data-wheel-index-small>0</span>
    </section>

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
        <dt>Modo</dt>
        <dd data-debug-tactical-mode>running</dd>
        <dt>Preparada</dt>
        <dd data-debug-pending-action>none</dd>
        <dt>Click izquierdo</dt>
        <dd data-debug-left-button>No</dd>
        <dt>Rodillo</dt>
        <dd data-debug-wheel-index>0</dd>
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
}

function renderKeyCap({ code, label, size = "normal" }) {
  const classes = ["key-cap", `key-cap-${size}`].join(" ");
  return `<div class="${classes}" data-key-code="${code}">${label}</div>`;
}

function renderMouseCap({ code, label }) {
  return `<div class="key-cap mouse-cap" data-mouse-code="${code}">${label}</div>`;
}
