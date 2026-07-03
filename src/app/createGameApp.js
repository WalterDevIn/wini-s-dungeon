import { createWorld } from "../ecs/world.js";
import { createDemoEncounter } from "../game/createDemoEncounter.js";
import { createPlayer } from "../game/createPlayer.js";
import { createKeyboardInput } from "../input/keyboardInput.js";
import { createMouseInput } from "../input/mouseInput.js";
import { tilemap } from "../world/tilemap.js";
import { createCanvasRenderer } from "../render/canvasRenderer.js";
import { createHudUi } from "../ui/hudUi.js";
import { runGameFrame } from "./gameFrame.js";
import { createTacticalModeController } from "./tacticalModeController.js";

export function createGameApp({ canvas, context, uiRoot }) {
  const world = createWorld();
  const keyboardInput = createKeyboardInput();
  const mouseInput = createMouseInput(window);
  const renderer = createCanvasRenderer(canvas, context);
  const hudUi = createHudUi(uiRoot);
  const tacticalMode = createTacticalModeController();
  const frameState = {
    lastFrameTime: performance.now(),
    lastCommand: null,
    renderMode: "firstPerson",
    firstPersonCamera: {
      yaw: 0,
      pitch: 0,
    },
  };

  createPlayer(world);
  createDemoEncounter(world);

  function start() {
    requestAnimationFrame(frame);
  }

  function frame(currentTime) {
    runGameFrame({
      currentTime,
      frameState,
      world,
      tilemap,
      keyboardInput,
      mouseInput,
      renderer,
      hudUi,
      tacticalMode,
    });

    requestAnimationFrame(frame);
  }

  return {
    start,
  };
}
