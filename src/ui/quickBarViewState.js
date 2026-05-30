const QUICK_BAR_INVENTORY_MODE = "inventory";
const QUICK_BAR_SPELLS_MODE = "spells";
const QUICK_BAR_FEATURES_MODE = "features";

export function createQuickBarViewState() {
  let mode = QUICK_BAR_INVENTORY_MODE;
  let wasSpellTogglePressed = false;
  let wasFeatureTogglePressed = false;

  function updateFromKeyboard(keyboardInput) {
    const isSpellTogglePressed = Boolean(keyboardInput.pressedKeys.q);
    const isFeatureTogglePressed = Boolean(keyboardInput.pressedKeys.f);

    if (isSpellTogglePressed && !wasSpellTogglePressed) {
      mode = mode === QUICK_BAR_SPELLS_MODE
        ? QUICK_BAR_INVENTORY_MODE
        : QUICK_BAR_SPELLS_MODE;
    }

    if (isFeatureTogglePressed && !wasFeatureTogglePressed) {
      mode = mode === QUICK_BAR_FEATURES_MODE
        ? QUICK_BAR_INVENTORY_MODE
        : QUICK_BAR_FEATURES_MODE;
    }

    wasSpellTogglePressed = isSpellTogglePressed;
    wasFeatureTogglePressed = isFeatureTogglePressed;
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
