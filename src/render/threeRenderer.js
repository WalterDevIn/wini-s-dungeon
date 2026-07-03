import {
  createThreeScene,
  resizeThreeScene,
  updateThreeCamera,
} from "./threeSceneFactory.js";
import { createThreeTilemapRenderer } from "./threeTilemapRenderer.js";
import { createThreeEntityRenderer } from "./threeEntityRenderer.js";

export function createThreeRenderer(canvas) {
  const threeScene = createThreeScene({ canvas });
  const tilemapRenderer = createThreeTilemapRenderer({
    tilemapGroup: threeScene.tilemapGroup,
    geometries: threeScene.geometries,
    materials: threeScene.materials,
  });
  const entityRenderer = createThreeEntityRenderer({
    entityGroup: threeScene.entityGroup,
    geometries: threeScene.geometries,
    materials: threeScene.materials,
  });

  function getViewport() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  function render(renderSnapshot) {
    const viewport = getViewport();

    resizeThreeScene({
      renderer: threeScene.renderer,
      cameras: threeScene.cameras,
      canvas,
      viewport,
    });

    const activeCamera = updateThreeCamera({
      cameras: threeScene.cameras,
      tilemap: renderSnapshot.tilemap,
      cameraSnapshot: renderSnapshot.camera,
    });

    tilemapRenderer.renderTilemap(renderSnapshot.tilemap);
    entityRenderer.renderEntities(
      renderSnapshot.entities,
      renderSnapshot.tilemap,
      renderSnapshot.camera.mode,
    );
    threeScene.renderer.render(threeScene.scene, activeCamera);
  }

  return {
    getViewport,
    render,
  };
}
