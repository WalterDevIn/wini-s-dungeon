const QUICK_BAR_INVENTORY_MODE = "inventory";
const QUICK_BAR_SPELLS_MODE = "spells";

export function createQuickBarViewState() {
  let mode = QUICK_BAR_INVENTORY_MODE;
  let wasTogglePressed = false;

  function updateFromKeyboard(keyboardInput) {
    const isTogglePressed = Boolean(keyboardInput.pressedKeys.q);

    if (isTogglePressed && !wasTogglePressed) {
      mode = mode === QUICK_BAR_INVENTORY_MODE
        ? QUICK_BAR_SPELLS_MODE
        : QUICK_BAR_INVENTORY_MODE;
    }

    wasTogglePressed = isTogglePressed;
  }

  function getSnapshot() {
    return {
      mode,
    };
  }

  return {
    updateFromKeyboard,
    getSnapshot,
  };
}
