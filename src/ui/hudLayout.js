const KEYBOARD_CAPS = Object.freeze([
  { code: "Tab", label: "Tab", size: "tab" },
  { code: "q", label: "Q" },
  { code: "moveUp", label: "W" },
  { code: "f", label: "F" },
  { code: "moveLeft", label: "A" },
  { code: "moveRight", label: "R" },
  { code: "moveDown", label: "S" },
  { code: "Space", label: "Space", size: "space" },
]);

const MOUSE_CAPS = Object.freeze([
  { code: "leftButtonPressed", label: "LMB", className: "mouse-cap-lmb" },
  { code: "rightButtonPressed", label: "RMB", className: "mouse-cap-rmb" },
  { code: "button5Pressed", label: "M5", className: "mouse-cap-m5" },
  { code: "wheelPulse", label: "Wheel", className: "mouse-cap-wheel" },
  { code: "button4Pressed", label: "M4", className: "mouse-cap-m4" },
]);

const QUICK_BAR_PAIR_COUNT = 5;
const QUICK_BAR_SLOTS_PER_PAIR = 2;

export function renderHudTemplate() {
  return `
    <div class="cursor-feedback" data-cursor-feedback aria-hidden="true">
      <div class="cursor-ring" data-cursor-ring></div>
      <div class="cursor-crosshair">+</div>
    </div>

    <section class="tactical-status" data-tactical-status aria-label="Modo táctico">
      <span class="tactical-status-title">Pausa</span>
    </section>

    <section class="quick-bar" data-quick-bar aria-label="Barra rápida visual">
      ${renderQuickBarPairs()}
    </section>

    <section class="keyboard-input-hud" aria-label="Teclado">
      <div class="keyboard-key-row keyboard-key-row-top">
        ${KEYBOARD_CAPS.slice(0, 4).map(renderKeyCap).join("")}
      </div>
      <div class="keyboard-key-row keyboard-key-row-middle">
        ${KEYBOARD_CAPS.slice(4, 7).map(renderKeyCap).join("")}
      </div>
      <div class="keyboard-key-row keyboard-key-row-bottom">
        ${renderKeyCap(KEYBOARD_CAPS[7])}
      </div>
    </section>

    <section class="mouse-input-hud" aria-label="Mouse">
      <div class="wheel-feedback" data-wheel-feedback aria-label="Giro de rueda">
        <span class="wheel-feedback-label">Wheel</span>
        <span class="wheel-feedback-direction" data-wheel-direction>-</span>
        <span class="wheel-feedback-index" data-wheel-index-small>0</span>
      </div>
      <div class="mouse-hud" aria-label="Botones del mouse">
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

function renderQuickBarPairs() {
  return Array.from({ length: QUICK_BAR_PAIR_COUNT }, (_, pairIndex) => {
    const slots = Array.from({ length: QUICK_BAR_SLOTS_PER_PAIR }, (_, slotIndex) => {
      const slotNumber = pairIndex * QUICK_BAR_SLOTS_PER_PAIR + slotIndex + 1;
      return `<div class="quick-bar-slot" data-quick-bar-slot="${slotNumber}"></div>`;
    }).join("");

    return `
      <div class="quick-bar-pair" data-quick-bar-pair="${pairIndex}">
        ${slots}
      </div>
    `;
  }).join("");
}

function renderKeyCap({ code, label, size = "normal" }) {
  const classes = ["key-cap", `key-cap-${size}`].join(" ");
  return `<div class="${classes}" data-key-code="${code}">${label}</div>`;
}

function renderMouseCap({ code, label, className }) {
  return `<div class="key-cap mouse-cap ${className}" data-mouse-code="${code}">${label}</div>`;
}
