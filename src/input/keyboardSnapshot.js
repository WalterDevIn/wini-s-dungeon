export function buildKeyboardSnapshot({ pressedVisualKeys }) {
  return {
    movement: {
      moveUp: pressedVisualKeys.has("w"),
      moveLeft: pressedVisualKeys.has("a"),
      moveRight: pressedVisualKeys.has("r"),
      moveDown: pressedVisualKeys.has("s"),
    },
    pressedKeys: {
      q: pressedVisualKeys.has("q"),
      f: pressedVisualKeys.has("f"),
      Tab: pressedVisualKeys.has("Tab"),
      Space: pressedVisualKeys.has("Space"),
    },
  };
}
